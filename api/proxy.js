export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("URLが必要です");
  }

  try {
    const targetUrl = decodeURIComponent(url);
    
    // 相手のサイトにリクエストを送る
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      }
    });

    // データの種類（HTMLか画像かなど）をそのまま引き継ぐ
    const contentType = response.headers.get("content-type");
    res.setHeader("Content-Type", contentType);

    // HTMLの場合は、中身のリンクが切れないように最低限の修正を入れる
    if (contentType && contentType.includes("text/html")) {
      let html = await response.text();
      const origin = new URL(targetUrl).origin;
      
      // サイト内の相対パスを絶対パスに書き換える（PRISMの核となる処理！）
      html = html.replace(/(src|href|action)="\/(?!\/)/g, `$1="${origin}/`);
      
      return res.send(html);
    }

    // 画像やスクリプトなどはそのままバイナリで返す
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));

  } catch (error) {
    res.status(500).send("PRISM Proxy Error: " + error.message);
  }
}
