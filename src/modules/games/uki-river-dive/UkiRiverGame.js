export class RiverGame {
    constructor(canvas, config = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.onGameOver = config.onGameOver || (() => { });
        this.onScoreUpdate = config.onScoreUpdate || (() => { });

        this.state = 'MENU';
        this.score = 0;
        this.fuel = 100;

        // SPEED LOGIC
        // Mobile speed reduced by ~50% (0.7) to match perceived scale
        const isSmallScreen = this.width < 800;
        this.baseSpeed = isSmallScreen ? 0.7 : 1.35;
        this.speed = this.baseSpeed;
        this.lastLevelScore = 0;

        this.distance = 0;
        // SCALING factor
        // Mobile (Canvas width < 800) -> 0.45 (1.5 * 0.3 = 30% of original, which is 70% smaller)

        const isMobile = this.width < 800;
        this.S = isMobile ? 0.5 : 1.5; // Adjusted down for mobile

        this.player = {
            x: this.width / 2,
            y: this.height - (isMobile ? 220 : 150), // Moved up on mobile to avoid buttons (was 120/150)
            width: 40 * this.S,
            height: 70 * this.S,
            speed: isMobile ? 3 : 5
        };

        this.obstacles = [];
        this.enemies = [];
        this.fuelTanks = [];
        this.nitroxTanks = [];
        this.bullets = [];

        this.lastTime = 0;
        this.animationId = null;
        this.keys = { left: false, right: false, shoot: false };

        this.colors = {
            water: '#2B3990',
            grass: '#4CAF50',
            mountain: '#654321'
        };
    }

    getRiverState(screenY) {
        const worldY = this.distance + (this.height - screenY);
        const phase = worldY * 0.003;
        const widthPhase = worldY * 0.001;

        const widthFactor = 0.6 + 0.2 * Math.sin(widthPhase);
        const currentCanyonWidth = this.width * widthFactor;

        const centerShift = (this.width * 0.2) * Math.sin(phase);
        const centerX = (this.width / 2) + centerShift;

        return {
            centerX,
            width: currentCanyonWidth,
            leftBank: centerX - (currentCanyonWidth / 2),
            rightBank: centerX + (currentCanyonWidth / 2)
        };
    }

    start() {
        this.state = 'PLAYING';
        this.score = 0;
        this.fuel = 100;
        this.distance = 0;
        this.speed = this.baseSpeed;
        this.lastLevelScore = 0;

        this.obstacles = [];
        this.enemies = [];
        this.fuelTanks = [];
        this.nitroxTanks = [];
        this.bullets = [];

        const river = this.getRiverState(this.player.y);
        this.player.x = river.centerX - this.player.width / 2;

        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.state = 'MENU';
    }

    handleInput(input) {
        this.keys = input;
    }

    shoot() {
        const gunTipX = this.player.x + (this.player.width * 0.5);
        const gunTipY = this.player.y;

        this.bullets.push({
            x: gunTipX - 2,
            y: gunTipY,
            width: 5,
            height: 15,
            active: true
        });
    }

    loop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (this.state === 'PLAYING') {
            this.update(deltaTime);
            this.draw();
            this.animationId = requestAnimationFrame((t) => this.loop(t));
        }
    }

    update(deltaTime) {
        this.distance += this.speed;

        // PROGRESSIVE SPEED: +10% every 1000 points
        if (Math.floor(this.score / 1000) > Math.floor(this.lastLevelScore / 1000)) {
            this.speed *= 1.1;
        }
        this.lastLevelScore = this.score;

        // 1. Move Player
        const riverAtPlayer = this.getRiverState(this.player.y + this.player.height / 2);

        if (this.keys.left) this.player.x -= this.player.speed;
        if (this.keys.right) this.player.x += this.player.speed;

        const margin = 5;
        if (this.player.x + margin < riverAtPlayer.leftBank ||
            this.player.x + this.player.width - margin > riverAtPlayer.rightBank) {
            this.gameOver();
            return;
        }

        // 2. Spawn Entities
        if (Math.random() < 0.01) this.spawnObstacle();
        if (Math.random() < 0.008) this.spawnEnemy();

        // REDUCED FUEL SPAWNS by 50%
        // Air was 0.006 -> 0.003
        // Nitrox was 0.002 -> 0.001
        if (Math.random() < 0.003) this.spawnFuel('air');
        if (Math.random() < 0.001) this.spawnFuel('nitrox');

        // 3. Update Entities & Physics
        const updateList = (list) => {
            for (let i = list.length - 1; i >= 0; i--) {
                let item = list[i];
                item.y += this.speed;

                const r = this.getRiverState(item.y + item.height / 2);

                if (item.type === 'net') {
                    item.x = r.leftBank;
                    item.width = r.width;
                } else if (item.kind && (item.kind === 'shark' || item.kind === 'jellyfish')) {
                    // --- ADVANCED BOUNCE LOGIC (X and Y) ---

                    // 1. Handle X Movement & Collision
                    let nextX = item.x + item.speedX;
                    let hitX = false;

                    // Check Banks X
                    if (nextX < r.leftBank || nextX + item.width > r.rightBank) hitX = true;

                    // Check Object Collisions X
                    if (!hitX) {
                        const testRectX = { x: nextX, y: item.y, width: item.width, height: item.height };
                        if (this.checkCollisionAny(testRectX, item)) hitX = true;
                    }

                    if (hitX) {
                        item.speedX *= -1;
                        if (item.kind === 'shark') item.facingLeft = item.speedX < 0;
                    } else {
                        item.x = nextX;
                    }

                    // 2. Handle Y Movement & Collision
                    let nextY = item.y + item.speedY;
                    let hitY = false;

                    const testRectY = { x: item.x, y: nextY, width: item.width, height: item.height };

                    // Check Object Collisions Y
                    if (this.checkCollisionAny(testRectY, item)) hitY = true;

                    if (hitY) {
                        item.speedY *= -1;
                    } else {
                        item.y = nextY;
                    }

                } else {
                    // Static clamp
                    if (item.x < r.leftBank) item.x = r.leftBank;
                    if (item.x + item.width > r.rightBank) item.x = r.rightBank - item.width;
                }

                if (item.y > this.height) list.splice(i, 1);
            }
        };

        updateList(this.obstacles);
        updateList(this.enemies);
        updateList(this.fuelTanks);
        updateList(this.nitroxTanks);

        // Bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].y -= 10;
            if (this.bullets[i].y < -20) this.bullets.splice(i, 1);
        }

        this.checkCollisions();

        this.fuel -= 0.025;
        if (this.fuel <= 0) this.gameOver();

        this.onScoreUpdate(Math.floor(this.score), Math.floor(this.fuel));
    }

    checkOverlap(rect) {
        const margin = 10;
        const r = {
            x: rect.x - margin,
            y: rect.y - margin,
            width: rect.width + margin * 2,
            height: rect.height + margin * 2
        };
        for (let e of this.obstacles) if (this.rectIntersect(r, e)) return true;
        for (let e of this.enemies) if (this.rectIntersect(r, e)) return true;
        for (let e of this.fuelTanks) if (this.rectIntersect(r, e)) return true;
        for (let e of this.nitroxTanks) if (this.rectIntersect(r, e)) return true;
        return false;
    }

    // Generic collision check against all entities (except self)
    checkCollisionAny(rect, self) {
        // Obstacles
        for (let o of this.obstacles) {
            if (o === self) continue;
            // For nets, strict check? Nets are obstacles. Yes.
            if (this.rectIntersect(rect, o)) return true;
        }
        // Enemies
        for (let e of this.enemies) {
            if (e === self) continue;
            if (this.rectIntersect(rect, e)) return true;
        }
        // Fuel
        for (let f of this.fuelTanks) if (this.rectIntersect(rect, f)) return true;
        // Nitrox
        for (let n of this.nitroxTanks) if (this.rectIntersect(rect, n)) return true;

        return false;
    }

    spawnObstacle() {
        const spawnY = -150; // Spawn higher up due to size increase
        const r = this.getRiverState(spawnY);

        if (Math.random() < 0.25) {
            // Net
            this.obstacles.push({
                type: 'net',
                x: r.leftBank,
                y: spawnY,
                width: r.width,
                height: 30 * this.S,
                hp: 3
            });
        } else {
            // Mountain / Wreck
            const isWreck = Math.random() > 0.6;

            // MOUNTAIN 2x SIZE LOGIC
            // Wrecks stay normal, Mountains get BIG.
            // Base Mountain was 40*S. Now 80*S ? Or just 2x scale factor for this specific spawn.
            const scaleM = isWreck ? 1 : 2.0;

            const w = (isWreck ? 50 : 40) * this.S * scaleM;
            const h = 40 * this.S * scaleM;

            for (let i = 0; i < 3; i++) {
                const x = r.leftBank + Math.random() * (r.width - w);
                const obj = { type: isWreck ? 'wreck' : 'mountain', x, y: spawnY, width: w, height: h };

                if (!this.checkOverlap(obj)) {
                    this.obstacles.push(obj);
                    break;
                }
            }
        }
    }

    spawnEnemy() {
        const spawnY = -120;
        const r = this.getRiverState(spawnY);
        const kind = Math.random() > 0.5 ? 'shark' : 'jellyfish';

        // SIZE INCREASE: +20% for visibility
        const sizeMult = 1.2;
        const w = (kind === 'shark' ? 80 : 40) * this.S * sizeMult;
        const h = (kind === 'shark' ? 35 : 50) * this.S * sizeMult;

        // SPEED REDUCTION ON MOBILE: -40%
        const isMobile = this.width < 800;
        const speedMult = isMobile ? 0.6 : 1.0;

        for (let i = 0; i < 3; i++) {
            const x = r.leftBank + Math.random() * (r.width - w);
            const obj = {
                kind: kind,
                x: x,
                y: spawnY,
                width: w,
                height: h,
                speedY: 0.5 * speedMult,
                speedX: (Math.random() - 0.5) * 2 * speedMult,
                facingLeft: false
            };
            if (!this.checkOverlap(obj)) {
                this.enemies.push(obj);
                break;
            }
        }
    }

    spawnFuel(type) {
        const spawnY = -120;
        const r = this.getRiverState(spawnY);
        // SIZE INCREASE: +20% for visibility & text readability
        const sizeMult = 1.2;
        const w = (type === 'nitrox' ? 50 : 30) * this.S * sizeMult;
        const h = 50 * this.S * sizeMult;

        for (let i = 0; i < 3; i++) {
            const x = r.leftBank + Math.random() * (r.width - w);
            const obj = { x, y: spawnY, width: w, height: h, type: type };
            if (!this.checkOverlap(obj)) {
                if (type === 'nitrox') this.nitroxTanks.push(obj);
                else this.fuelTanks.push(obj);
                break;
            }
        }
    }

    checkCollisions() {
        // Player vs Ops
        this.obstacles.forEach(o => {
            let hitbox = o;
            if (o.type === 'mountain' || o.type === 'wreck') {
                hitbox = { x: o.x + o.width * 0.2, y: o.y + o.height * 0.2, width: o.width * 0.6, height: o.height * 0.6 };
            }
            if (this.rectIntersect(this.player, hitbox)) this.gameOver();
        });

        this.enemies.forEach(e => { if (this.rectIntersect(this.player, e)) this.gameOver(); });

        for (let i = this.fuelTanks.length - 1; i >= 0; i--) {
            let f = this.fuelTanks[i];
            if (this.rectIntersect(this.player, f)) {
                this.fuel = Math.min(100, this.fuel + 20);
                this.score += 50;
                this.fuelTanks.splice(i, 1);
            }
        }
        for (let i = this.nitroxTanks.length - 1; i >= 0; i--) {
            let f = this.nitroxTanks[i];
            if (this.rectIntersect(this.player, f)) {
                this.fuel = 100;
                this.score += 200;
                this.nitroxTanks.splice(i, 1);
            }
        }

        // Bullets
        for (let b = this.bullets.length - 1; b >= 0; b--) {
            let bullet = this.bullets[b];
            let hit = false;

            for (let e = this.enemies.length - 1; e >= 0; e--) {
                if (this.rectIntersect(bullet, this.enemies[e])) {
                    this.enemies.splice(e, 1);
                    this.score += 150;
                    hit = true;
                    break;
                }
            }
            if (!hit) {
                for (let o = this.obstacles.length - 1; o >= 0; o--) {
                    if (this.obstacles[o].type === 'net' && this.rectIntersect(bullet, this.obstacles[o])) {
                        this.obstacles.splice(o, 1);
                        this.score += 50;
                        hit = true;
                        break;
                    }
                }
            }
            if (!hit) hit = destroyFuel(this.fuelTanks, bullet);
            if (!hit) hit = destroyFuel(this.nitroxTanks, bullet);

            if (hit) this.bullets.splice(b, 1);

            function destroyFuel(list, bul) {
                for (let f = list.length - 1; f >= 0; f--) {
                    if (bullet.x < list[f].x + list[f].width &&
                        bullet.x + bullet.width > list[f].x &&
                        bullet.y < list[f].y + list[f].height &&
                        bullet.height + bullet.y > list[f].y) {
                        list.splice(f, 1); return true;
                    }
                } return false;
            }
        }
    }

    rectIntersect(r1, r2) {
        const padding = 5;
        return !(r2.x + padding > r1.x + r1.width - padding ||
            r2.x + r2.width - padding < r1.x + padding ||
            r2.y + padding > r1.y + r1.height - padding ||
            r2.y + r2.height - padding < r1.y + padding);
    }

    gameOver() {
        this.state = 'GAMEOVER';
        this.onGameOver(this.score);
        this.stop();
    }

    draw() {
        const ctx = this.ctx;
        const STRIP_HEIGHT = 5;
        for (let y = 0; y < this.height; y += STRIP_HEIGHT) {
            const r = this.getRiverState(y);
            ctx.fillStyle = '#2B3990'; ctx.fillRect(r.leftBank, y, r.width, STRIP_HEIGHT);
            ctx.fillStyle = this.colors.grass; ctx.fillRect(0, y, r.leftBank, STRIP_HEIGHT);
            ctx.fillRect(r.rightBank, y, this.width - r.rightBank, STRIP_HEIGHT);
            ctx.fillStyle = '#1e5f30'; ctx.fillRect(r.leftBank - 5, y, 5, STRIP_HEIGHT); ctx.fillRect(r.rightBank, y, 5, STRIP_HEIGHT);
        }

        this.obstacles.forEach(o => {
            if (o.type === 'mountain') this.drawMountain(ctx, o);
            else if (o.type === 'wreck') this.drawWreck(ctx, o);
            else if (o.type === 'net') this.drawNet(ctx, o);
        });

        this.fuelTanks.forEach(f => this.drawAirTank(ctx, f));
        this.nitroxTanks.forEach(f => this.drawNitroxTank(ctx, f));

        this.enemies.forEach(e => {
            if (e.kind === 'shark') this.drawShark(ctx, e);
            else this.drawJellyfish(ctx, e);
        });

        this.drawDiver(ctx, this.player);

        ctx.fillStyle = '#FF0';
        this.bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
    }

    // --- SPRITES ---

    drawWreck(ctx, w) {
        ctx.save(); ctx.translate(w.x, w.y);
        const W = w.width; const H = w.height;
        ctx.fillStyle = '#8B4513'; ctx.beginPath(); ctx.moveTo(0, H * 0.3); ctx.lineTo(W * 0.2, H); ctx.lineTo(W * 0.9, H); ctx.lineTo(W, H * 0.4); ctx.lineTo(0, H * 0.3); ctx.fill();
        ctx.fillStyle = '#A0522D'; ctx.fillRect(W * 0.3, H * 0.1, W * 0.4, H * 0.5);
        ctx.fillStyle = '#2F4F4F'; ctx.fillRect(W * 0.35, H * 0.2, W * 0.1, H * 0.15); ctx.fillRect(W * 0.55, H * 0.2, W * 0.1, H * 0.15);
        ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.moveTo(W * 0.2, H * 0.8); ctx.lineTo(W * 0.4, H * 0.9); ctx.lineTo(W * 0.3, H); ctx.fill();
        ctx.restore();
    }

    drawDiver(ctx, p) {
        ctx.save(); ctx.translate(p.x, p.y);
        const W = p.width; const H = p.height;
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(W / 2 + 5, H / 2 + 5, W * 0.3, H * 0.4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#222';
        ctx.save(); ctx.translate(W * 0.3, H * 0.6); ctx.rotate(0.2); ctx.fillRect(-W * 0.1, 0, W * 0.2, H * 0.25); ctx.restore();
        ctx.save(); ctx.translate(W * 0.7, H * 0.6); ctx.rotate(-0.2); ctx.fillRect(-W * 0.1, 0, W * 0.2, H * 0.25); ctx.restore();
        // FINS FIX: Use proportional sizes (W, H) instead of hardcoded pixels
        const finColor = '#FFD700';
        const fh = H * 0.3; // Fin height (approx 20px at S=1.5)
        const fw = W * 0.25; // Fin width half (approx 10px)

        ctx.save(); ctx.translate(W * 0.2, H * 0.85); ctx.rotate(0.3); ctx.fillStyle = finColor;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-fw, fh); ctx.lineTo(fw, fh); ctx.fill(); ctx.restore();

        ctx.save(); ctx.translate(W * 0.8, H * 0.85); ctx.rotate(-0.3); ctx.fillStyle = finColor;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-fw, fh); ctx.lineTo(fw, fh); ctx.fill(); ctx.restore();
        ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.4, W * 0.35, H * 0.25, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#C0C0C0'; ctx.beginPath(); ctx.roundRect(W * 0.25, H * 0.1, W * 0.15, H * 0.4, 5); ctx.fill(); ctx.beginPath(); ctx.roundRect(W * 0.6, H * 0.1, W * 0.15, H * 0.4, 5); ctx.fill();
        ctx.fillStyle = '#333'; ctx.fillRect(W * 0.3, H * 0.08, W * 0.4, 5);
        ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(W / 2, H * 0.15, W * 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#00CED1'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.15, W * 0.15, H * 0.1, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W * 0.3, H * 0.15); ctx.lineTo(W * 0.1, H * 0.18); ctx.stroke();
        ctx.strokeStyle = '#222'; ctx.lineWidth = W * 0.12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(W * 0.75, H * 0.3); ctx.lineTo(W * 0.85, H * 0.1); ctx.lineTo(W * 0.5, -5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W * 0.25, H * 0.3); ctx.lineTo(W * 0.15, H * 0.15); ctx.stroke();
        ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(W * 0.5, H * 0.2); ctx.lineTo(W * 0.5, -15); ctx.stroke();
        ctx.fillStyle = '#C0C0C0'; ctx.beginPath(); ctx.moveTo(W * 0.5 - 3, -15); ctx.lineTo(W * 0.5 + 3, -15); ctx.lineTo(W * 0.5, -25); ctx.fill();
        ctx.strokeStyle = 'red'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W * 0.5 - 2, H * 0.1); ctx.lineTo(W * 0.5 + 2, H * 0.1); ctx.stroke();
        ctx.restore();
    }
    drawShark(ctx, s) {
        ctx.save(); ctx.translate(s.x, s.y);
        if (s.facingLeft || (s.speedX && s.speedX < 0)) { ctx.translate(s.width, 0); ctx.scale(-1, 1); }
        const W = s.width; const H = s.height;
        ctx.fillStyle = '#708090'; ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.quadraticCurveTo(-W * 0.1, H * 0.1, -W * 0.25, H * 0.05); ctx.quadraticCurveTo(-W * 0.1, H * 0.9, -W * 0.2, H * 0.95); ctx.lineTo(0, H / 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.bezierCurveTo(W * 0.4, -H * 0.2, W * 0.8, -H * 0.1, W, H * 0.6); ctx.bezierCurveTo(W * 0.8, H * 1.1, W * 0.4, H * 1.1, 0, H / 2); ctx.fill();
        ctx.fillStyle = '#B0C4DE'; ctx.beginPath(); ctx.moveTo(W * 0.2, H * 0.6); ctx.quadraticCurveTo(W * 0.5, H * 0.9, W * 0.8, H * 0.65); ctx.fill();
        ctx.fillStyle = '#708090'; ctx.beginPath(); ctx.moveTo(W * 0.45, H * 0.2); ctx.lineTo(W * 0.35, -H * 0.25); ctx.quadraticCurveTo(W * 0.45, H * 0.1, W * 0.6, H * 0.25); ctx.fill();
        ctx.beginPath(); ctx.moveTo(W * 0.45, H * 0.6); ctx.lineTo(W * 0.35, H * 1.1); ctx.lineTo(W * 0.55, H * 0.7); ctx.fill();
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(W * 0.85, H * 0.45, W * 0.03, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#444'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(W * 0.65, H * 0.45); ctx.lineTo(W * 0.65, H * 0.65); ctx.stroke();
        ctx.restore();
    }
    drawMountain(ctx, m) {
        ctx.save(); ctx.translate(m.x, m.y);
        const W = m.width; const H = m.height;
        ctx.fillStyle = '#5D4037'; ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(W * 0.5, 0); ctx.lineTo(W, H); ctx.fill();
        ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.moveTo(W * 0.5, 0); ctx.lineTo(W * 0.35, H * 0.3); ctx.lineTo(W * 0.5, H * 0.25); ctx.lineTo(W * 0.65, H * 0.3); ctx.closePath(); ctx.fill();
        ctx.restore();
    }
    drawNet(ctx, n) {
        ctx.save(); ctx.translate(n.x, n.y);
        ctx.strokeStyle = '#EEE'; ctx.lineWidth = 1;
        ctx.beginPath(); for (let i = 0; i <= n.width; i += 10) { ctx.moveTo(i, 0); ctx.lineTo(i, n.height); }
        for (let i = 0; i <= n.height; i += 10) { ctx.moveTo(0, i); ctx.lineTo(n.width, i); } ctx.stroke();
        ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(n.width, 0); ctx.stroke();
        ctx.fillStyle = '#FF4500'; for (let i = 10; i < n.width; i += 30) { ctx.beginPath(); ctx.arc(i, 0, 5, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
    }
    drawJellyfish(ctx, j) {
        ctx.save(); ctx.translate(j.x, j.y);
        const W = j.width; const H = j.height;
        ctx.fillStyle = 'rgba(255, 20, 147, 0.6)'; ctx.beginPath(); ctx.arc(W / 2, H * 0.35, W / 2, Math.PI, 0); ctx.fill();
        ctx.strokeStyle = '#FF69B4'; ctx.lineWidth = 2; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(W * i / 4, H * 0.35); ctx.bezierCurveTo(W * i / 4 - 10, H * 0.7, W * i / 4 + 10, H * 0.9, W * i / 4, H); ctx.stroke(); }
        ctx.restore();
    }
    drawAirTank(ctx, f) {
        ctx.save(); ctx.translate(f.x, f.y);
        const W = f.width; const H = f.height;
        let grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0, '#D3D3D3'); grad.addColorStop(0.5, '#FFFFFF'); grad.addColorStop(1, '#C0C0C0');
        ctx.fillStyle = grad; ctx.beginPath(); ctx.roundRect(0, 5, W, H - 5, 5); ctx.fill();
        ctx.fillStyle = '#111'; ctx.fillRect(W * 0.3, 0, W * 0.4, 5);
        ctx.fillStyle = '#000'; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'center'; ctx.fillText("AIR", W / 2, H * 0.6);
        ctx.restore();
    }
    drawNitroxTank(ctx, f) {
        ctx.save(); ctx.translate(f.x, f.y);
        const W = f.width; const H = f.height;
        const cylinderWidth = W * 0.48;
        const gradL = ctx.createLinearGradient(0, 0, cylinderWidth, 0);
        gradL.addColorStop(0, '#32CD32'); gradL.addColorStop(0.5, '#ADFF2F'); gradL.addColorStop(1, '#32CD32');
        ctx.fillStyle = gradL; ctx.beginPath(); ctx.roundRect(0, 5, cylinderWidth, H - 5, 5); ctx.fill();
        ctx.save(); ctx.translate(W - cylinderWidth, 0); ctx.fillStyle = gradL; ctx.beginPath(); ctx.roundRect(0, 5, cylinderWidth, H - 5, 5); ctx.fill(); ctx.restore();
        ctx.fillStyle = '#333'; ctx.fillRect(cylinderWidth / 2, 5, W - cylinderWidth, 5); ctx.fillRect(cylinderWidth / 2 - 2, 0, 6, 5); ctx.fillRect(W - cylinderWidth / 2 - 4, 0, 6, 5);
        ctx.fillStyle = '#000'; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center'; ctx.fillText("EAN", cylinderWidth / 2, H * 0.6); ctx.fillText("32", W - cylinderWidth / 2, H * 0.6);
        ctx.strokeStyle = '#222'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, H * 0.3); ctx.lineTo(W, H * 0.3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, H * 0.75); ctx.lineTo(W, H * 0.75); ctx.stroke();
        ctx.restore();
    }
}
