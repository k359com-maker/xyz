const muteBtn = document.getElementById('muteBtn');
const bgMusic = document.getElementById('bg-music');
const bgVideo = document.getElementById('bg-video');
const clickOverlay = document.getElementById('clickOverlay');
const bioCard = document.getElementById('bioCard');
const typingElement = document.getElementById('typingText');
let isMuted = true;
const DISCORD_USER_ID = '742692894292443187';
const LANYARD_API_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;
const discordWidget = document.getElementById('discord-activity-widget');
let siteStartTime = Date.now(); 
function formatTimeElapsed(milliseconds) {
    if (milliseconds < 0) return '0:00';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    if (hours > 0) {
        return `${hours}:${paddedMinutes}:${paddedSeconds}`;
    }
    return `${minutes}:${paddedSeconds}`;
}
function updateDiscordStatus(data) {
    if (!data || !data.discord_user || !data.discord_user.username) {
        discordWidget.innerHTML = `<div class="discord-info-wrapper" style="padding: 10px;">Cannot fetch Discord data. Check User ID or Lanyard status.</div>`;
        return;
    }
    const username = data.discord_user.username;
    const { discord_status, activities, discord_user } = data;
    const avatarHash = discord_user.avatar;
    const userId = discord_user.id;
    let userAvatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=64`;
    const statusText = discord_status.charAt(0).toUpperCase() + discord_status.slice(1);
    let statusColor = '#949ba4';
    if (discord_status === 'online') statusColor = '#09ff00ff';
    else if (discord_status === 'idle') statusColor = '#ffc400ff';
    else if (discord_status === 'dnd') statusColor = '#ff0000ff';
    const presence = activities.find(a => a.type === 0 || a.type === 4 || a.type === 2);
    let activityInfoHtml = '';
    let richPresenceIconHtml = '';
    if (presence) {
        const assets = presence.assets;
        const largeImageKey = assets ? assets.large_image : null;
        let imageUrl = '';
        if (largeImageKey) {
            if (largeImageKey.startsWith('spotify:')) {
                imageUrl = largeImageKey.replace('spotify:', 'https://i.scdn.co/image/');
            } else if (presence.application_id) {
                imageUrl = `https://cdn.discordapp.com/app-assets/${presence.application_id}/${largeImageKey}.png`;
            }
        }
        const activityType = presence.type === 0 ? 'Playing' : (presence.type === 2 ? 'Listening to' : (presence.name === 'Custom Status' ? '' : presence.name));
        const activityName = presence.name === 'Custom Status' ? (presence.state || 'Custom Status') : presence.name;
        const activityDetails = presence.details || '';
        const activityState = presence.state && presence.name !== 'Custom Status' ? presence.state : (presence.details && presence.name !== 'Custom Status' ? '' : '');
        activityInfoHtml = `
            <div class="activity-info">
                ${activityType ? `<div class="activity-type">${activityType}</div>` : ''}
                <div class="activity-name">${activityName}</div>
                <div class="activity-details">${activityDetails}</div>
                ${activityState ? `<div class="activity-state">${activityState}</div>` : ''}
            </div>
        `;
        let iconToDisplay = '';
        if (imageUrl) {
            iconToDisplay = `<img src="${imageUrl}" alt="Activity Icon" class="activity-icon">`;
        } else {
            iconToDisplay = `<img src="media/pngtree-question-mark-vector-icon-png-image_696419.jpg" alt="Default Activity Icon" class="activity-icon">`;
        }
        richPresenceIconHtml = `
            <div class="activity-icon-container">
                ${iconToDisplay}
            </div>
        `;
    } else {
        const elapsed = Date.now() - siteStartTime;
        const formattedElapsed = formatTimeElapsed(elapsed);
        activityInfoHtml = `
            <div class="activity-info">
                <div class="activity-type">${statusText}</div>
                ${discord_status === 'online' ? `<div class="activity-details">Site Time: ${formattedElapsed}</div>` : ''}
                ${discord_status === 'dnd' ? '<div class="activity-details">Do Not Disturb</div>' : ''}
                ${discord_status === 'idle' ? '<div class="activity-details">Away</div>' : ''}
            </div>
        `;
        richPresenceIconHtml = '';
    }
    discordWidget.innerHTML = `
        <div class="discord-avatar-container">
            <img src="${userAvatarUrl}" alt="Discord Avatar" class="discord-avatar">
            <div class="avatar-frame"></div> <div class="status-indicator" style="background-color: ${statusColor};" title="Status: ${statusText}"></div>
        </div>
        <div class="discord-info-wrapper">
            <div class="discord-header-info">
                <div class="discord-username">${username}</div>
            </div>
            ${activityInfoHtml}
        </div>
        ${richPresenceIconHtml}
    `;
}
async function fetchDiscordStatus() {
    try {
        const response = await fetch(LANYARD_API_URL);
        const json = await response.json();
        if (json.success) {
            console.log("✅ Discord Data received:", json.data); 
            updateDiscordStatus(json.data);
        } else {
            console.error("❌ Lanyard API returned failure:", json); 
            updateDiscordStatus({});
        }
    } catch (error) {
        console.error("⚠️ Error fetching Discord status:", error); 
        updateDiscordStatus({});
    }
}
const avatar = bioCard.querySelector('.profile-pic-container');
const details = bioCard.querySelector('.user-details');
const discordWidgetContainer = bioCard.querySelector('.discord-status-container');
const divider = bioCard.querySelector('.card-divider');
const footer = bioCard.querySelector('.card-footer');
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
    bgVideo.play().catch(e => console.error("Video Autoplay failed:", e));
    bgMusic.play().catch(e => console.error("Audio Autoplay failed:", e));
    fetchDiscordStatus();
    setInterval(fetchDiscordStatus, 15000);
    clickOverlay.classList.add('hidden');
    setTimeout(() => {
        clickOverlay.style.display = 'none';
        bioCard.classList.add('visible');
        enableCardTilt();
        if (isMuted) muteBtn.click(); 
        let delay = 0;
        const interval = 300;
        setTimeout(() => {
            avatar.classList.add('show-item');
        }, delay += interval);
        setTimeout(() => {
            details.classList.add('show-item');
        }, delay += interval);
        setTimeout(() => {
            discordWidgetContainer.classList.add('show-item');
        }, delay += interval);
        setTimeout(() => {
            divider.classList.add('show-item');
        }, delay += interval);
        setTimeout(() => {
            footer.classList.add('show-item');
        }, delay += interval);
    }, 600);
});
function enableCardTilt() {
    const maxRotate = 10;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const supportsDeviceOrientation = window.DeviceOrientationEvent;
    if (isTouchDevice && supportsDeviceOrientation) {
        window.addEventListener('deviceorientation', e => {
            let gamma = e.gamma; 
            let beta = e.beta;   
            const rotateY = (gamma / 90) * maxRotate;
            const rotateX = -(beta / 90) * maxRotate;
            const finalRotateX = Math.max(-maxRotate, Math.min(maxRotate, rotateX));
            const finalRotateY = Math.max(-maxRotate, Math.min(maxRotate, rotateY));
            bioCard.style.transform = `perspective(1000px) rotateX(${finalRotateX}deg) rotateY(${finalRotateY}deg)`;
        }, true);
    }
    if (!isTouchDevice || !supportsDeviceOrientation) {
        bioCard.addEventListener('mousemove', e => {
            const rect = bioCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -maxRotate;
            const rotateY = (x - centerX) / centerX * maxRotate;
            bioCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        bioCard.addEventListener('mouseleave', () => {
            bioCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }
}
const texts = [".gg/solarax", "REN", "love is not life"];
let textIndex = 0, charIndex = 0, isDeleting = false;
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
type();
if (typeof particlesJS !== 'undefined') {
    particlesJS.load('particles-js', 'particles.json', () => console.log('Particles loaded'));
} else {
    console.warn('particlesJS is not loaded. Skipping particle initialization.');
}