// --- ส่วนควบคุมฟิสิกส์อั่งเปา ---
const { Engine, Render, Runner, Bodies, Composite, Body, Events } = Matter;

const engine = Engine.create();
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
        // ทำให้ภาพชัดเจนบนหน้าจอมือถือ
        pixelRatio: window.devicePixelRatio || 1 
    }
});

function createExtremeTiltedAngpao() {
    const x = Math.random() * window.innerWidth;
    
    // ขนาดจิ๋วพิเศษ (สุ่ม 0.003 - 0.005)
    const baseScale = 0.003 + Math.random() * 0.002; 
    
    const angpao = Bodies.rectangle(x, -50, 4, 6, {
        frictionAir: 0.12, 
        render: {
            opacity: 1,
            sprite: {
                texture: 'https://img5.pic.in.th/file/secure-sv1/16236.png',
                xScale: baseScale,
                yScale: baseScale
            }
        }
    });

    // ตั้งค่า "องศาการเอียงซอง" ให้ชัดเจน
    const type = Math.random();
    if (type < 0.4) {
        // แบบหมุน 360 องศา (ควงสว่าน)
        angpao.behavior = 'rotate';
        angpao.rotSpeed = (Math.random() > 0.5 ? 1 : -1) * (0.05 + Math.random() * 0.1);
    } else {
        // แบบเอียงซ้ายหรือขวาเยอะๆ (ล็อคองศา)
        const extremeTilt = (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 2.5); 
        Body.setAngle(angpao, extremeTilt);
        angpao.behavior = 'fixed';
    }

    angpao.currentScale = baseScale;
    angpao.isDead = false;
    Composite.add(engine.world, angpao);
}

Events.on(engine, 'afterUpdate', function() {
    const bodies = Composite.allBodies(engine.world);
    
    bodies.forEach(body => {
        if (body.isStatic) return;

        // ตกตรงๆ (ส่ายน้อยมาก)
        Body.applyForce(body, body.position, {
            x: Math.sin(Date.now() * 0.001 + body.id) * 0.000002,
            y: 0
        });

        if (body.behavior === 'rotate') {
            Body.setAngle(body, body.angle + body.rotSpeed);
        } else {
            // ล็อคองศาไม่ให้แกว่ง
            Body.setAngularVelocity(body, 0); 
        }

        // อนิเมชั่นตอนหาย (หดตัว + จาง)
        if (body.position.y > window.innerHeight * 0.88) {
            body.isDead = true;
        }

        if (body.isDead) {
            body.currentScale *= 0.88; 
            body.render.sprite.xScale = body.currentScale;
            body.render.sprite.yScale = body.currentScale;
            body.render.opacity -= 0.05;
            if (body.render.opacity <= 0) {
                Composite.remove(engine.world, body);
            }
        }
    });
});

Render.run(render);
Runner.run(Runner.create(), engine);

// ปล่อยซอง (ปรับเวลา 250ms เพื่อลดจำนวนซองลงตามที่ต้องการ)
setInterval(createExtremeTiltedAngpao, 250);

// ระบบเอียงตามมือถือ
window.addEventListener('deviceorientation', (e) => {
    if (e.gamma !== null) {
        engine.world.gravity.x = e.gamma / 50;
        engine.world.gravity.y = e.beta / 50;
    }
});
