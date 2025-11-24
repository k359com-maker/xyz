// --- DOM Access ---
const muteBtn = document.getElementById('muteBtn');
const bgMusic = document.getElementById('bg-music');
const bgVideo = document.getElementById('bg-video');
const clickOverlay = document.getElementById('clickOverlay');
const bioCard = document.getElementById('bioCard');
const typingElement = document.getElementById('typingText');
const discordWidget = document.getElementById('discord-activity-widget');

// Card Elements for sequential display
const avatar = bioCard.querySelector('.profile-pic-container');
const details = bioCard.querySelector('.user-details');
const discordWidgetContainer = bioCard.querySelector('.discord-status-container');
const divider = bioCard.querySelector('.card-divider');
const footer = bioCard.querySelector('.card-footer');
const locationInfoWrapper = bioCard.querySelector('.location-info-wrapper');

// --- Typing Animation Logic ---
/**
 * Handles the auto-typing and deleting text effect.
 * NOTE: Depends on 'texts', 'textIndex', 'charIndex', 'isDeleting' (from constants.js).
 */
function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
        charIndex--;
        typingElement.textContent = currentText.substring(0, charIndex);
        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, 50);
        }
    } else {
        charIndex++;
        typingElement.textContent = currentText.substring(0, charIndex);
        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 1500);
        } else {
            setTimeout(type, 100);
        }
    }
}

// --- Event Handlers ---

muteBtn.addEventListener('click', () => {
    const icon = muteBtn.querySelector('i');
    muteBtn.classList.add('rotating');
    
    setTimeout(() => {
        if (isMuted) {
            icon.classList.replace('fa-volume-mute', 'fa-volume-up');
            bgVideo.muted = false;
            bgMusic.muted = false;
        } else {
            icon.classList.replace('fa-volume-up', 'fa-volume-mute');
            bgVideo.muted = true;
            bgMusic.muted = true;
        }
        isMuted = !isMuted;
    }, 200);
    setTimeout(() => muteBtn.classList.remove('rotating'), 400);
});

clickOverlay.addEventListener('click', () => {
    // 1. Play media and fetch data
    bgVideo.play().catch(e => console.error("Video Autoplay failed:", e));
    bgMusic.play().catch(e => console.error("Audio Autoplay failed:", e));
    fetchDiscordStatus(); // Function from discord.js
    setInterval(fetchDiscordStatus, 15000);

    // 2. Hide overlay
    clickOverlay.classList.add('hidden');
    
    // 3. Show card and animate elements sequentially
    setTimeout(() => {
        clickOverlay.style.display = 'none';
        bioCard.classList.add('visible');
        enableCardTilt(); // Function from utils.js
        if (isMuted) muteBtn.click(); // Unmute if needed
        
        let delay = 0;
        const interval = 300;
        
        // Sequential reveal
        [avatar, details, discordWidgetContainer, locationInfoWrapper, divider, footer].forEach(element => {
            setTimeout(() => {
                element.classList.add('show-item');
            }, delay += interval);
        });
    }, 600);
});

// --- Initialization ---

// Start the typing animation
type();

// Load ParticlesJS
if (typeof particlesJS !== 'undefined') {
    particlesJS.load('particles-js', 'particles.json', () => console.log('Particles loaded'));
} else {
    console.warn('particlesJS is not loaded. Skipping particle initialization.');
}