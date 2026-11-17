module.exports = async (req, res) => {
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Headers", "Ocp-Apim-Subscription-Key");
res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
if (req.method === "OPTIONS") { res.status(204).end(); return; }
const q = Object.assign({}, req.query);
const path = [].concat(q.p || []).join("/");
delete q.p;
const qs = new URLSearchParams(q).toString();
try {
const upstream = await fetch("https://api.odot.state.or.us/tripcheck/" + path + (qs ? "?" + qs : ""), { headers: { "Ocp-Apim-Subscription-Key": req.headers["ocp-apim-subscription-key"] || "" } });
const body = await upstream.text();
res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
res.status(upstream.status).send(body);
} catch (e) { res.status(502).send("Relay could not reach ODOT"); }
};
