const axios = require('axios');

module.exports = function(app) {
    app.get('/maker/bratvid', async (req, res) => {
        try {
            const { text } = req.query;
            if (!text) return res.status(400).send('Parameter text harus diisi');

            // Panggil API BratVid
            const response = await axios.get('https://api.zenzxz.my.id/maker/bratvid', {
                params: { text },
                responseType: 'arraybuffer' // ambil langsung buffer video
            });

            const buffer = Buffer.from(response.data);

            // Kirim langsung sebagai video
            res.set({
                'Content-Type': 'video/mp4',
                'Content-Length': buffer.length
            });
            res.send(buffer);

        } catch (err) {
            console.error(err);
            res.status(500).json({ status: false, error: err.message });
        }
    });
};
