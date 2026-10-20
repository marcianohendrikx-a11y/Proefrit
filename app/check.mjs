// Controleert dat het script in web/index.html geen syntaxfout bevat (draait ook vóór het online zetten).
import { readFileSync } from "node:fs";
import vm from "node:vm";
const html = readFileSync(new URL("../web/index.html", import.meta.url), "utf8");
const start = html.indexOf("<script>\n", html.indexOf("PROEFRIT_CONFIG"));
const js = html.slice(start + 9, html.lastIndexOf("</script>"));
try { new vm.Script(js, { filename: "index.html" }); console.log("Script in orde"); }
catch (e) { console.error("Syntaxfout in web/index.html:", e.message); process.exit(1); }
