const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('URL missing');

    try {
        const targetUrl = url.startsWith('http') ? url : `https://${url}`;
        const response = await fetch(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });

        // 500エラーを避けるため、一気に全部処理せずそのまま流す
        const contentType = response.headers.get('content-type');
        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        const buffer = await response.buffer();
        res.send(buffer);
    } catch (e) {
        res.status(500).send('Proxy Error');
    }
};
