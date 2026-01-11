<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PRISM - Portal</title>
    <style>
        :root {
            --prism-1: #00f2fe; --prism-1-rgb: 0, 242, 254;
            --prism-3: #7000ff; --prism-3-rgb: 112, 0, 255;
            --prism-5: #ff00c8; --prism-5-rgb: 255, 0, 200;
            --bg-color: #000;
            --accent-red: #ff0000;
        }

        /* 🆕 ホラーモード時の設定 */
        body.horror-mode {
            --prism-1: #ff0000; --prism-1-rgb: 255, 0, 0;
            --prism-3: #660000; --prism-3-rgb: 102, 0, 0;
            --prism-5: #220000; --prism-5-rgb: 34, 0, 0;
            animation: glitch-bg 0.2s infinite;
        }

        @keyframes glitch-bg {
            0% { background: #050000; }
            50% { background: #000; }
            100% { background: #0a0000; }
        }

        body, html {
            margin: 0; padding: 0; width: 100%; height: 100%;
            background: var(--bg-color); display: flex; flex-direction: column; align-items: center;
            font-family: 'Inter', sans-serif; color: #fff; overflow-x: hidden; transition: 0.5s;
        }

        /* ダークモード切替ボタン */
        .mode-toggle {
            position: fixed; top: 20px; right: 20px; z-index: 100;
            background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
            color: #fff; padding: 10px; border-radius: 50%; cursor: pointer; font-size: 1.2rem;
        }

        .tab-container {
            margin-top: 40px; display: flex; gap: 10px;
            background: rgba(255, 255, 255, 0.05); padding: 5px; border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1); z-index: 10;
        }
        .tab-btn {
            padding: 10px 30px; border-radius: 12px; border: none; background: transparent;
            color: rgba(255, 255, 255, 0.5); cursor: pointer; transition: 0.3s; font-weight: bold;
        }
        .tab-btn.active {
            background: rgba(var(--prism-1-rgb), 0.2); color: var(--prism-1);
            box-shadow: 0 0 15px rgba(var(--prism-1-rgb), 0.3);
        }

        .content-section { display: none; width: 100%; max-width: 900px; flex-direction: column; align-items: center; padding-top: 5vh; }
        .content-section.active { display: flex; animation: fadeIn 0.5s ease; }

        /* Proxy */
        .digital-clock { font-size: 1.2rem; letter-spacing: 5px; color: rgba(255,255,255,0.6); margin-bottom: 10px; }
        h1 {
            font-size: clamp(3rem, 10vw, 6rem); font-weight: 950; margin: 0;
            letter-spacing: 15px; background: linear-gradient(to right, #fff, var(--prism-1), var(--prism-3), var(--prism-5), #fff);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 200%;
            animation: shine 8s linear infinite;
        }

        input {
            width: 80%; max-width: 500px; padding: 20px; margin-top: 30px;
            border-radius: 15px; border: 2px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.05); color: #fff; text-align: center; font-size: 1.2rem;
        }

        /* Games Grid */
        .game-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 15px; width: 90%; margin-top: 30px; }
        .game-card {
            background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 15px; border-radius: 15px; text-align: center; cursor: pointer; transition: 0.3s; color: #fff; text-decoration: none;
        }
        .game-card:hover { transform: translateY(-5px); background: rgba(var(--prism-1-rgb), 0.2); border-color: var(--prism-1); }
        .horror-tag { color: #ff4d4d; font-size: 0.7rem; font-weight: bold; border: 1px solid #ff4d4d; border-radius: 4px; padding: 2px 5px; margin-bottom: 5px; display: inline-block; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    </style>
</head>
<body>
    <button class="mode-toggle" onclick="toggleHorror()">⚡️</button>

    <div class="tab-container">
        <button class="tab-btn active" onclick="switchTab('proxy')">PROXY</button>
        <button class="tab-btn" onclick="switchTab('games')">GAMES</button>
    </div>

    <section id="proxy-section" class="content-section active">
        <div class="digital-clock" id="clock">00:00:00</div>
        <h1>PRISM</h1>
        <input type="text" id="target" placeholder="URL or Keywords" onkeydown="if(event.key==='Enter') navigate()">
    </section>

    <section id="games-section" class="content-section">
        <h2 id="hub-title" style="letter-spacing: 10px; opacity: 0.8;">GAME HUB</h2>
        <div class="game-grid">
            <div class="game-card" onclick="fastNav('https://www.crazygames.com/t/horror')"><span class="horror-tag">HORROR</span><h3>Horror Hub</h3><p>Many Games</p></div>
            <div class="game-card" onclick="fastNav('https://www.google.com/search?q=play+granny+online+unblocked')"><span class="horror-tag">HORROR</span><h3>Granny</h3><p>Escape</p></div>
            <div class="game-card" onclick="fastNav('https://poki.com/en/g/forgotten-hill-disillusion')"><span class="horror-tag">HORROR</span><h3>Forgotten Hill</h3><p>Mystery</p></div>
            <div class="game-card" onclick="fastNav('https://paper-io.com')"><h3>Paper.io</h3><p>IO Game</p></div>
            <div class="game-card" onclick="fastNav('https://hole-io.com')"><h3>Hole.io</h3><p>IO Game</p></div>
            <div class="game-card" onclick="fastNav('https://voxiom.io')"><h3>Voxiom.io</h3><p>FPS</p></div>
            <div class="game-card" onclick="fastNav('https://krunker.io')"><h3>Krunker.io</h3><p>FPS</p></div>
            <div class="game-card" onclick="fastNav('https://sites.google.com/site/unblockedgames76/')"><h3>UG 76</h3><p>Mirror</p></div>
        </div>
    </section>

    <script>
        function updateClock() {
            const now = new Date();
            document.getElementById('clock').textContent = now.toTimeString().split(' ')[0];
        }
        setInterval(updateClock, 1000); updateClock();

        function switchTab(type) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            if(type === 'proxy') {
                document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
                document.getElementById('proxy-section').classList.add('active');
            } else {
                document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
                document.getElementById('games-section').classList.add('active');
            }
        }

        // 🆕 ホラーモード切り替え
        function toggleHorror() {
            document.body.classList.toggle('horror-mode');
            const isHorror = document.body.classList.contains('horror-mode');
            document.getElementById('hub-title').textContent = isHorror ? "CURSED HUB" : "GAME HUB";
        }

        function navigate() {
            const val = document.getElementById('target').value;
            if(!val) return;
            const url = (val.includes('.') || val.startsWith('http')) ? (val.startsWith('http') ? val : 'https://'+val) : 'https://www.google.com/search?q='+encodeURIComponent(val);
            fastNav(url);
        }

        function fastNav(url) {
            window.location.href = '/api/proxy?url=' + encodeURIComponent(url);
        }
    </script>
</body>
</html>
