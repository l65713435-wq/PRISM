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
        res.setHeader('Access-Control-Allow-Origin', '*');

        // HTMLやCSSの中身をスキャンして、リンクを無理やりプロキシ経由にする
        if (contentType && (contentType.includes('text/html') || contentType.includes('text/css'))) {
            let body = await response.text();
            const origin = new URL(targetUrl).origin;
            
            // 「/」で始まるリンクを「プロキシ経由の絶対パス」に置換
            const proxyPrefix = `/api/proxy?url=${origin}`;
            body = body.replace(/(src|href|action)=["']\/(?!\/)/g, `$1="${proxyPrefix}/`);
            
            res.setHeader('Content-Type', contentType);
            res.send(body);
        } else {
            // 画像やデータはそのまま流す
            const buffer = await response.buffer();
            res.setHeader('Content-Type', contentType);
            res.send(buffer);
        }
    } catch (e) {
        res.status(500).send('Proxy Error');
    }
};
