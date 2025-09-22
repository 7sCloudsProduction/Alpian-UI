const axios = require("axios");

module.exports = function(app) {
  // Twitter Stalker
  app.get("/random/twitter", async (req, res) => {
    const username = req.query.username;
    if (!username) {
      return res.status(400).json({ status: false, error: "Param 'username' wajib diisi" });
    }

    try {
      const { data } = await axios.get(`https://api.zenzxz.my.id/stalker/twitter?username=${encodeURIComponent(username)}`);
      res.json({
        status: true,
        creator: "Alpiann",
        result: data
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, error: "Gagal mengambil data Twitter" });
    }
  });
};
