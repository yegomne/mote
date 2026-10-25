import fs from 'node:fs';
import path from 'node:path';

const out=path.resolve('dist/assets/gear');
fs.mkdirSync(out,{recursive:true});
const tiers=[
 {gem:'#36df81',edge:'#d8b665',light:'#c4ffc9'},
 {gem:'#42bfff',edge:'#d8e7ff',light:'#d8f6ff'},
 {gem:'#ff703d',edge:'#ffd272',light:'#ffe4b5'},
 {gem:'#aa66ff',edge:'#ffe2a3',light:'#f2d4ff'}
];
const shapes={
 staff:`<path d="M80 145V72" stroke="url(#metal)" stroke-width="8" stroke-linecap="round"/><path d="M80 122l-10 13 10 10 10-10z" fill="url(#gem)"/><path d="M49 62l20-22 11 6 11-6 20 22-18 17-13-6-13 6z" fill="url(#metal)" stroke="#fff0bf" stroke-width="2"/><path d="M80 13l24 36-24 31-24-31z" fill="url(#gem)" stroke="#fff7d7" stroke-width="3"/><path d="M80 24l10 24-10 18-10-18z" fill="#fff" opacity=".5"/><path d="M34 58l18-5M126 58l-18-5M80 5v14" stroke="#fff0bc" stroke-width="4" stroke-linecap="round"/>`,
 robe:`<path d="M15 38q28-32 55-20l10 20q-19 4-32 28L22 80zM145 38q-28-32-55-20L80 38q19 4 32 28l26 14z" fill="url(#cloak)" stroke="url(#metal)" stroke-width="5"/><path d="M23 68q-2 38-13 66l23-8 23-45M137 68q2 38 13 66l-23-8-23-45" fill="url(#cloak)" stroke="url(#metal)" stroke-width="4"/><path d="M56 18q23 17 48 0l-11 22-13 8-13-8z" fill="#122835" stroke="#f7d68a" stroke-width="4"/><path d="M60 79q20 17 40 0M63 119q17 13 34 0" fill="none" stroke="#fff0c2" stroke-width="3" opacity=".82"/><circle cx="80" cy="51" r="11" fill="url(#gem)" stroke="#fff5c9" stroke-width="3"/>`,
 ring:`<ellipse cx="80" cy="103" rx="35" ry="24" fill="none" stroke="url(#metal)" stroke-width="15"/><ellipse cx="80" cy="103" rx="35" ry="24" fill="none" stroke="#fff2bd" stroke-width="3"/><path d="M80 25l31 34-31 40-31-40z" fill="url(#gem)" stroke="#fff5d5" stroke-width="5"/><path d="M80 31l9 27-9 23-9-23z" fill="#fff" opacity=".46"/><path d="M29 44h17m68 0h17M80 7v15" stroke="#fff4cf" stroke-width="4" stroke-linecap="round"/>`,
 amulet:`<path d="M22 12Q80 100 138 12" fill="none" stroke="url(#metal)" stroke-width="8"/><path d="M32 17Q80 88 128 17" fill="none" stroke="#fff1c1" stroke-width="2"/><path d="M80 68l29 19-11 39-18 21-18-21-11-39z" fill="url(#metal)" stroke="#fff1c1" stroke-width="4"/><path d="M80 73l20 21-20 39-20-39z" fill="url(#gem)" stroke="#fff4dc" stroke-width="3"/><path d="M80 79l7 20-7 25-7-25z" fill="#fff" opacity=".5"/>`,
 boots:`<path d="M21 20h43l7 68 14 19-4 25H13l4-36zM96 20h43l5 76 4 36H80l-5-25 14-19z" fill="url(#cloak)" stroke="url(#metal)" stroke-width="6"/><path d="M19 90l48 4m26 0l48-4M21 119h56m8 0h56" stroke="#fff0bf" stroke-width="4"/><path d="M42 45l12 22-12 19-12-19zm76 0l12 22-12 19-12-19z" fill="url(#gem)" stroke="#fff6d1" stroke-width="3"/>`,
 grimoire:`<path d="M20 34q29-15 60 7 31-22 60-7v96q-30-15-60 7-30-22-60-7z" fill="#13232c" stroke="url(#metal)" stroke-width="8"/><path d="M80 41v96M29 47q24-8 42 5m18 0q19-13 42-5" stroke="#f5d588" stroke-width="4"/><path d="M80 58l22 31-22 32-22-32z" fill="url(#gem)" stroke="#fff2c4" stroke-width="4"/><circle cx="80" cy="89" r="11" fill="#fff" opacity=".55"/><path d="M26 112l36 7m72-7l-36 7" stroke="#f3d88f" stroke-width="3"/>`
};
for(const [i,tier] of tiers.entries())for(const [slot,body] of Object.entries(shapes)){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><defs><radialGradient id="gem"><stop stop-color="${tier.light}"/><stop offset=".34" stop-color="${tier.gem}"/><stop offset="1" stop-color="#16333d"/></radialGradient><linearGradient id="metal" x2="1" y2="1"><stop stop-color="#fff4cc"/><stop offset=".35" stop-color="${tier.edge}"/><stop offset=".72" stop-color="#695337"/><stop offset="1" stop-color="#fff0ba"/></linearGradient><linearGradient id="cloak" x2="0" y2="1"><stop stop-color="${tier.gem}"/><stop offset=".35" stop-color="#162b39"/><stop offset="1" stop-color="#101527"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#glow)" stroke-linejoin="round">${body}</g></svg>`;
 fs.writeFileSync(path.join(out,`${slot}-${i+1}.svg`),svg);
}
console.log('Wrote 24 paper-doll equipment layers.');
