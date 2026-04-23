/**
 * Pyflow Landing — Canvas rings animation + parallax
 */
(function () {
    const canvas = document.getElementById('rings');
    const ctx = canvas.getContext('2d', { alpha: true });
    const reduceMotion = false;

    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.5), cx = 0, cy = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999, active: false };

    const PHRASE = "PYTHON · IA · APRENDER · CONSTRUIR · MODELOS · DADOS · AGENTES · ALGORITMOS · MACHINE LEARNING · DEEP LEARNING · NEURAL NETWORKS · API · WEB · AUTOMAÇÃO · SCRIPT · FRAMEWORK · LIBRARY · TENSORFLOW · PYTORCH · PANDAS · NUMPY · DJANGO · FLASK · FASTAPI · JUPYTER · ANÁLISE · VISUALIZAÇÃO · ESTATÍSTICA · PROJETOS · ROBÔS · CHATBOTS · VISION · NLP · CLUSTERING · CLASSIFICAÇÃO · REGRESSÃO · PREDIÇÃO · INTELIGÊNCIA · COMPUTAÇÃO · PROGRAMAÇÃO · DESENVOLVIMENTO · INOVAÇÃO · TECNOLOGIA · FUTURO · CARREIRA · OPORTUNIDADE · TRANSFORMAÇÃO · DIGITAL · CLOUD · SERVIDOR · BANCO · SQL · MONGODB · POSTGRESQL · DOCKER · KUBERNETES · GITHUB · VERSIONAMENTO · COLABORAÇÃO · COMUNIDADE · REDES · CONEXÕES · SISTEMAS · ARQUITETURA · MICROSERVIÇOS · ESCALABILIDADE · PERFORMANCE · OTIMIZAÇÃO · DEBUGGING · TESTES · QUALIDADE · DOCUMENTAÇÃO · BEST PRACTICES · PADRÕES · CLEAN CODE · REFACTORING · AGILE · SCRUM · METODOLOGIAS · PRODUTIVIDADE · EFICIÊNCIA · AUTONOMIA · CRIATIVIDADE · SOLUÇÕES · PROBLEMAS · DESAFIOS · APRENDIZADO · CONHECIMENTO · HABILIDADES · COMPETÊNCIAS · ESPECIALIZAÇÃO · MESTRIA · EXPERTISE · PROFISSIONAL · MERCADO · EMPREGO · STARTUP · EMPREENDEDORISMO · INOVAÇÃO · DISRUPTIVA · TENDÊNCIAS · EVOLUÇÃO · PROGRESSO · SUCESSO · EXCELÊNCIA ";
    const CHARS = Array.from(new Set(PHRASE.split(""))).filter(c => c !== " ");
    let rings = [];
    const glyphCache = new Map();

    function getGlyph(ch, size, weight) {
        const key = ch + '|' + size + '|' + weight;
        let g = glyphCache.get(key);
        if (g) return g;
        const pad = 2;
        const w = Math.ceil(size * 0.9) + pad * 2;
        const h = Math.ceil(size * 1.2) + pad * 2;
        const c = document.createElement('canvas');
        c.width = Math.ceil(w * dpr);
        c.height = Math.ceil(h * dpr);
        const gx = c.getContext('2d');
        gx.scale(dpr, dpr);
        gx.font = weight + ' ' + size + 'px "Inter", system-ui, sans-serif';
        gx.textBaseline = 'middle';
        gx.textAlign = 'center';
        gx.fillStyle = '#ffffff';
        gx.fillText(ch, w / 2, h / 2);
        g = { canvas: c, w: w, h: h };
        glyphCache.set(key, g);
        return g;
    }

    function build() {
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cx = Math.min(width * 0.66, width - 300);
        cy = height * 0.5;
        const max = Math.hypot(width, height) * 0.6;
        const step = 80;
        const count = Math.min(10, Math.floor(max / step));

        const prevCount = rings.length;
        if (rings.length === prevCount && prevCount > 0) return;

        rings = [];
        for (let i = 0; i < count; i++) {
            const dir = i % 2 === 0 ? 1 : -1;
            rings.push({
                radius: 120 + i * step,
                speed: dir * (0.0005 + (i % 3) * 0.0002),
                size: 14 + ((i * 1.3) % 3),
                offset: Math.random() * Math.PI * 2,
                opacity: Math.max(0.008, 0.12 - i * 0.008),
                weight: i % 5 === 0 ? '600' : '400'
            });
        }
        glyphCache.clear();
        for (const r of rings) for (const ch of CHARS) getGlyph(ch, Math.round(r.size), r.weight);
    }
    build();
    window.addEventListener('resize', build);

    let pendingMouse = null, mouseRaf = false;
    window.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        pendingMouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        if (!mouseRaf) {
            mouseRaf = true;
            requestAnimationFrame(function () {
                if (pendingMouse) { mouse.x = pendingMouse.x; mouse.y = pendingMouse.y; mouse.active = true; }
                mouseRaf = false;
            });
        }
    }, { passive: true });
    canvas.addEventListener('mouseleave', function () { mouse.active = false; mouse.x = -9999; mouse.y = -9999; });

    // Touch support para mobile
    window.addEventListener('touchmove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
    }, { passive: true });
    window.addEventListener('touchend', () => { mouse.active = false; }, { passive: true });
    window.addEventListener('touchcancel', () => { mouse.active = false; }, { passive: true });

    running = true;

    document.addEventListener("visibilitychange", () => {
        running = !document.hidden;
        if (running && !rafId) rafId = requestAnimationFrame(tick);
    });

    function drawRing(ring, t) {
        const mx = mouse.x, my = mouse.y, active = mouse.active;
        const INFLUENCE = 220, INF2 = INFLUENCE * INFLUENCE;
        const perimeter = 2 * Math.PI * ring.radius;
        const charWidth = ring.size * 0.95;
        const total = Math.max(20, Math.floor(perimeter / charWidth));
        const angleStep = (Math.PI * 2) / total;
        const baseAngle = ring.offset + t * ring.speed * 1000;
        const sizeR = Math.round(ring.size);

        for (let i = 0; i < total; i++) {
            const ch = PHRASE[i % PHRASE.length];
            if (ch === " ") continue;
            const a = baseAngle + i * angleStep;
            let x = cx + Math.cos(a) * ring.radius;
            let y = cy + Math.sin(a) * ring.radius;
            let scale = 1, alpha = ring.opacity, warm = false;

            const positionFactor = (i % total) / total;
            const opacityWave = Math.sin(positionFactor * Math.PI * 2 + t * 0.3) * 0.3 + 0.7;
            alpha = ring.opacity * opacityWave;

            if (active) {
                const dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy;
                if (d2 < INF2) {
                    const d = Math.sqrt(d2) || 1, k = 1 - d / INFLUENCE;
                    x += (dx / d) * (k * 24);
                    y += (dy / d) * (k * 24);
                    scale = 1 + k * 0.5;
                    alpha = Math.min(0.95, ring.opacity + k * 0.65);
                    warm = k > 0.55;
                }
            }
            const g = getGlyph(ch, sizeR, ring.weight);
            ctx.globalAlpha = alpha;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(a + Math.PI / 2);
            if (scale !== 1) ctx.scale(scale, scale);
            ctx.drawImage(g.canvas, -g.w / 2, -g.h / 2, g.w, g.h);
            if (warm) {
                ctx.globalCompositeOperation = 'source-atop';
                ctx.fillStyle = 'hsl(45, 30%, 88%)';
                ctx.globalAlpha = alpha * 0.5;
                ctx.fillRect(-g.w / 2, -g.h / 2, g.w, g.h);
            }
            ctx.restore();
        }
        ctx.globalAlpha = 1;
    }

    let t = 0, lastTime = performance.now(), rafId = null;
    const FRAME_MS = 1000 / 30;
    function tick(now) {
        rafId = null;
        if (!running) return;
        const cur = now || performance.now();
        const elapsed = cur - lastTime;
        if (elapsed < FRAME_MS) { rafId = requestAnimationFrame(tick); return; }
        lastTime = cur - (elapsed % FRAME_MS);
        t += 0.015;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'hsla(45, 30%, 88%, 0.9)';
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        for (const r of rings) drawRing(r, t);

        rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    // Parallax sutil no canvas (escuta o scroll do .page, que é o container rolável)
    if (!reduceMotion) {
        const scroller = document.querySelector('.page') || window;
        let parallaxRaf = false;
        const applyParallax = () => {
            const y = (scroller === window ? window.scrollY : scroller.scrollTop) || 0;
            canvas.style.transform = `translate3d(0, ${y * 0.05}px, 0)`;
            parallaxRaf = false;
        };
        (scroller === window ? window : scroller).addEventListener('scroll', () => {
            if (!parallaxRaf) { parallaxRaf = true; requestAnimationFrame(applyParallax); }
        }, { passive: true });
    }
})();
