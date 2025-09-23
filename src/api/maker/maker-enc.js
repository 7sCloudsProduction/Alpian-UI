const fetch = require("node-fetch");
const JsConfuser = require("js-confuser");

// 🔒 Preset Invisible Hardened
const genInvis = () => "_".repeat(Math.floor(Math.random() * 4) + 3) + Math.random().toString(36).slice(2, 5);
const getInvisObf = () => ({
  target: "node",
  compact: true,
  renameVariables: true,
  renameGlobals: true,
  identifierGenerator: genInvis,
  stringEncoding: true,
  stringSplitting: true,
  controlFlowFlattening: 0.95,
  shuffle: true,
  duplicateLiteralsRemoval: true,
  deadCode: true,
  calculator: true,
  opaquePredicates: true,
  lock: {
    selfDefending: true,
    antiDebug: true,
    integrity: true,
    tamperProtection: true
  }
});

module.exports = function(app) {
  // Encrypt Invisible
  app.get("/maker/enc", async (req, res) => {
    const fileUrl = req.query.url;
    if (!fileUrl) return res.status(400).json({ status: false, error: "Param 'url' wajib diisi" });

    try {
      const raw = await (await fetch(fileUrl)).text();

      // Deteksi ESM
      const isESM = /\b(import|export)\b/.test(raw);
      if (!isESM) new Function(raw); // validasi sintaks

      const obf = await JsConfuser.obfuscate(raw, getInvisObf());
      const code = typeof obf === "string" ? obf : obf.code;
      const base64 = Buffer.from(code).toString("base64");

      res.json({
        status: true,
        creator: "Alpiann",
        file_url: fileUrl,
        isESM,
        obfuscated: code,
        base64
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ status: false, error: e.message });
    }
  });
};
