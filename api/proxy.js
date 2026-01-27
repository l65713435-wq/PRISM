export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("URLを指定してください。");
  }

  try {
    // Vercelのサーバーが代わりにサイトを読みに行く
    const response = await fetch(decodeURIComponent(url), {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const contentType = response.headers.get("content-type");
    res.setHeader("Content-Type", contentType);

    // 読み込んだデータをそのままブラウザに送る
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).send("エラー: サイトを読み込めませんでした。");
  }
}
