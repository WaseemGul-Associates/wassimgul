const fs = require('fs');
const content = fs.readFileSync('old_index.html', 'utf8');
const bodyMatch = content.match(/<body>([\s\S]*?)<\/body>/);
if (bodyMatch) {
  let body = bodyMatch[1].replace(/<!--[\s\S]*?-->/g, '').replace(/<script>[\s\S]*?<\/script>/g, '');
  body = body.replace(/class=/g, 'className=')
             .replace(/for=/g, 'htmlFor=')
             .replace(/novalidate/g, 'noValidate')
             .replace(/style="([^"]+)"/g, (match, p1) => {
               const parts = p1.split(';').filter(Boolean);
               const obj = {};
               parts.forEach(p => {
                 const [k, ...vParts] = p.split(':');
                 if(k && vParts.length > 0) {
                   const v = vParts.join(':');
                   const camelKey = k.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                   obj[camelKey] = v.trim();
                 }
               });
               return 'style={' + JSON.stringify(obj) + '}';
             })
             .replace(/<img(.*?)>/g, (match, p1) => {
               if(!match.endsWith('/>')) return `<img${p1} />`;
               return match;
             })
             .replace(/<br>/g, '<br/>')
             .replace(/<input(.*?)>/g, (match, p1) => {
               if(!match.endsWith('/>')) return `<input${p1} />`;
               return match;
             });

  fs.writeFileSync('app/page.js', `export default function Home() {\n  return (\n    <main>\n      ${body}\n    </main>\n  );\n}`);
  console.log('Extracted HTML to page.js');
}
