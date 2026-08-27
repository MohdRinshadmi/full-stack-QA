const fs = require('fs');
const path = require('path');
const hljs = require('highlight.js');

/* ---------------- inline + prose ---------------- */
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function inline(s){
  return esc(s)
    .replace(/`([^`]+)`/g,'<code class="ic">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
    .replace(/(?<!\w)_([^_]+)_(?!\w)/g,'<em>$1</em>')
    .replace(/\*([^*\n]+)\*/g,'<em>$1</em>')
    .replace(/-&gt;/g,'→');
}
function prose(text){
  const blocks = text.trim().split(/\n{2,}/);
  return blocks.map(b=>{
    const lines=b.split('\n');
    if(lines.every(l=>/^\s*[-*]\s+/.test(l)))
      return '<ul>'+lines.map(l=>'<li>'+inline(l.replace(/^\s*[-*]\s+/,''))+'</li>').join('')+'</ul>';
    if(lines.every(l=>/^\s*\d+\.\s+/.test(l)))
      return '<ol>'+lines.map(l=>'<li>'+inline(l.replace(/^\s*\d+\.\s+/,''))+'</li>').join('')+'</ol>';
    if(lines[0].startsWith('|')){ // table
      const rows=lines.filter(l=>!/^\|[\s:\-|]+\|$/.test(l)).map(l=>l.replace(/^\||\|$/g,'').split('|').map(c=>c.trim()));
      const head=rows.shift();
      return '<table><thead><tr>'+head.map(c=>'<th>'+inline(c)+'</th>').join('')+'</tr></thead><tbody>'+
        rows.map(r=>'<tr>'+r.map(c=>'<td>'+inline(c)+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
    }
    return '<p>'+inline(b.replace(/\n/g,' '))+'</p>';
  }).join('');
}
const LANG_ALIAS = { hcl:'ruby', terraform:'ruby', tf:'ruby', proto:'protobuf', env:'ini', prisma:'graphql' };
function codeBlock(lang, caption, code){
  let html;
  const l = hljs.getLanguage(lang) ? lang : (LANG_ALIAS[lang] && hljs.getLanguage(LANG_ALIAS[lang]) ? LANG_ALIAS[lang] : null);
  try { html = l ? hljs.highlight(code, {language: l}).value : hljs.highlightAuto(code).value; }
  catch(e){ html = esc(code); }
  return `<figure class="code"><figcaption><span class="lang">${esc(lang)}</span>${caption?'<span class="cap">'+inline(caption)+'</span>':''}</figcaption><pre><code>${html}</code></pre></figure>`;
}
function archBlock(caption, code){
  return `<figure class="arch"><figcaption><span class="lang">architecture</span>${caption?'<span class="cap">'+inline(caption)+'</span>':''}</figcaption><pre>${esc(code)}</pre></figure>`;
}

/* ---------------- parser ---------------- */
function parse(src){
  const lines = src.split('\n');
  const sections = [];
  let sec=null, q=null, key=null, buf=[], pending=null;
  const flush=()=>{ if(q&&key){ const v=buf.join('\n'); if(v.trim()) q.blocks.push({type:key, value:v, meta:pending}); } buf=[]; key=null; pending=null; };
  for(let i=0;i<lines.length;i++){
    const L=lines[i];
    if(L.startsWith('# SECTION ')){ flush(); q=null;
      const [t,s]=L.slice(10).split('|');
      sec={title:t.trim(), sub:(s||'').trim(), qs:[]}; sections.push(sec); continue; }
    if(L.startsWith('### ')){ flush(); q={q:L.slice(4).trim(), blocks:[]}; sec.qs.push(q); continue; }
    const m=L.match(/^@(short|deep|senior|example|followup|answer|red)\s*$/);
    if(m){ flush(); key=m[1]; continue; }
    const c=L.match(/^@code\s+(\S+)\s*(.*)$/);
    if(c){ flush(); key='code'; pending={lang:c[1], cap:c[2]}; continue; }
    const a=L.match(/^@arch\s*(.*)$/);
    if(a){ flush(); key='arch'; pending={cap:a[1]}; continue; }
    if(L.trim()==='@end'){ flush(); continue; }
    if(key) buf.push(L);
  }
  flush();
  return sections;
}

/* ---------------- render ---------------- */
const LABEL={
  short:['Interview answer (say this)','a-short'],
  deep:['Deep dive','a-deep'],
  senior:['Senior angle','a-senior'],
  example:['Production example','a-ex'],
  followup:['Likely follow-up','a-fu'],
  answer:['Your answer','a-fa'],
  red:['Red flags — do not say','a-red'],
};
function renderQ(q, n){
  let out=`<article class="q"><div class="qhead"><span class="qnum">${n}</span><h3>${inline(q.q)}</h3></div><div class="qbody">`;
  for(const b of q.blocks){
    if(b.type==='code'){ out+=codeBlock(b.meta.lang,b.meta.cap,b.value.replace(/\n+$/,'')); continue; }
    if(b.type==='arch'){ out+=archBlock(b.meta.cap,b.value.replace(/\n+$/,'')); continue; }
    const [label,cls]=LABEL[b.type];
    out+=`<div class="blk ${cls}"><span class="blabel">${label}</span>${prose(b.value)}</div>`;
  }
  return out+'</div></article>';
}

function build(cfg){
  const css = fs.readFileSync(path.join(__dirname,'src/style.css'),'utf8');
  const hlcss = fs.readFileSync(path.join(__dirname,'src/hl.css'),'utf8');
  let parts=[];
  let toc='';
  let counter=0;
  for(const p of cfg.parts){
    const sections=parse(fs.readFileSync(path.join(__dirname,p.file),'utf8'));
    const total=sections.reduce((a,s)=>a+s.qs.length,0);
    const pid='part-'+p.n;
    let html=`<section class="divider" id="${pid}"><div class="dv"><span class="dvkicker">Part ${p.n} of ${cfg.parts.length}</span><h1>${p.title}</h1><p class="dvsub">${p.sub}</p><div class="dvmeta"><span><b>${total}</b> questions</span><span><b>${sections.length}</b> sections</span><span>${p.level}</span></div><ul class="dvlist">${sections.map(s=>`<li>${esc(s.title)}<span>${s.qs.length}</span></li>`).join('')}</ul></div></section>`;
    toc+=`<div class="tocpart"><a class="tocp" href="#${pid}"><span class="tn">Part ${p.n}</span><span class="tt">${esc(p.title)}</span><span class="tc">${total} Q</span></a><ul class="tocsecs">`;
    for(const s of sections){
      const sid='s-'+(++counter);
      toc+=`<li><a href="#${sid}">${esc(s.title)}<span>${s.qs.length}</span></a></li>`;
      html+=`<section class="sec" id="${sid}"><header class="sechead"><span class="seckick">Part ${p.n}</span><h2>${esc(s.title)}</h2>${s.sub?`<p>${inline(s.sub)}</p>`:''}</header>`;
      s.qs.forEach(q=>{ html+=renderQ(q,++cfg._qn||(cfg._qn=1)); });
      html+='</section>';
    }
    toc+='</ul></div>';
    parts.push(html);
  }
  const grand=cfg._qn;
  const cover=`<section class="cover">
  <div class="coverbg"></div>
  <div class="coverinner">
    <span class="ckick">Interview Preparation · ${cfg.year}</span>
    <h1>Senior Full-Stack<br/>Engineer</h1>
    <h2>Interview Master Bank</h2>
    <p class="clead">${grand}+ questions with interview-ready answers, deep technical explanations, production code, architecture diagrams, follow-ups and red flags — mapped to the exact stack on your résumé.</p>
    <div class="chips">${cfg.stack.map(s=>`<span>${esc(s)}</span>`).join('')}</div>
    <div class="cmeta"><div><b>${grand}+</b><span>Questions</span></div><div><b>4</b><span>Parts</span></div></div>
    <div class="cfoot"><span>${esc(cfg.owner)}</span><span>${esc(cfg.role)}</span></div>
  </div></section>`;
  const tocPage=`<section class="tocpage"><h1 class="pgtitle">Contents</h1><div class="toc">${toc}</div></section>`;
  const howto=fs.existsSync(path.join(__dirname,'src/howto.html'))?fs.readFileSync(path.join(__dirname,'src/howto.html'),'utf8'):'';
  const doc=`<!doctype html><html><head><meta charset="utf-8"><title>${cfg.title}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>${css}\n${hlcss}</style></head><body>${cover}${tocPage}${howto}${parts.join('')}</body></html>`;
  fs.writeFileSync(cfg.out, doc);
  console.log('HTML built:', cfg.out, '| questions:', grand);
}
module.exports={build};
if(require.main===module) build(require(path.join(__dirname,'src/config.js')));
