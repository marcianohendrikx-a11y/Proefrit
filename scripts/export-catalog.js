// Zet de catalogus uit het prototype om naar SQL voor Supabase (supabase/seed/cars.sql).
// Gebruik: node scripts/export-catalog.js <map met de prototype-onderdelen>
const fs=require('fs'),path=require('path'),vm=require('vm');
const dir=process.argv[2]||path.join(__dirname,'..','..','parts');
const files=['catalog_head.js','catalog_add.js','catalog_classic.js','catalog_us.js','visual.js'];
const ctx={};vm.createContext(ctx);
vm.runInContext(files.map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n').replace(/^const /gm,'var ')+'\nthis.X={RAW,CLASSIC,USCAT,FROM,USYEARS,GAS,FUEL,FUELS,BODY_OF};',ctx);
const {RAW,CLASSIC,USCAT,FROM,USYEARS,GAS,FUEL,FUELS,BODY_OF}=ctx.X;
const PHEV_RE=/PHEV|plug-in|e-hybrid|eHybrid|\biV\b|4xe|TFSI e|T[568] Recharge|Hybrid4|xDrive\d+e|\b[35]\d0e\b|\bP\d{3}e\b|\b\d{3} d?e\b|R-EV|range extender|DM-i|\bGTE\b/i;
const parse=v=>v.split(';').filter(Boolean).flatMap(x=>/^[BDHEWGN]+$/.test(x)?[...x].map(f=>({label:'',fuel:FUEL[f]})):(()=>{const q=x.split('~');let fuel=FUEL[q[1]];if(q[1]==='H'&&PHEV_RE.test(q[0]))fuel='Plug-in hybride';return [{label:q[0],fuel}]})());
[CLASSIC,USCAT].forEach(src=>Object.keys(src).forEach(b=>{RAW[b]=(RAW[b]?RAW[b]+'\n':'')+src[b]}));
const seen=new Set(),cars=[],versions=[];
Object.keys(RAW).forEach(brand=>RAW[brand].split('\n').map(s=>s.trim()).filter(Boolean).forEach(line=>{
  const p=line.split('|'),id=brand+'|'+p[0];if(seen.has(id))return;seen.add(id);
  let vs=parse(p[2]);if(GAS[id])vs=vs.concat(parse(GAS[id]));
  let [from,to]=p[1].split('-').map(Number);if(FROM[id])from=Math.min(from,FROM[id]);if(USYEARS[id]){from=Math.min(from,USYEARS[id][0]);to=Math.max(to,USYEARS[id][1])}
  const fuels=FUELS.filter(f=>vs.some(v=>v.fuel===f));
  cars.push({id,brand,model:p[0],from,to,body:BODY_OF[id]||p[3]||'H',fuels});
  vs.filter(v=>v.label).forEach(v=>versions.push({car:id,label:v.label,fuel:v.fuel}));
}));
const q=s=>"'"+String(s).replace(/'/g,"''")+"'";
let out='-- Proefrit catalogus: '+cars.length+' modellen, '+versions.length+' versies. Gegenereerd uit het prototype.\n-- Bevat gegevens uit US Car Models Data (CC BY 4.0).\nbegin;\n';
for(let i=0;i<cars.length;i+=200){out+='insert into public.cars (id, brand, model, year_from, year_to, body, fuels) values\n'+cars.slice(i,i+200).map(c=>`(${q(c.id)},${q(c.brand)},${q(c.model)},${c.from},${c.to},${q(c.body)},array[${c.fuels.map(q).join(',')}]::text[])`).join(',\n')+'\non conflict (id) do nothing;\n'}
for(let i=0;i<versions.length;i+=300){out+='insert into public.car_versions (car_id, label, fuel) values\n'+versions.slice(i,i+300).map(v=>`(${q(v.car)},${q(v.label)},${q(v.fuel)})`).join(',\n')+'\non conflict do nothing;\n'}
out+='commit;\n';
fs.writeFileSync(path.join(__dirname,'..','supabase','seed','cars.sql'),out);
console.log('cars',cars.length,'versions',versions.length,'bytes',out.length);
