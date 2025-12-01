const muteBtn = document.getElementById('muteBtn');
const bgMusic = document.getElementById('bg-music');
const bgVideo = document.getElementById('bg-video');
const clickOverlay = document.getElementById('clickOverlay');
const bioCard = document.getElementById('bioCard');
const typingElement = document.getElementById('typingText');
const discordWidget = document.getElementById('discord-activity-widget');

const avatar = bioCard.querySelector('.profile-pic-container');
const details = bioCard.querySelector('.user-details');
const discordWidgetContainer = bioCard.querySelector('.discord-status-container');
const divider = bioCard.querySelector('.card-divider');
const footer = bioCard.querySelector('.card-footer');
const locationInfoWrapper = bioCard.querySelector('.location-info-wrapper');

const onlineStatusButton = document.querySelector('.online-status-fixed');


function animateCount(element, targetCount) {
    const currentCount = parseInt(element.innerText) || 0;
    const duration = 800; 
    
    const startTimestamp = performance.now();

    function stepAnimation(timestamp) {
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        
        const count = Math.floor(progress * (targetCount - currentCount) + currentCount);
        element.innerText = count.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(stepAnimation);
        } else {
            element.innerText = targetCount.toLocaleString(); 
        }
    }

    requestAnimationFrame(stepAnimation);
}


function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
        charIndex--;
        typingElement.textContent = currentText.substring(0, charIndex);
        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        } else setTimeout(type, 50);
    } else {
        charIndex++;
        typingElement.textContent = currentText.substring(0, charIndex);
        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 1500);
        } else setTimeout(type, 100);
    }
}

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
    
    if (typeof fetchDiscordStatus === 'function') {
        fetchDiscordStatus();
    }
    
    clickOverlay.classList.add('hidden');
    
    setTimeout(() => {
        clickOverlay.style.display = 'none';
        bioCard.classList.add('visible');

        if (isMuted) muteBtn.click(); 
        
        let delay = 0;
        const interval = 120;
        
        [avatar, locationInfoWrapper, details, discordWidgetContainer, divider] 
            .forEach(element => {
                setTimeout(() => element.classList.add('show-item'), delay += interval);
            });
            
        setTimeout(() => {
             footer.classList.add('show-item');
             
             const socialIcons = footer.querySelectorAll('.social-icon');
             let iconDelay = delay; 
             const iconInterval = 120;

             socialIcons.forEach(icon => {
                 setTimeout(() => {
                     icon.classList.add('show-item');
                 }, iconDelay += iconInterval);
             });
             
        }, delay); 


    }, 600);
});

if (onlineStatusButton) {
    onlineStatusButton.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = onlineStatusButton.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        this.appendChild(ripple);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    });
}

if (typeof enableCardTilt === 'function') {
    enableCardTilt();
}

type();

bgVideo.addEventListener('ended', () => {
    bgVideo.currentTime = 0;
    bgVideo.play().catch(e => console.error("Video restart failed:", e));
});
