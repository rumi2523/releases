const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const forwardBtn = document.getElementById('forward');
const backwardBtn = document.getElementById('backward');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const trackTitle = document.getElementById('track-title');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const trackListEl = document.getElementById('track-list');

let tracks = [];
let currentTrackIndex = 0;

// Load tracks from /music folder
async function loadTracks() {
    try {
        const response = await fetch('music/');
        const text = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(text, 'text/html');
        const links = Array.from(htmlDoc.querySelectorAll('a'));
        tracks = links
            .filter(link => link.href.endsWith('.mp3'))
            .map(link => link.getAttribute('href'));
        populateTrackList();
    } catch (err) {
        console.error('Failed to load tracks:', err);
    }
}

// Populate track list
function populateTrackList() {
    trackListEl.innerHTML = '';
    tracks.forEach((track, index) => {
        const trackItem = document.createElement('div');
        trackItem.classList.add('track-item');
        const trackName = track.split('/').pop().replace('.mp3','');
        trackItem.textContent = trackName;
        trackItem.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            playTrack();
        });
        trackListEl.appendChild(trackItem);
    });
}

// Load track
function loadTrack(index) {
    audio.src = tracks[index];
    trackTitle.textContent = tracks[index].split('/').pop().replace('.mp3','');
    updateActiveTrack();
}

// Highlight active track
function updateActiveTrack() {
    const items = document.querySelectorAll('.track-item');
    items.forEach((item, idx) => item.classList.toggle('active', idx === currentTrackIndex));
}

// Play/pause
function playTrack() {
    audio.play();
    playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
}

function pauseTrack() {
    audio.pause();
    playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
}

playBtn.addEventListener('click', () => {
    audio.paused ? playTrack() : pauseTrack();
});

// Next/Prev tracks
nextBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    playTrack();
});
prevBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    playTrack();
});

// Forward/backward 10s
forwardBtn.addEventListener('click', () => {
    audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
});
backwardBtn.addEventListener('click', () => {
    audio.currentTime = Math.max(audio.currentTime - 10, 0);
});

// Update progress
audio.addEventListener('timeupdate', () => {
    if(audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
});

// Click progress bar
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
});

// Auto next track
audio.addEventListener('ended', () => nextBtn.click());

// Format time mm:ss
function formatTime(time) {
    if(isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0'+seconds : seconds}`;
}

// Initialize
loadTracks();