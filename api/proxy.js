const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const targetUrl = url.startsWith('http') ? url : `https://${url}`;
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
        });

        const contentType = response.headers.get('content-type');
        let body = await response.buffer();

        // HTMLやJSの場合、中身を書き換えてリンク切れを防ぐ
        if (contentType && (contentType.includes('text/html') || contentType.includes('application/javascript'))) {
            let text = body.toString();
            const baseUrl = new URL(targetUrl);
            const origin = baseUrl.origin;

            // サイト内の絶対パスをプロキシ経由に変換する魔法の処理
            text = text.replace(/(src|href|action)=["']\/(?!\/)/g, `$1="/api/proxy?url=${origin}/`);
            body = Buffer.from(text);
        }

        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*'); // セキュリティ制限を回避
        res.send(body);

    } catch (error) {
        res.status(500).send('Error fetching the URL: ' + error.message);
    }
};
