let isPlaying = false; 
let currentTrackIndex = 0;

const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const songTitle = document.getElementById('song-title');
const albumArt = document.getElementById('album-art');
const progressLine = document.getElementById('progress-line');
const progressBarClick = document.getElementById('progress-bar-click');
const currentTimeTxt = document.getElementById('current-time');
const durationTimeTxt = document.getElementById('duration-time');

window.startWebAudio = function() {
    if (!isPlaying && audio) {
        audio.play().then(() => {
            isPlaying = true;
            if (playBtn) playBtn.className = "fa-solid fa-pause";
            const musicCard = document.querySelector('.music-card'); 
            if (musicCard) musicCard.classList.add('is-playing'); 
        }).catch(err => console.log("Granted"));
    }
}

const playlist = [
    {
        title: "Dave ft. Tems  Raindance",
        url: "media/Dave ft. Tems  Raindance.mp3",
        cover: "media/Dave ft. Tems – Raindancesss.jpg"
    },
    {
        title: "Playboi Carti - TOXIC",
        url: "media/Playboi Carti - TOXIC [with Skepta] (Official Audio).mp3", 
        cover: "media/download.jpg" 
    }
];

function loadTrack(index) {
    if (!playlist[index] || !audio) return;
    const track = playlist[index];
    audio.src = track.url;
    if (songTitle) songTitle.textContent = track.title;
    if (albumArt) albumArt.src = track.cover;
}

function togglePlay() {
    const musicCard = document.querySelector('.music-card');
    if (!audio) return;
    
    if (isPlaying) {
        audio.pause();
        if (playBtn) playBtn.className = "fa-solid fa-play";
        if (musicCard) musicCard.classList.remove('is-playing'); 
    } else {
        audio.play().catch(e => console.log("Audio Playback Activated"));
        if (playBtn) playBtn.className = "fa-solid fa-pause";
        if (musicCard) musicCard.classList.add('is-playing'); 
    }
    isPlaying = !isPlaying;
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    const musicCard = document.querySelector('.music-card');
    if (!audio) return;
    audio.play().then(() => {
        isPlaying = true;
        if (playBtn) playBtn.className = "fa-solid fa-pause";
        if (musicCard) musicCard.classList.add('is-playing');
    }).catch(e => console.log(e));
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    const musicCard = document.querySelector('.music-card');
    if (!audio) return;
    audio.play().then(() => {
        isPlaying = true;
        if (playBtn) playBtn.className = "fa-solid fa-pause";
        if (musicCard) musicCard.classList.add('is-playing');
    }).catch(e => console.log(e));
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (!duration) return;
    const progressPercent = (currentTime / duration) * 100;
    if (progressLine) progressLine.style.width = `${progressPercent}%`;

    let curMinutes = Math.floor(currentTime / 60);
    let curSeconds = Math.floor(currentTime % 60);
    if (curSeconds < 10) curSeconds = `0${curSeconds}`;
    if (currentTimeTxt) currentTimeTxt.textContent = `${curMinutes}:${curSeconds}`;

    let durMinutes = Math.floor(duration / 60);
    let durSeconds = Math.floor(duration % 60);
    if (durSeconds < 10) durSeconds = `0${durSeconds}`;
    if (durationTimeTxt) durationTimeTxt.textContent = `${durMinutes}:${durSeconds}`;
}

function setProgress(e) {
    if (!this || !audio) return;
    const width = this.clientWidth;
    const clickX = e.offsetX;
    if (audio.duration) {
        audio.currentTime = (clickX / width) * audio.duration;
    }
}

async function fetchStatsAPI() {
    try {
        const mockData = { views: "N/A" };
        const viewEl = document.getElementById('view-count');
        if (viewEl) viewEl.textContent = mockData.views;
    } catch (err) {
        console.log("Stats API Active");
    }
}

const words = ["REN", "Dev", "idk"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

window.runTypewriterEffect = function typeEffect() {
    const typewriterElement = document.getElementById("typewriter");
    if (!typewriterElement) return; 

    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; 
        isDeleting = true;
    } 
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length; 
        typeSpeed = 400; 
    }

    setTimeout(typeEffect, typeSpeed);
}

if (playBtn) playBtn.addEventListener('click', togglePlay);
if (nextBtn) nextBtn.addEventListener('click', nextTrack);
if (prevBtn) prevBtn.addEventListener('click', prevTrack);
if (audio) {
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack); 
}
if (progressBarClick) progressBarClick.addEventListener('click', setProgress);

document.addEventListener('DOMContentLoaded', () => {
    loadTrack(currentTrackIndex);
    fetchStatsAPI();
});