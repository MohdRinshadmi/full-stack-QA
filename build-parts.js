const { build } = require('./build');
const base = require('./src/config');

const SUB = {
  1: 'Part 1 — Fundamentals',
  2: 'Part 2 — Intermediate & Production',
  3: 'Part 3 — Hard & Senior-Level',
  4: 'Part 4 — Scenario & System Design',
};

for (const p of base.parts) {
  build({
    ...base,
    title: `${base.title} — ${SUB[p.n]}`,
    parts: [p],
    out: `${__dirname}/build/part${p.n}.html`,
    _qn: undefined,
  });
}
