export default async (request) => {
  const url = new URL(request.url);
  const target = url.searchParams.get("url");

  // /proxy というURLにアクセスされた時だけ動くよ
  if (!target || !url.pathname.startsWith("/proxy")) return;

  try {
    // Netlifyのサーバーが代わりにターゲットのサイトを読みに行く
    const response = await fetch(target, {
      headers: { "User-Agent": request.headers.get("user-agent") }
    });

    // 読み込んだ中身（HTMLとか画像とか）をそのまま君のブラウザに返す
    return new Response(response.body, {
      headers: response.headers
    });
  } catch (e) {
    return new Response("エラー: サイトを読み込めませんでした。", { status: 500 });
  }
};
