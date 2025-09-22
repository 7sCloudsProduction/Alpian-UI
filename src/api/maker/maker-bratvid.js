const axios = require('axios');

module.exports = function(app) {
  app.get('/maker/bratvid', async (req, res) => {
    try {
      const { text } = req.query;
      if (!text) return res.status(400).json({ status: false, error: 'Parameter text harus diisi' });

      // Stream langsung dari API Elena
      const response = await axios({
        method: 'get',
        url: 'https://api.elena.cantipp.vercel.app/maker/bratvid',
        params: { text },
        responseType: 'stream' // PENTING: stream biar aman
      });

      // Set header content-type sesuai dari API
      res.setHeader('Content-Type', response.headers['content-type'] || 'video/mp4');

      // Pipe stream langsung ke client
      response.data.pipe(res);

    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, error: err.message });
    }
  });
};
