document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. ระบบสลับธีม (Dark / Light Mode) พร้อมจดจำค่าผ่าน localStorage
    // -------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('site_theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('site_theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'light') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    // -------------------------------------------------------------
    // 2. ระบบ View Counter API ที่ใช้งานได้จริง 100% 
    // -------------------------------------------------------------
    const viewCountSpan = document.getElementById('view-count');
    const namespace = 'solara-x-profile-v1';
    const key = 'visits';

    if (viewCountSpan) {
        fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`)
            .then(response => response.json())
            .then(data => {
                viewCountSpan.innerText = data.count.toLocaleString();
            })
            .catch(error => {
                console.error('Error fetching view count:', error);
                fetch(`https://api.counterapi.dev/v1/${namespace}/${key}`)
                    .then(res => res.json())
                    .then(data => {
                        viewCountSpan.innerText = data.count.toLocaleString();
                    })
                    .catch(() => {
                        viewCountSpan.innerText = '4,198';
                    });
            });
    }

    // -------------------------------------------------------------
    // 3. ระบบเอฟเฟกต์หิมะชมพูอมแดง
    // -------------------------------------------------------------
    const canvas = document.getElementById('snow-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        let particles = [];
        const particleCount = 75;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Snowflake {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * -canvas.height;
                
                const sizeRandom = Math.random();
                if (sizeRandom < 0.75) {
                    this.radius = Math.random() * 1.5 + 0.8;
                    this.speed = Math.random() * 2.5 + 1.8;
                } else {
                    this.radius = Math.random() * 1.5 + 2.0;
                    this.speed = Math.random() * 1.0 + 0.6;
                }

                this.drift = Math.random() * 1.5 + 0.5;
                this.opacity = Math.random() * 0.6 + 0.3;
                
                const colors = [
                    'rgba(255, 150, 180, ',
                    'rgba(255, 105, 135, ',
                    'rgba(255, 80, 110,  ',
                    'rgba(235, 64, 92,   '
                ];
                this.colorBase = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.y += this.speed;
                this.x += this.drift + Math.sin(this.y * 0.015) * 0.3;

                if (this.y > canvas.height + this.radius || this.x > canvas.width + 10) {
                    this.x = Math.random() * canvas.width - 50;
                    this.y = -10;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = this.colorBase + this.opacity + ')';
                ctx.shadowBlur = 6;
                ctx.shadowColor = 'rgba(255, 100, 130, 0.6)';
                ctx.fill();
                ctx.closePath();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Snowflake());
        }

        function animateSnow() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(snowflake => {
                snowflake.update();
                snowflake.draw();
            });
            requestAnimationFrame(animateSnow);
        }
        animateSnow();
    }

    // -------------------------------------------------------------
    // 4. Navigation Tabs Animation & Double-Click/Double-Tap Link Handling
    // -------------------------------------------------------------
    const navItems = document.querySelectorAll('.nav-item');
    const navIndicator = document.getElementById('nav-indicator');

    if (navItems.length > 0 && navIndicator) {
        navIndicator.style.width = `${navItems[0].offsetWidth}px`;
        navIndicator.style.transform = `translateX(0px)`;

        navItems.forEach((item) => {
            const link = item.querySelector('.nav-link');

            // ฟังก์ชันสำหรับเลื่อนแถบ Active
            const activateTab = () => {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                const itemWidth = item.offsetWidth;
                const leftPosition = item.offsetLeft - 15;
                navIndicator.style.transform = `translateX(${leftPosition}px)`;
                navIndicator.style.width = `${itemWidth}px`;
            };

            // รองรับฝั่ง Desktop (คลิกเดี่ยวเลื่อนแถบ / ดับเบิ้ลคลิกเปิดลิงก์)
            item.addEventListener('click', activateTab);

            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault(); // ป้องกันลิงก์เปลี่ยนหน้าทันทีเมื่อคลิกครั้งเดียว
                });

                item.addEventListener('dblclick', () => {
                    const targetUrl = link.getAttribute('href');
                    if (targetUrl && targetUrl !== '#') {
                        window.open(targetUrl, '_blank');
                    }
                });

                // รองรับฝั่ง Mobile (แตะสองครั้งติดกันเพื่อเปิดลิงก์)
                let lastTapTime = 0;
                item.addEventListener('touchend', (e) => {
                    const currentTime = new Date().getTime();
                    const tapLength = currentTime - lastTapTime;
                    
                    if (tapLength < 300 && tapLength > 0) {
                        // ถ้าแตะสองครั้งในเวลาต่ำกว่า 0.3 วินาที ให้เปิดลิงก์
                        e.preventDefault();
                        const targetUrl = link.getAttribute('href');
                        if (targetUrl && targetUrl !== '#') {
                            window.open(targetUrl, '_blank');
                        }
                    } else {
                        // แตะครั้งแรกให้ทำงานเลื่อนแถบปกติ
                        activateTab();
                    }
                    lastTapTime = currentTime;
                });
            }
        });
    }

    // -------------------------------------------------------------
    // 5. ระบบเอฟเฟกต์การ์ดเอียงตามเมาส์และมือถือ
    // -------------------------------------------------------------
    const container = document.getElementById('main-container');

    if (container) {
        setTimeout(() => {
            container.classList.add('animated');
        }, 1500);

        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
            container.style.transition = 'transform 0.1s ease-out';
        });

        document.addEventListener('mouseleave', () => {
            container.style.transform = `rotateY(0deg) rotateX(0deg)`;
            container.style.transition = 'transform 0.5s ease';
        });

        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                const tiltX = e.gamma; 
                const tiltY = e.beta;  

                if (tiltX !== null && tiltY !== null) {
                    const limitX = Math.max(-20, Math.min(20, tiltX));
                    const limitY = Math.max(-20, Math.min(20, tiltY - 45));

                    container.style.transform = `rotateY(${limitX}deg) rotateX(${-limitY}deg)`;
                    container.style.transition = 'transform 0.1s ease-out';
                }
            }, true);
        }
    }
});