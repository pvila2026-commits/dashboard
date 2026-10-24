/* PVila — Bengali (Bangabda) dual calendar data.
   Month starts follow the West Bengal panjika. Verified against published panjika for Oct–Dec 2026;
   later months follow the standard sankranti rule and may differ by ±1 day from a given panjika.
   Festival & Shubho-Bibaho dates compiled from public panjika/holiday lists — always confirm with your family priest. */
window.BNCAL=(function(){
const M=[['Boishakh','বৈশাখ'],['Joishtho','জ্যৈষ্ঠ'],['Ashar','আষাঢ়'],['Srabon','শ্রাবণ'],['Bhadro','ভাদ্র'],['Ashwin','আশ্বিন'],['Kartik','কার্তিক'],['Ograhayon','অগ্রহায়ণ'],['Poush','পৌষ'],['Magh','মাঘ'],['Falgun','ফাল্গুন'],['Chaitra','চৈত্র']];
// [first English day, month index, Bengali year]
const S=[['2026-09-19',5,1433],['2026-10-19',6,1433],['2026-11-18',7,1433],['2026-12-17',8,1433],['2027-01-15',9,1433],['2027-02-14',10,1433],['2027-03-16',11,1433],['2027-04-15',0,1434],['2027-05-16',1,1434],['2027-06-16',2,1434],['2027-07-18',3,1434],['2027-08-18',4,1434],['2027-09-19',5,1434],['2027-10-19',6,1434],['2027-11-18',7,1434],['2027-12-18',8,1434],['2028-01-16',9,1434]];
const D=s=>Date.UTC(+s.slice(0,4),+s.slice(5,7)-1,+s.slice(8,10));
const iso=t=>new Date(t).toISOString().slice(0,10),DAY=864e5;
const digits='০১২৩৪৫৬৭৮৯',bnum=n=>String(n).split('').map(c=>digits[c]).join('');
function conv(ds){const t=D(ds);for(let i=S.length-2;i>=0;i--){if(t>=D(S[i][0])){const d=Math.round((t-D(S[i][0]))/DAY)+1;return{d,m:S[i][1],y:S[i][2],first:d==1,label:bnum(d)+' '+M[S[i][1]][1],full:bnum(d)+' '+M[S[i][1]][1]+' '+bnum(S[i][2]),en:d+' '+M[S[i][1]][0]+' '+S[i][2]}}}return null}
const R={};const add=(ds,txt,k)=>{(R[ds]=R[ds]||[]).push({t:txt,k})};
// computed from the Bengali month table
S.forEach((s,i)=>{const t=D(s[0]),nx=S[i+1]?D(S[i+1][0])-DAY:null;
 if(s[1]==0){add(s[0],'Poila Boishakh · নববর্ষ (Haal Khata)','p');add(iso(t+24*DAY),'Rabindra Jayanti · রবীন্দ্র জয়ন্তী','h')}
 if(s[1]==1)add(iso(t+10*DAY),'Nazrul Jayanti · নজরুল জয়ন্তী','h');
 if(s[1]==8)add(iso(t+6*DAY),'Poush Utsav, Shantiniketan · পৌষ উৎসব','p');
 if(nx&&s[1]==8)add(iso(nx),'Poush Sankranti · পৌষ সংক্রান্তি (Makar Sankranti, Pithe-Puli)','p');
 if(nx&&s[1]==11)add(iso(nx),'Chaitra Sankranti · Gajan / Charak · চড়ক','p')});
// fixed festivals & holidays (English date)
[['2026-10-21','Bijoya Dashami · বিজয়া দশমী','p'],['2026-10-25','Kojagari Lakshmi Puja · কোজাগরী লক্ষ্মীপূজা','p'],['2026-11-08','Kali Puja / Diwali · কালীপূজা','p'],['2026-11-10','Bhai Phota · ভাইফোঁটা (some panjikas: Nov 11)','p'],['2026-11-18','Jagadhatri Puja · জগদ্ধাত্রী পূজা','p'],['2026-11-24','Rash Purnima · রাস পূর্ণিমা','p'],['2026-12-25','Christmas · বড়দিন','h'],['2026-12-31','New Year’s Eve','h'],
['2027-01-01','New Year’s Day','h'],['2027-01-12','Vivekananda Jayanti · বিবেকানন্দ জয়ন্তী','h'],['2027-01-23','Netaji Jayanti · নেতাজি জয়ন্তী','h'],['2027-01-26','Republic Day','h'],['2027-02-11','Saraswati Puja · সরস্বতী পূজা (Sree Panchami)','p'],['2027-03-06','Maha Shivaratri · শিবরাত্রি (≈)','p'],['2027-03-09','Eid-ul-Fitr (≈ moon sighting)','h'],['2027-03-22','Dol Jatra / Holi · দোলযাত্রা','p'],['2027-03-26','Good Friday','h'],
['2027-05-01','May Day','h'],['2027-05-09','Akshaya Tritiya · অক্ষয় তৃতীয়া','p'],['2027-05-17','Eid-ul-Adha (≈ moon sighting)','h'],['2027-05-20','Buddha Purnima · বুদ্ধ পূর্ণিমা','h'],['2027-07-06','Rath Yatra · রথযাত্রা (≈)','p'],['2027-08-15','Independence Day','h'],['2027-08-25','Janmashtami · জন্মাষ্টমী (≈)','p'],
['2027-09-29','Mahalaya · মহালয়া','p'],['2027-10-02','Gandhi Jayanti','h'],['2027-10-05','Maha Shashthi · মহাষষ্ঠী (Bodhon)','p'],['2027-10-06','Maha Saptami · মহাসপ্তমী','p'],['2027-10-07','Maha Ashtami · মহাঅষ্টমী (Sandhi Puja)','p'],['2027-10-08','Maha Navami · মহানবমী','p'],['2027-10-09','Bijoya Dashami · বিজয়া দশমী','p'],['2027-10-15','Kojagari Lakshmi Puja · কোজাগরী লক্ষ্মীপূজা (≈)','p'],['2027-10-28','Kali Puja / Diwali · কালীপূজা','p'],['2027-10-30','Bhai Phota · ভাইফোঁটা','p'],['2027-11-07','Jagadhatri Puja · জগদ্ধাত্রী পূজা (≈)','p'],['2027-12-25','Christmas · বড়দিন','h'],['2027-12-31','New Year’s Eve','h']].forEach(x=>add(...x));
// Shubho Bibaho (auspicious marriage) dates — Bengali panjika
const B=new Set('2026-11-20,2026-11-21,2026-11-24,2026-11-25,2026-12-02,2026-12-03,2026-12-04,2026-12-12,2027-01-14,2027-01-15,2027-01-18,2027-01-24,2027-01-26,2027-01-31,2027-02-02,2027-02-03,2027-02-09,2027-02-10,2027-02-11,2027-02-14,2027-02-15,2027-02-21,2027-02-22,2027-02-25,2027-02-26,2027-02-27,2027-02-28,2027-03-01,2027-03-02,2027-03-03,2027-03-04,2027-03-10,2027-03-11,2027-03-14,2027-03-15,2027-04-18,2027-04-19,2027-04-21,2027-04-23,2027-04-24,2027-04-25,2027-04-26,2027-04-27,2027-04-28,2027-05-03,2027-05-04,2027-05-07,2027-05-08,2027-05-09,2027-05-13,2027-05-16,2027-05-17,2027-05-23,2027-05-24,2027-05-30,2027-05-31,2027-06-01,2027-06-05,2027-06-09,2027-06-10,2027-06-13,2027-06-16,2027-06-17,2027-06-21,2027-06-26,2027-06-27,2027-06-28,2027-07-07,2027-07-09,2027-07-11,2027-07-12,2027-07-14,2027-07-15,2027-07-16,2027-11-10,2027-11-11,2027-11-15,2027-11-16,2027-11-20,2027-11-21,2027-11-22,2027-11-23,2027-11-24,2027-11-25,2027-11-26,2027-11-29,2027-12-02,2027-12-03,2027-12-05,2027-12-07,2027-12-08,2027-12-09,2027-12-11,2027-12-12,2027-12-13,2027-12-14'.split(','));
return{M,conv,R,B,bnum,iso}})();
