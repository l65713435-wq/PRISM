export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("URL is required");
  }

  try {
    const targetUrl = decodeURIComponent(url);
    // Vercelサーバーがターゲットサイトへリクエストを飛ばす
    const response = await fetch(targetUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" }
    });

    const contentType = response.headers.get("content-type");
    res.setHeader("Content-Type", contentType);

    // 取得したデータをバッファとしてブラウザに返す
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    res.status(500).send("Proxy Error: " + error.message);
  }
}
