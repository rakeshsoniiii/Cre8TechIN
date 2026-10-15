import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
// Parse only public metadata; never execute the reference project or read its environment.
const source=process.argv[2];
assert(source?.endsWith('courses.js'),'Pass the public courses.js file');
const text=await readFile(source,'utf8');
const courses=[...text.matchAll(/^    id: '([^']+)',([\s\S]*?)(?=^    id: '|^\];)/gm)].map(([,id,section])=>{
 const value=key=>section.match(new RegExp(`^    ${key}: '([^']+)'`,'m'))?.[1];
 const videos=[...section.matchAll(/https:\/\/www\.youtube\.com\/embed\/([\w-]{11})(?=')/g)].map(m=>m[1]);
 assert(value('title')&&videos.length>=4,`Incomplete course ${id}`);
 return {id,title:value('title'),description:value('description'),category:value('category'),difficulty:value('difficulty'),videos:[...new Set(videos)]};
});
assert(courses.length>=20 && new Set(courses.map(c=>c.id)).size===courses.length);
await writeFile('src/course-library.json',JSON.stringify(courses,null,2)+'\n');
console.log(`Imported ${courses.length} courses with ${courses.reduce((n,c)=>n+c.videos.length,0)} lecture references.`);
