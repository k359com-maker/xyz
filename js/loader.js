(function() {
    const enterScreen = document.getElementById('enter-screen');
    const enterText = document.getElementById('enter-text');
    const loaderContainer = document.getElementById('loader-container');
    const islandLoader = document.getElementById('island-loader');
    const mainContainer = document.getElementById('main-container');
    const islandTrigger = document.getElementById('island-trigger');

    if (enterScreen) {
        enterScreen.addEventListener('click', function handleFirstOpen() {
            if (enterScreen.classList.contains('clicked') || enterScreen.classList.contains('curtains-return')) return;
            enterScreen.classList.add('clicked');

            if (enterText) enterText.style.opacity = '0';
            
            setTimeout(() => {
                if (enterText) enterText.style.display = 'none';
                if (loaderContainer) loaderContainer.style.display = 'flex';
                
                setTimeout(() => {
                    loaderContainer.classList.add('fade-out');
                    
                    setTimeout(() => {
                        loaderContainer.style.display = 'none';
                        enterScreen.classList.add('split-active');
                        
                        if (islandTrigger) {
                            islandTrigger.style.display = 'block';
                            setTimeout(() => islandTrigger.classList.add('island-show'), 50);
                        }
                        if (mainContainer) {
                            mainContainer.style.display = 'flex';
                            setTimeout(() => mainContainer.classList.add('show-cards'), 100);
                        }

                        if (typeof window.runTypewriterEffect === 'function') {
                            window.runTypewriterEffect();
                        }
                        if (typeof window.startWebAudio === 'function') {
                            window.startWebAudio();
                        }
                        
                        setTimeout(() => {
                            enterScreen.style.display = 'none';
                        }, 1200);

                    }, 400);

                }, 2500); 
            }, 300);
        });
    }

    if (islandTrigger) {
        islandTrigger.addEventListener('click', function handleIslandClick(e) {
            e.stopPropagation(); 

            enterScreen.style.display = 'block';
            setTimeout(() => {
                enterScreen.classList.remove('split-active');
                enterScreen.classList.add('curtains-return');
            }, 30);

            setTimeout(() => {
                if (islandLoader) {
                    islandLoader.style.display = 'flex';
                    setTimeout(() => islandLoader.classList.add('fade-in'), 50);
                }

                setTimeout(() => {
                    window.location.href = "ngl.html"; 
                }, 1000);

            }, 600); 
        });
    }
})();