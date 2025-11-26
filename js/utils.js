function enableCardTilt() {
    const maxRotate = 10;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const supportsDeviceOrientation = window.DeviceOrientationEvent;
    
    function updateShimmer(rotateX, rotateY) {
        const shimmerTranslateX = (rotateY / maxRotate) * 50; 
        const shimmerTranslateY = (rotateX / maxRotate) * 20; 

        // ไม่จำเป็นต้องใช้ shimmerRotate ในโหมดแถบแสงแนวตั้ง

        bioCard.style.setProperty('--shimmer-x', `${shimmerTranslateX}%`);
        bioCard.style.setProperty('--shimmer-y', `${shimmerTranslateY}%`);
    }

    if (isTouchDevice && supportsDeviceOrientation) {
        window.addEventListener('deviceorientation', e => {
            let gamma = e.gamma; 
            let beta = e.beta; 
            
            // Inverted Y-axis (ซ้าย-ขวา)
            const rotateY = -(gamma / 90) * maxRotate; 
            
            // Normal X-axis (ขึ้น-ลง)
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
            
            // Normal X-axis (ขึ้น-ลง)
            const rotateX = (y - centerY) / centerY * -maxRotate;
            
            // Inverted Y-axis (ซ้าย-ขวา)
            const rotateY = -(x - centerX) / centerX * maxRotate; 
            
            bioCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            updateShimmer(rotateX, rotateY);
        });
        
        bioCard.addEventListener('mouseleave', () => {
            bioCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            
            bioCard.style.setProperty('--shimmer-x', `0%`);
            bioCard.style.setProperty('--shimmer-y', `0%`);
        });
    }
}
