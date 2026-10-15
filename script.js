const $=id=>document.getElementById(id);
const symbols=32;
function fmt(n){if(n===0n)return '0';const s=n.toString();return s.length<=15?Number(n).toLocaleString('en-US'):`${s.slice(0,3)}.${s.slice(3,5)} × 10^${s.length-1}`}
function timeFmt(sec){if(!Number.isFinite(sec)||sec>1e40)return 'Astronomically long';if(sec<1)return 'Less than a second';for(const [u,v] of [['year',31557600],['day',86400],['hour',3600],['minute',60],['second',1]])if(sec>=v){let n=sec/v;return `${n>=1000?Math.round(n).toLocaleString('en-US'):n>=10?n.toFixed(1):n.toFixed(2)} ${u}${n>=1.01?'s':''}`}return 'Less than a second'}
function mark(id,ok){const e=$(id);e.classList.toggle('pass',ok);e.textContent=(ok?'✓':'○')+'  '+e.textContent.slice(3)}
function poolState(id,ok){$(id).textContent=ok?'DETECTED':'NOT DETECTED';$(id).classList.toggle('used',ok)}
function analyze(){
 const p=$('password').value,L=p.length,lo=/[a-z]/.test(p),up=/[A-Z]/.test(p),nu=/[0-9]/.test(p),sy=/[^A-Za-z0-9\s]/.test(p),cats=[lo,up,nu,sy].filter(Boolean).length,R=(lo?26:0)+(up?26:0)+(nu?10:0)+(sy?symbols:0),N=R?BigInt(R)**BigInt(L):0n,H=R?L*Math.log2(R):0;
 $('pool').textContent=R;$('length').textContent=L;$('space').textContent=fmt(N);$('entropy').textContent=H.toFixed(1)+' bits';$('spaceNote').textContent=R?`${R} possible characters across ${L} positions`:'Enter characters to calculate a search space';
 $('progress').style.width=(R?Math.min(100,(N.toString().length/40)*100):0)+'%';
 mark('cLen',L>=12);mark('cLow',lo);mark('cUp',up);mark('cNum',nu);mark('cSym',sy);mark('cVar',L>0&&new Set(p).size>=Math.min(8,L));
 poolState('pLow',lo);poolState('pUp',up);poolState('pNum',nu);poolState('pSym',sy);$('poolTotal').textContent=R+' characters';
 let score=0;if(L>=8)score++;if(L>=12)score++;if(L>=16)score++;if(cats>=2)score++;if(cats===4)score++;if(!L)score=0;
 const names=['Very weak','Weak','Fair','Good','Strong','Excellent'],hints=['Type a sample password','Try adding length and variety','More length can improve the search space','Room to improve','Good variety and length','Strong theoretical profile'],s=Math.min(5,score);
 $('strength').textContent=L?names[s]:'No password';$('hint').textContent=L?hints[s]:'Type a sample password';
 [...$('meter').children].forEach((e,i)=>e.style.background=i<s?(s<=1?'#e56d83':s<=3?'#e5ad45':'#17ad96'):'');
 const rate=Number($('rate').value),logsec=R?L*Math.log(R)-Math.log(rate):0,sec=R?(logsec<700?Math.exp(logsec):Infinity):0;
 $('avg').textContent=timeFmt(sec/2);$('worst').textContent=timeFmt(sec);
}
$('show').onclick=()=>{const show=$('password').type==='password';$('password').type=show?'text':'password';$('show').textContent=show?'Hide':'Show'};$('password').addEventListener('input',analyze);$('rate').addEventListener('change',analyze);
let pinLen=6;function perm(n,r){if(r>n||r<0)return 0n;let x=1n;for(let i=0;i<r;i++)x*=BigInt(n-i);return x}
function pinCount(L,repeat,zero){if(repeat)return BigInt(zero?10:9)*10n**BigInt(L-1);if(L>10)return 0n;return zero?perm(10,L):9n*perm(9,L-1)}
function pinCalc(L,repeat,zero){let n=pinCount(L,repeat,zero),formula,explain;if(repeat&&zero){formula=`N = 10^${L}`;explain=`Each of ${L} positions has 10 choices. Repetition and leading zero are allowed.`}else if(repeat){formula=`N = 9 × 10^${L-1}`;explain='The first position has 9 choices (1–9); each remaining position has 10 choices.'}else if(zero){formula=`N = 10P${L} = 10! / (10 − ${L})!`;explain='Digits cannot repeat and order matters, so count permutations selected from 10 digits.'}else{formula=`N = 9 × 9P${L-1}`;explain='The first digit has 9 choices; remaining positions use ordered, non-repeating digits.'}if(!repeat&&L>10){formula='N = 0';explain='A PIN longer than 10 positions is impossible without repeating digits 0–9.'}return {n,formula,explain}}
function updatePin(){const repeat=$('repeat').checked,zero=$('zero').checked,r=pinCalc(pinLen,repeat,zero);$('pinTotal').textContent=fmt(r.n);$('pinFormula').textContent=r.n===0n?'No valid PINs under these rules':r.formula;$('equation').textContent=r.formula;$('explanation').textContent=r.explain;$('slots').innerHTML='';for(let i=0;i<pinLen;i++){let s=document.createElement('span');s.textContent=i===0&&!zero?'1–9':'0–9';$('slots').append(s)}document.querySelectorAll('[data-len]').forEach(b=>{let yes=+b.dataset.len===pinLen;b.classList.toggle('chosen',yes);b.setAttribute('aria-pressed',String(yes))});[4,6,8].forEach(n=>$('cmp'+n).textContent=fmt(pinCount(n,repeat,zero)))}
document.querySelectorAll('[data-len]').forEach(b=>b.onclick=()=>{pinLen=+b.dataset.len;updatePin()});$('repeat').onchange=updatePin;$('zero').onchange=updatePin;
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===b.dataset.tab))});
$('theme').onclick=()=>{document.body.classList.toggle('dark');document.querySelector('meta[name="theme-color"]').content=document.body.classList.contains('dark')?'#111426':'#f5f6fc'};
analyze();updatePin();
// Explicit submit action for the assignment demo; calculations also update live while typing.
$('passwordForm').addEventListener('submit', (event) => {
  event.preventDefault();
  analyze();
  const status = $('submitStatus');
  status.textContent = 'Analysis updated successfully';
  status.classList.add('done');
  $('strength').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
$('password').addEventListener('input', () => {
  $('submitStatus').textContent = 'Password changed — analyze when ready';
  $('submitStatus').classList.remove('done');
});

// Explicit submit action for the PIN calculator.
$('calculatePin').addEventListener('click', () => {
  updatePin();
  const status = $('pinSubmitStatus');
  status.textContent = 'PIN calculation submitted successfully';
  status.classList.add('done');
  $('pinTotal').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
document.querySelectorAll('[data-len], #repeat, #zero').forEach(el => {
  el.addEventListener('change', () => {
    const status = $('pinSubmitStatus');
    status.textContent = 'Settings changed — calculate when ready';
    status.classList.remove('done');
  });
});
// Submit action for the Math in Computing knowledge check.
$('mathQuiz').addEventListener('submit', (event) => {
  event.preventDefault();
  const answer = document.querySelector('input[name="quizAnswer"]:checked');
  const status = $('quizStatus');
  if (!answer) {
    status.textContent = 'Please select an answer first.';
    status.classList.remove('done');
    return;
  }
  if (answer.value === '10000') {
    status.textContent = 'Correct! 10 × 10 × 10 × 10 = 10,000.';
    status.classList.add('done');
  } else {
    status.textContent = 'Not quite. Each of 4 positions has 10 choices: 10⁴ = 10,000.';
    status.classList.remove('done');
  }
});
