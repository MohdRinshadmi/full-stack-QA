# Senior Full-Stack Engineer — Interview Master Bank

**536 questions with full answers, 849 pages**, generated as a designed PDF.
Mapped to the stack on the résumé: React · Next.js · React Native · TypeScript ·
Node/Express · Python · Golang/Gin · MySQL/Sequelize · PostgreSQL · MongoDB · Redis ·
AWS · Docker · Nginx/PM2 · CI/CD · Stripe/PayPal/Razorpay · RAG/LLMs/pgvector ·
WebSockets/Yjs · Clean Architecture.

Every claim, number and technology is checked against the résumé itself. Production
work (Infinite Open Source Solution LLP — Express/Sequelize on **MySQL**, payments,
Docker/Nginx/PM2 on VPS and AWS, React Native in both stores) and self-initiated
projects (Golang/Gin, pgvector/RAG, Yjs/WebSockets — **no commercial users**) are
kept deliberately separate, because blurring them is what loses credibility in a
deep-dive round.

## Output

| File | Contents | Questions | Pages |
|---|---|---:|---:|
| `build/master.pdf` | Everything, one book | **536** | 849 |
| `build/part1.pdf` | Fundamentals | 164 | 241 |
| `build/part2.pdf` | Intermediate & Production | 169 | 290 |
| `build/part3.pdf` | Hard & Senior-Level | 103 | 163 |
| `build/part4.pdf` | Scenario & System Design | 100 | 163 |

## Answer format

Every question has:

- **Interview answer** — the 20–40 second spoken answer
- **Deep dive** — the mechanism, for the "why?" follow-up
- **Senior angle** — trade-offs, failure modes, what it costs in production
- **Code / architecture** — copy-ready code or an ASCII diagram you can whiteboard
- **Likely follow-up + your answer** — the question that is actually being scored
- **Red flags** — answers that silently cost you the offer

## Rebuilding

```bash
npm install
node build.js          # all parts  → build/master.html
node build-parts.js    # per part   → build/part{1..4}.html
node render.js build/master.html build/master.pdf
for n in 1 2 3 4; do node render.js build/part$n.html build/part$n.pdf; done
```

Rendering uses your installed Google Chrome via `puppeteer-core`
(path is set at the top of `render.js`).

## Editing the content

Content lives in plain-text files under `src/parts/`. The format is line-based:

```
# SECTION Section Title | one-line subtitle

### The question text
@short
The 20–40 second answer.
@deep
Paragraphs. Blank line separates them.
- bullet lists work
| tables | work |
@code ts Optional caption
const code = 'goes here';
@end
@arch Optional caption
  ASCII diagram
@end
@followup
The follow-up question.
@answer
Your answer to it.
@red
- Red flag one
- Red flag two
```

Inline: `` `code` ``, `**bold**`, `*italic*`, `->` renders as an arrow.

- `src/style.css` — print stylesheet (A4, page breaks, colour system)
- `src/hl.css` — code syntax colours
- `src/howto.html` — the "How to use this book" page
- `src/config.js` — title, owner, stack chips, part metadata

Unknown code languages fall back to auto-detection, so new fences are safe to add.
