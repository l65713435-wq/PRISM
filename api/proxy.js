const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('URL missing');

    try {
        const targetUrl = url.startsWith('http') ? url : `https://${url}`;
        const response = await fetch(targetUrl, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': targetUrl
            }
        });

        const contentType = response.headers.get('content-type');
        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');

        if (contentType && contentType.includes('text/html')) {
            let html = await response.text();
            const baseUrl = new URL(targetUrl).origin;
            
            // デザイン崩れを防ぐために <base> タグを強制挿入する魔法
            const baseTag = `<base href="${baseUrl}/">`;
            html = html.replace('<head>', `<head>${baseTag}`);
            
            res.send(html);
        } else {
            const buffer = await response.buffer();
            res.send(buffer);
        }
    } catch (e) {
        res.status(500).send('Proxy Error: ' + e.message);
    }
};
