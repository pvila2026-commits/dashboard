/** PVILA backend — Google Apps Script bound to a Google Sheet (free database + CSV).
 *  Script Properties to set: ADMIN_KEY, RZP_KEY_ID, RZP_KEY_SECRET (RZP_* optional; without them bookings are saved as "Enquiry"). */
const HEAD=['ref','created','status','name','phone','email','address','guests','function','date','days','spaces','extra_parking','notes','total','advance','security','pay_now','balance','order_id','payment_id'];
const P=()=>PropertiesService.getScriptProperties();
const sheet=()=>{const ss=SpreadsheetApp.getActiveSpreadsheet();let s=ss.getSheetByName('Bookings')||ss.insertSheet('Bookings');if(!s.getLastRow())s.appendRow(HEAD);return s};
const out=o=>ContentService.createTextOutput(typeof o==='string'?o:JSON.stringify(o)).setMimeType(typeof o==='string'?ContentService.MimeType.CSV:ContentService.MimeType.JSON);
const rows=()=>{const v=sheet().getDataRange().getValues();return v.slice(1).map(r=>Object.fromEntries(HEAD.map((h,i)=>[h,r[i]])))};
const dstr=d=>d instanceof Date?Utilities.formatDate(d,'Asia/Kolkata','yyyy-MM-dd'):String(d);
function doGet(e){const a=e.parameter.action;
  if(a==='csv'||a==='list'){if(e.parameter.key!==P().getProperty('ADMIN_KEY'))return out({ok:false,error:'Bad key'});
    if(a==='list')return out({ok:true,rows:rows()});
    const esc=v=>'"'+String(v instanceof Date?dstr(v):v).replace(/"/g,'""')+'"';return out([HEAD.join(',')].concat(rows().map(r=>HEAD.map(h=>esc(r[h])).join(','))).join('\n'))}
  return out({ok:true,booked:busy().map(b=>({date:b.date,days:+b.days||1,spaces:b.spaces}))})}
function busy(){return rows().filter(r=>['Pending','Paid','Enquiry'].includes(r.status)||r.status==='Blocked').map(r=>({date:dstr(r.date),days:r.days,spaces:String(r.spaces)}))}
function clash(date,days,spaces){const want=spaces.split('+'),s=new Date(date).getTime(),e=s+days*864e5;
  return busy().some(b=>{const bs=new Date(b.date).getTime(),be=bs+b.days*864e5;return s<be&&bs<e&&b.spaces.split('+').some(x=>want.includes(x))})}
function doPost(e){const L=LockService.getScriptLock();L.waitLock(20000);try{const d=JSON.parse(e.postData.contents),s=sheet();
  if(d.action==='create'){
    if(!d.name||!/^[6-9]\d{9}$/.test(d.phone)||!d.spaces||!d.date)return out({ok:false,error:'Invalid details'});
    const days=Math.min(10,Math.max(1,+d.days||1)),sp=String(d.spaces).split('+').filter(x=>['ground','first','second','roof'].includes(x));
    if(!sp.length)return out({ok:false,error:'No space selected'});
    if(clash(d.date,days,sp.join('+')))return out({ok:false,error:'Sorry, one of those floors is already booked for these dates.'});
    const total=sp.length*20000*days,adv=Math.round(total*0.25),now=adv+10000,ref='PV-'+Utilities.formatDate(new Date(),'Asia/Kolkata','yyMMdd')+'-'+Math.floor(1000+Math.random()*9000); // prices recomputed server-side
    const rec=Object.assign({},d,{ref,created:new Date(),days,spaces:sp.join('+'),total,advance:adv,security:10000,pay_now:now,balance:total-adv,order_id:'',payment_id:'',status:'Enquiry'});
    const id=P().getProperty('RZP_KEY_ID'),sec=P().getProperty('RZP_KEY_SECRET'),res={ok:true,ref};
    if(id&&sec){const r=JSON.parse(UrlFetchApp.fetch('https://api.razorpay.com/v1/orders',{method:'post',contentType:'application/json',headers:{Authorization:'Basic '+Utilities.base64Encode(id+':'+sec)},payload:JSON.stringify({amount:now*100,currency:'INR',receipt:ref})}).getContentText());
      rec.order_id=r.id;rec.status='Pending';res.order_id=r.id;res.key_id=id;res.amount=now*100}
    s.appendRow(HEAD.map(h=>rec[h]===undefined?'':rec[h]));return out(res)}
  if(d.action==='verify'){const sec=P().getProperty('RZP_KEY_SECRET'),i=s.getDataRange().getValues().findIndex(r=>r[0]===d.ref);if(i<1)return out({ok:false});
    const row=s.getDataRange().getValues()[i],sig=Utilities.computeHmacSha256Signature(row[HEAD.indexOf('order_id')]+'|'+d.razorpay_payment_id,sec).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');
    if(sig!==d.razorpay_signature)return out({ok:false,error:'Signature mismatch'});
    s.getRange(i+1,HEAD.indexOf('status')+1).setValue('Paid');s.getRange(i+1,HEAD.indexOf('payment_id')+1).setValue(d.razorpay_payment_id);return out({ok:true})}
  if(d.action==='status'&&d.key===P().getProperty('ADMIN_KEY')){const i=s.getDataRange().getValues().findIndex(r=>r[0]===d.ref);if(i<1)return out({ok:false});s.getRange(i+1,3).setValue(d.status);return out({ok:true})}
  return out({ok:false,error:'Unknown action'})}catch(err){return out({ok:false,error:String(err)})}finally{L.releaseLock()}}
