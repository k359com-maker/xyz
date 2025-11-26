function enableCardTilt() {
    const maxRotate = 10;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const supportsDeviceOrientation = window.DeviceOrientationEvent;
    
    function updateShimmer(rotateX, rotateY) {
        const shimmerX = (0.5 - (rotateY / maxRotate / 2)) * 100; 
        const shimmerY = (0.5 - (rotateX / maxRotate / 2)) * 100; 

        bioCard.style.setProperty('--shimmer-x', `${shimmerX}%`);
        bioCard.style.setProperty('--shimmer-y', `${shimmerY}%`);
    }

    if (isTouchDevice && supportsDeviceOrientation) {
        window.addEventListener('deviceorientation', e => {
            let gamma = e.gamma; 
            let beta = e.beta; 
            const rotateY = (gamma / 90) * maxRotate;
            const rotateX = -(beta / 90) * maxRotate;
            const finalRotateX = Math.max(-maxRotate, Math.min(maxRotate, rotateX));
            const finalRotateY = Math.max(-maxRotate, Math.min(maxRotate, rotateY));
            
            bioCard.style.transform = `perspective(1000px) rotateX(${finalRotateX}deg) rotateY(${finalRotateY}deg)`;
            
            updateShimmer(finalRotateX, finalRotateY);
            
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
            
            updateShimmer(rotateX, rotateY);
        });
        
        bioCard.addEventListener('mouseleave', () => {
            bioCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            
            bioCard.style.setProperty('--shimmer-x', `50%`);
            bioCard.style.setProperty('--shimmer-y', `50%`);
        });
    }
}
