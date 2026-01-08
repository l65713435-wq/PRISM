const fetch = require('node-fetch');

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.send('URLを入力してください。');

    const targetUrl = url.startsWith('http') ? url : `https://${url}`;

    try {
        const response = await fetch(targetUrl);
        let content = await response.text();

        // 簡易的なパス書き換え（画像やリンクをある程度動くようにする）
        const origin = new URL(targetUrl).origin;
        content = content.replace(/(src|href)="\/(?!\/)/g, `$1="${origin}/`);

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(content);
    } catch (e) {
        res.status(500).send('PRISM透過エラー: ' + e.message);
    }
}
