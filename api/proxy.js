export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send("URL is required");

  try {
    const targetUrl = new URL(decodeURIComponent(url));
    const response = await fetch(targetUrl.href, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Accept-Language": "ja,en-US;q=0.9,en;q=0.8"
      }
    });

    const contentType = response.headers.get("content-type") || "";
    res.setHeader("Content-Type", contentType);

    // HTMLファイルの場合、中身のリンクを書き換えて読み込みエラーを防ぐ
    if (contentType.includes("text/html")) {
      let html = await response.text();
      const origin = targetUrl.origin;
      
      // 相対パス（/css/style.cssなど）を、元のサイトの絶対パスに書き換える
      // これをしないと、自分のサイトのドメイン内を探してしまってエラーになるよ
      html = html.replace(/(src|href|action)="\/(?!\/)/g, `$1="${origin}/`);
      
      return res.send(html);
    }

    // 画像やスクリプトなどはそのまま転送
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));

  } catch (error) {
    res.status(500).send("Proxy Error: " + error.message);
  }
}
