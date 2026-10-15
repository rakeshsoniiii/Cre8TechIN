import { build } from 'esbuild';
import { navigation } from '../src/navigation-template.mjs';
import { readFile, writeFile } from 'node:fs/promises';
const pages = {
 learn: ['Make room for a new skill.', 'Explore lectures, keep notes and build your personal learning path.'],
 certifications: ['Your work, recognised.', 'Understand the credentials you can earn through reviewed project work.'],
 leaderboard: ['Ideas worth building.', 'A community showcase for projects and original ideas.'],
 programs: ['Choose your next chapter.', 'Explore practical learning programs, projects and supported durations.'],
 apply: ['Start with your curiosity.', 'One application. A clear path from learning to building.'],
 login: ['Welcome to your workspace.', 'Sign in to track applications, learning and credentials.'],
 dashboard: ['Your work. Your progress.', 'Applications, learning milestones and verified documents in one place.'],
 admin: ['The program desk.', 'Review applications, guide students and manage credentials.'],
 verify: ['Proof you can trust.', 'Check an issued Cre8TechIN credential by its unique reference.'],
 privacy: ['Your data, with purpose.', 'How this platform handles applications and learning records.'],
 terms: ['A clear starting point.', 'Program participation and credential terms.']
};
for (const [page,[title,description]] of Object.entries(pages)) {
 await writeFile(`dist/${page}.html`, `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Cre8TechIN</title><meta name="description" content="${description}"><meta property="og:title" content="${title} | Cre8TechIN"><meta property="og:description" content="${description}"><meta name="theme-color" content="#11120f"><link rel="stylesheet" href="/platform.css"><link rel="stylesheet" href="/navigation.css"><script type="module" src="/navigation.js"></script><script type="module" src="/platform.js"></script></head><body data-page="${page}"><a class="skip" href="#workspace">Skip to content</a>${navigation()}<main id="workspace"><div class="intro"><span class="eyebrow">CRE8TECHIN / ${page.toUpperCase()}</span><h1>${title}</h1><p>${description}</p></div><div id="notice" role="status" aria-live="polite"></div><div id="content"><p>Loading workspace…</p></div><noscript>Enable JavaScript to use the secure student platform.</noscript></main><footer><a href="/">The story</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/admin.html">Administration</a><span>Create Tech for India First.</span></footer></body></html>`);
}
const homepage=await readFile('dist/index.html','utf8');
await writeFile('dist/index.html',homepage.replace(/<header class="header[^"]*">[\s\S]*?<\/header>/,navigation(true)));
await build({entryPoints:['src/platform.js','src/navigation.js'],outdir:'dist',bundle:true,splitting:true,minify:true,format:'esm',target:'es2022',legalComments:'eof'});
console.log('Built platform pages and bundled Supabase client.');
