
const axios = require('axios');
const FormData = require('form-data');

async function uploadToCatbox(buffer) {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('userhash', ''); // kosong jika tidak punya userhash
    form.append('fileToUpload', buffer, { filename: 'result.png' });

    const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
        headers: form.getHeaders()
    });

    return data; // URL hasil upload
}

async function tofigureScrape(imageUrl) {
    // Panggil API AI
    const { data } = await axios.get('https://api.nekolabs.my.id/ai/convert/tofigure', {
        params: { imageUrl }
    });

    if (!data.status) throw new Error('Gagal mendapatkan data dari API AI');

    // Ambil hasil gambar
    const resultBuffer = await axios.get(data.result, { responseType: 'arraybuffer' });
    const catboxUrl = await uploadToCatbox(Buffer.from(resultBuffer.data));

    return {
        status: true,
        creator: 'Alpiann',
        result: catboxUrl
    };
}

// Export untuk route express
module.exports = function(app) {
    app.get('/ai/tofigure', async (req, res) => {
        try {
            const { imageUrl } = req.query;
            if (!imageUrl) return res.status(400).json({ status: false, error: 'Parameter imageUrl harus diisi' });

            const result = await tofigureScrape(imageUrl);
            res.json(result);

        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
