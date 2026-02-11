// 1. あなたのAPIキーを入力してください
const API_KEY = 'AIzaSyBikGgGdnzAnbLG4dD1cSFD1JDEVsB9y6s'; 
const PUBLISHED_AFTER = '2026-01-01T00:00:00Z';

async function fetchYouTubeRanking() {
    const container = document.getElementById('ranking-container');

    try {
        // Step A: 2026年以降の音楽カテゴリの動画を再生数順に検索
        const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=viewCount&publishedAfter=${PUBLISHED_AFTER}&type=video&videoCategoryId=10&key=${API_KEY}`
        );
        const searchData = await searchResponse.json();

        if (!searchData.items) throw new Error('データが取得できませんでした');

        const videoIds = searchData.items.map(item => item.id.videoId).join(',');

        // Step B: 各動画の具体的な統計データ（再生数）を取得
        const statsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${API_KEY}`
        );
        const statsData = await statsResponse.json();

        // 画面に表示
        renderRanking(statsData.items);

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="color:red;">データの読み込みに失敗しました。APIキーを確認してください。</p>';
    }
}

function renderRanking(videos) {
    const container = document.getElementById('ranking-container');
    container.innerHTML = ''; // ローディング表示を消す

    videos.forEach((video, index) => {
        const title = video.snippet.title;
        const channel = video.snippet.channelTitle;
        const thumbnail = video.snippet.thumbnails.medium.url;
        const views = Number(video.statistics.viewCount).toLocaleString();
        const videoId = video.id;

        const cardHtml = `
            <div class="ranking-item">
                <div class="rank">${index + 1}</div>
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                    <img src="${thumbnail}" class="thumbnail" alt="${title}">
                </a>
                <div class="info">
                    <span class="video-title">${title}</span>
                    <span class="channel-title">${channel}</span>
                    <span class="view-count">🔥 ${views} 回再生</span>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHtml);
    });
}

// ページ読み込み時に実行
fetchYouTubeRanking();