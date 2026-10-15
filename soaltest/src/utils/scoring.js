const norm=v=>String(v??'').trim().toLocaleLowerCase('id');
export function scoreAnswer(question,answer,complexMode='proporsional'){
  if(question.jenis==='esai')return {score:null,pending:true};
  const correct=question.jawabanBenar, weight=Number(question.bobot)||1;
  if(question.jenis==='pilihan-ganda-kompleks') {const a=[...(answer||[])].sort(),c=[...(correct||[])].sort();if(complexMode==='semua-benar')return {score:JSON.stringify(a)===JSON.stringify(c)?weight:0};const hits=a.filter(x=>c.includes(x)).length,wrong=a.filter(x=>!c.includes(x)).length;return {score:Math.max(0,weight*(hits-wrong)/Math.max(c.length,1))}}
  if(question.jenis==='menjodohkan'){const pairs=correct||{},entries=Object.entries(pairs);return {score:entries.length?weight*entries.filter(([k,v])=>answer?.[k]===v).length/entries.length:0}}
  const ok=question.jenis==='isian-singkat'?norm(answer)===norm(correct):JSON.stringify(answer)===JSON.stringify(correct);
  return {score:ok?weight:0};
}
export function finalScore(questions,answers){let points=0,total=0,pending=false;for(const q of questions){total+=Number(q.bobot)||1;const result=scoreAnswer(q,answers[q.id]);if(result.pending)pending=true;else points+=result.score}return {nilai:total?Math.round(points/total*10000)/100:0,sementara:pending,totalBobot:total}}
