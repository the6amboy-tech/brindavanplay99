const API_BASE = "myapibrindavan.vercel.app"; // Use your URL here
let queue = [];
let currentIndex = 0;
const audio = document.getElementById('audio');

// 1. SEARCH MUSIC
async function searchMusic() {
    const query = document.getElementById('search').value;
    const res = await fetch(`${API_BASE}/search/songs?query=${query}`);
    const data = await res.json();
    render(data.data.results);
}

// 2. RENDER CARDS
function render(songs) {
    const grid = document.getElementById('grid');
    grid.innerHTML = songs.map(s => `
        <div class="card">
            <img src="${s.image[2].link}" onclick="playNow(${JSON.stringify(s).replace(/"/g, '&quot;')})">
            <div class="add-btn" onclick="addToQueue(${JSON.stringify(s).replace(/"/g, '&quot;')})"><i class="fa-plus fa-solid"></i></div>
            <div style="margin-top:10px; font-weight:600;">${s.name}</div>
        </div>
    `).join('');
}

// 3. SMOOTH PLAYLIST SYNC
async function savePlaylist() {
    const key = document.getElementById('sync-key').value.toLowerCase();
    if(!key || queue.length === 0) return alert("Playlist name and songs required!");
    
    await fetch('/api/playlist', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ user: 'global', name: key, songs: queue })
    });
    alert("🔥 Live on all devices!");
}

async function loadPlaylist() {
    const key = document.getElementById('sync-key').value.toLowerCase();
    const res = await fetch(`/api/playlist?user=global&name=${key}`);
    const data = await res.json();
    if(res.ok) { queue = data; playNow(queue[0]); alert("Fetched!"); }
}

function addToQueue(song) { queue.push(song); }
function playNow(song) {
    document.getElementById('p-title').innerText = song.name;
    document.getElementById('p-img').src = song.image[2].link;
    audio.src = song.downloadUrl[4].link; // High quality 320kbps
    audio.play();
}
