const axios = require('axios');

module.exports = function(app) {
  // Endpoint Pinterest Search
  app.get('/search/pin', async (req, res) => {
    const q = req.query.q;
    if (!q) {
      return res.json({
        status: false,
        msg: "Masukkan parameter q (kata kunci pencarian)"
      });
    }

    try {
      // Panggil API Finix
      const { data } = await axios.get(`https://api.finix-id.my.id/search/pin?q=${encodeURIComponent(q)}`);

      if (!data || !data.status) {
        return res.json({
          status: false,
          msg: "Gagal mengambil data"
        });
      }

      // Bungkus responsenya
      res.json({
        status: true,
        creator: data.creator,
        result: data.result
      });

    } catch (err) {
      console.error(err);
      res.json({
        status: false,
        msg: "Terjadi kesalahan server"
      });
    }
  });
};
