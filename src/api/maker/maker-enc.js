const fetch = require("node-fetch");
const fs = require("fs-extra");
const path = require("path");
const JsConfuser = require("js-confuser");

module.exports = function(app) {
  // Encrypt Invisible
  app.get("/maker/enc", async (req, res) => {
    const fileUrl = req.query.url;
    if (!fileUrl) return res.status(400).json({ status: false, error: "Param 'url' wajib diisi" });

    const filename = `encrypted-${Date.now()}.js`;
    const out = path.join(__dirname, filename);

    try {
      // Download file JS/TS
      const raw = await (await fetch(fileUrl)).text();

      // Deteksi ESM
      const isESM = /\b(import|export)\b/.test(raw);
      if (!isESM) new Function(raw); // validasi non-ESM

      // Preset Invisible Hardened
      const genInvis = () => "_".repeat(Math.floor(Math.random() * 4) + 3) + Math.random().toString(36).slice(2, 5);
      const obf = await JsConfuser.obfuscate(raw, {
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
      const code = typeof obf === "string" ? obf : obf.code;

      if (!isESM) new Function(code); // validasi hasil obfuscate

      await fs.writeFile(out, code);

      // Kirim hasil ke client
      res.download(out, filename, async (err) => {
        if (err) console.error(err);
        if (await fs.pathExists(out)) await fs.remove(out);
      });
    } catch (e) {
      if (await fs.pathExists(out)) await fs.remove(out);
      res.status(500).json({ status: false, error: e.message });
    }
  });
};
