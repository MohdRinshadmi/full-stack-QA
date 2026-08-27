module.exports = {
  title: 'Senior Full-Stack Engineer — Interview Master Bank',
  owner: 'Abdul Majeed',
  role: 'Senior Full-Stack Engineer',
  year: '2026',
  out: __dirname + '/../build/master.html',
  stack: ['React','Next.js','React Native','TypeScript','Node.js','Express','Golang / Gin','PostgreSQL','MySQL','MongoDB','Redis','AWS','Docker','CI/CD','Stripe · PayPal · Razorpay','RAG / LLMs','pgvector','WebSockets · Yjs','Clean Architecture','Testing'],
  parts: [
    { n:1, file:'src/parts/part1.txt', title:'Fundamentals', level:'Beginner → Early-mid',
      sub:'Everything a senior engineer must be able to answer instantly, without thinking. The answers are written so you sound senior even on a "basic" question.' },
    { n:2, file:'src/parts/part2.txt', title:'Intermediate & Production', level:'Mid → Senior',
      sub:'The engineering that happens between "it works" and "it works at 3am under load". Mapped directly to the systems on your résumé.' },
    { n:3, file:'src/parts/part3.txt', title:'Hard & Senior-Level', level:'Senior → Staff track',
      sub:'Distributed systems, database internals, Node internals, AI/RAG engineering and real-time CRDT systems — the rounds that decide your level and your offer.' },
    { n:4, file:'src/parts/part4.txt', title:'Scenario & System Design', level:'Senior interview loop',
      sub:'100+ real production incidents and design prompts, each answered the way a senior engineer reasons out loud: diagnose, hypothesise, measure, fix, prevent.' },
  ],
};
