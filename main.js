const DEFAULT_CONFIG = {
    recipient: '',
    sender: '',
    intro: 'Hay presencias que no llegan para pasar. Llegan para cambiar la forma en que miramos el universo.',
    messages: [],
    media: [],
    song: { src: '' },
};
const configured = window.FLOWERS_CONFIG || {};
const CONFIG = {
    ...DEFAULT_CONFIG,
    ...configured,
    messages: Array.isArray(configured.messages) ? configured.messages : DEFAULT_CONFIG.messages,
    media: Array.isArray(configured.media) ? configured.media : DEFAULT_CONFIG.media,
    song: configured.song || DEFAULT_CONFIG.song,
};

const hearts = document.getElementById('hearts');
const moments = document.getElementById('moments');
const song = document.getElementById('song');
const musicToggle = document.getElementById('music-toggle');
const startButton = document.getElementById('start');
const finalMessage = document.getElementById('final-message');
const garden = document.querySelector('.garden');
const mediaViewer = document.getElementById('media-viewer');
const mediaViewerContent = document.getElementById('media-viewer-content');
const mediaViewerCaption = document.getElementById('media-viewer-caption');

function stageMobileFloralIntro() {
    if (!window.matchMedia('(max-width: 760px)').matches) return;

    document.body.classList.add('mobile-floral-intro');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('mobile-floral-settled');
        return;
    }

    window.setTimeout(() => document.body.classList.add('mobile-floral-settled'), 5200);
}

stageMobileFloralIntro();
document.body.classList.remove('container');
garden.append(finalMessage);
document.getElementById('intro').textContent = CONFIG.intro;
document.getElementById('recipient-line').textContent = CONFIG.recipient ? `Para ${CONFIG.recipient}` : '';

function svgElement(tag, attributes, parent) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    if (parent) parent.append(node);
    return node;
}

function createBotanicalGarden() {
    const svg = svgElement('svg', {
        viewBox: '0 0 700 650',
        role: 'img',
        'aria-label': 'Girasoles amarillos con tallos y hojas verdes',
    });
    const defs = svgElement('defs', {}, svg);
    const petalGradient = svgElement('linearGradient', { id: 'real-petal', x1: '0', y1: '1', x2: '1', y2: '0' }, defs);
    [['0%', '#a8600e'], ['35%', '#e5a61a'], ['72%', '#ffd84c'], ['100%', '#fff0a5']].forEach(([offset, color]) => svgElement('stop', { offset, 'stop-color': color }, petalGradient));
    const backPetalGradient = svgElement('linearGradient', { id: 'real-petal-back', x1: '0', y1: '1', x2: '1', y2: '0' }, defs);
    [['0%', '#9a5a0b'], ['65%', '#e9ad20'], ['100%', '#f7d969']].forEach(([offset, color]) => svgElement('stop', { offset, 'stop-color': color }, backPetalGradient));
    const leafGradient = svgElement('linearGradient', { id: 'real-leaf', x1: '0', y1: '1', x2: '1', y2: '0' }, defs);
    [['0%', '#143b27'], ['50%', '#447540'], ['100%', '#a3b969']].forEach(([offset, color]) => svgElement('stop', { offset, 'stop-color': color }, leafGradient));
    const centerGradient = svgElement('radialGradient', { id: 'real-center', cx: '.35', cy: '.3', r: '.7' }, defs);
    [['0%', '#a87425'], ['55%', '#503016'], ['100%', '#1d1009']].forEach(([offset, color]) => svgElement('stop', { offset, 'stop-color': color }, centerGradient));

    const flowers = [[350, 145, 1.04, -3], [188, 245, .72, -16], [512, 250, .7, 17], [275, 285, .67, -10], [423, 300, .65, 13], [112, 365, .54, -24], [575, 370, .55, 24]];
    flowers.forEach(([x, y, scale, tilt], index) => {
        const plant = svgElement('g', { class: 'botanical-plant', style: `--flower-delay:${index * .18}s` }, svg);
        const stemPath = `M350 625 Q${x + (350 - x) * .22} 470 ${x} ${y}`;
        svgElement('path', { d: stemPath, fill: 'none', stroke: '#153b26', 'stroke-width': 9, pathLength: 1, class: 'botanical-stem' }, plant);
        svgElement('path', { d: stemPath, fill: 'none', stroke: '#6b8e4e', 'stroke-width': 3.5, pathLength: 1, class: 'botanical-stem botanical-stem-highlight', style: `animation-delay:${index * .18 + .18}s` }, plant);

        for (let leafIndex = 0; leafIndex < 2; leafIndex += 1) {
            const leafX = x + (350 - x) * (.42 + leafIndex * .2);
            const leafY = y + (625 - y) * (.45 + leafIndex * .2);
            const direction = (index + leafIndex) % 2 ? 1 : -1;
            const leaf = svgElement('g', { class: 'botanical-leaf', transform: `translate(${leafX} ${leafY}) rotate(${direction * 42}) scale(${direction * (.55 + scale * .3)} .8)`, style: `--flower-delay:${index * .18 + leafIndex * .18 + .35}s` }, plant);
            svgElement('path', { d: 'M0 0 Q-12 -62 75 -96 Q91 -27 0 0Z', fill: 'url(#real-leaf)', stroke: '#6f9354', 'stroke-width': '.8' }, leaf);
            svgElement('path', { d: 'M0 0 Q38 -45 75 -96 M22 -30 L18 -60 M38 -48 L62 -47 M50 -64 L48 -80', fill: 'none', stroke: '#c4d28d', 'stroke-width': '1', opacity: '.48' }, leaf);
        }

        const flower = svgElement('g', { class: 'botanical-flower', transform: `translate(${x} ${y}) rotate(${tilt}) scale(${scale})`, style: `--flower-delay:${index * .18 + .65}s` }, plant);
        for (let layer = 0; layer < 2; layer += 1) {
            for (let petalIndex = 0; petalIndex < 19; petalIndex += 1) {
                const petalGroup = svgElement('g', { transform: `rotate(${petalIndex * 360 / 19 + layer * 9}) scale(${layer ? .84 : 1})` }, flower);
                svgElement('path', { d: 'M-8 -13 C-23 -38 -16 -79 -3 -90 C12 -88 24 -41 9 -14Z', fill: layer ? 'url(#real-petal)' : 'url(#real-petal-back)', stroke: '#f8dc7655', 'stroke-width': '.8' }, petalGroup);
                svgElement('path', { d: 'M0 -20 Q-4 -49 -3 -83', fill: 'none', stroke: '#fff7c7', opacity: '.3', 'stroke-width': '1' }, petalGroup);
            }
        }
        svgElement('circle', { r: 24, fill: 'url(#real-center)', stroke: '#c6963b', 'stroke-width': 2 }, flower);
        for (let seed = 0; seed < 130; seed += 1) {
            const radius = 21 * Math.sqrt(seed / 130);
            const angle = seed * 2.39996;
            svgElement('ellipse', { cx: Math.cos(angle) * radius, cy: Math.sin(angle) * radius, rx: 1.1, ry: 1.45, fill: seed % 3 ? '#c49a42' : '#e4c26b', opacity: .55 + (seed % 4) * .1, class: 'botanical-seed' }, flower);
        }
    });

    svgElement('path', { d: 'M70 625 Q180 585 260 625 T450 620 T650 625', fill: 'none', stroke: '#345d35', 'stroke-width': 12, opacity: '.75' }, svg);
    document.getElementById('botanical-garden').append(svg);
}

function openMediaViewer(item) {
    mediaViewerContent.replaceChildren();
    const media = document.createElement(item.type === 'video' ? 'video' : 'img');
    media.src = item.src;
    media.alt = item.text || 'Recuerdo especial';
    if (item.type === 'video') {
        media.controls = true;
        media.autoplay = true;
        media.muted = true;
        media.loop = true;
        media.playsInline = true;
    }
    mediaViewerContent.append(media);
    if (item.type === 'video') media.play().catch(() => undefined);
    mediaViewerCaption.textContent = item.text || item.label || '';
    mediaViewer.showModal();
}

function closeMediaViewer() {
    mediaViewerContent.replaceChildren();
    mediaViewer.close();
}

function createHearts() {
    const colors = ['#f3ce5e', '#f8df84', '#e7a935', '#fff0b0'];

    for (let index = 0; index < 28; index += 1) {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = Math.random() > .16 ? '♥' : '♡';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.setProperty('--heart-size', `${10 + Math.random() * 22}px`);
        heart.style.setProperty('--heart-time', `${7 + Math.random() * 8}s`);
        heart.style.setProperty('--heart-delay', `${Math.random() * -14}s`);
        heart.style.setProperty('--heart-drift', `${-80 + Math.random() * 160}px`);
        heart.style.setProperty('--heart-color', colors[index % colors.length]);
        hearts.append(heart);
    }
}

function createStars() {
    const colors = ['#fff7cf', '#f3ce5e', '#c9dcff', '#ffffff'];

    for (let index = 0; index < 95; index += 1) {
        const star = document.createElement('span');
        star.className = `star ${index % 13 === 0 ? 'star--cross' : ''}`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty('--star-size', `${1 + Math.random() * (index % 5 === 0 ? 3.5 : 2)}px`);
        star.style.setProperty('--star-color', colors[index % colors.length]);
        star.style.setProperty('--star-opacity', `${.35 + Math.random() * .65}`);
        star.style.setProperty('--star-speed', `${2 + Math.random() * 5}s`);
        star.style.setProperty('--star-delay', `${Math.random() * -6}s`);
        document.getElementById(index % 3 === 0 ? 'stars-far' : 'stars-near').append(star);
    }
}

function createHeartConstellation() {
    const points = [
        [25, 8], [48, 2], [70, 9], [14, 32], [37, 28], [59, 29], [82, 34],
        [25, 56], [48, 52], [71, 58], [37, 82], [60, 84],
    ];

    points.forEach(([left, top], index) => {
        const heart = document.createElement('span');
        heart.className = 'heart-star';
        heart.textContent = index % 4 === 0 ? '♡' : '♥';
        heart.style.left = `${left}%`;
        heart.style.top = `${top}%`;
        heart.style.setProperty('--heart-star-size', `${11 + (index % 4) * 3}px`);
        heart.style.setProperty('--heart-star-delay', `${index * -.35}s`);
        heart.style.setProperty('--line-angle', `${20 + index * 9}deg`);
        document.getElementById('heart-constellation').append(heart);
    });
}

function createMoment(item, index) {
    const isMobile = window.innerWidth <= 760;
    const column = index % 2;
    const row = Math.floor(index / 2);
    const top = isMobile ? `${140 + row * 190}px` : `${16 + row * 36}%`;
    const left = isMobile ? (column ? 54 : 4) : (column ? 76 : 57);
    const isMedia = Boolean(item.src);
    const card = document.createElement('article');
    card.className = `moment ${isMedia ? 'moment--media' : 'moment--message'}`;
    card.style.setProperty('--moment-top', top);
    card.style.setProperty('--moment-left', `${left}%`);
    card.style.setProperty('--moment-rotate', `${-6 + (index % 4) * 4}deg`);
    card.style.setProperty('--moment-delay', `${index * 1.2}s`);

    if (item.src && (item.type === 'image' || item.type === 'video')) {
        card.dataset.media = item.type;
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Abrir ${item.type === 'video' ? 'video' : 'fotografía'}`);
        const media = document.createElement(item.type === 'video' ? 'video' : 'img');
        media.className = item.type === 'video' ? 'moment-video' : 'moment-photo';
        media.src = item.src;
        media.alt = item.text || 'Un recuerdo especial';
        if (item.type === 'video') {
            media.controls = true;
            media.autoplay = true;
            media.muted = true;
            media.loop = true;
            media.playsInline = true;
            media.preload = 'metadata';
        }
        card.append(media);
        if (item.type === 'video') media.play().catch(() => undefined);
        card.addEventListener('click', () => openMediaViewer(item));
        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openMediaViewer(item);
            }
        });
    }

    const message = document.createElement('p');
    message.className = 'moment-message';
    message.textContent = item.text;
    card.append(message);

    if (item.label) {
        const label = document.createElement('span');
        label.className = 'moment-label';
        label.textContent = item.label;
        card.append(label);
    }

    moments.append(card);
}

function renderMoments() {
    const items = [];
    const media = [...CONFIG.media].sort((first, second) => Number(second.type === 'video') - Number(first.type === 'video'));
    const itemCount = Math.max(CONFIG.messages.length, media.length);
    for (let index = 0; index < itemCount; index += 1) {
        if (media[index]) items.push(media[index]);
        if (CONFIG.messages[index]) items.push(CONFIG.messages[index]);
    }
    items.forEach(createMoment);
    if (window.innerWidth <= 760) {
        const rows = Math.ceil(items.length / 2);
        const gardenHeight = Math.max(900, 220 + rows * 190);
        garden.style.height = `${gardenHeight}px`;
        garden.style.minHeight = `${gardenHeight}px`;
    }
}

function configureMusic() {
    if (!CONFIG.song.src) {
        musicToggle.hidden = true;
        return;
    }

    song.src = CONFIG.song.src;
    song.autoplay = true;
    song.muted = true;
    song.volume = .45;
    musicToggle.addEventListener('click', toggleMusic);
    song.play().then(() => musicToggle.classList.add('is-playing')).catch(() => undefined);
    document.addEventListener('pointerdown', () => {
        song.muted = false;
        if (song.paused) song.play().then(() => musicToggle.classList.add('is-playing')).catch(() => undefined);
    }, { passive: true });
}

function toggleMusic() {
    if (song.paused) {
        song.muted = false;
        song.play().then(() => musicToggle.classList.add('is-playing')).catch(() => undefined);
        return;
    }

    song.pause();
    musicToggle.classList.remove('is-playing');
}

startButton.addEventListener('click', () => {
    document.body.classList.add('started');
    startButton.textContent = 'Nuestros recuerdos  ♥';
    finalMessage.textContent = CONFIG.sender
        ? `En cualquier universo, volvería a coincidir contigo. ♥\n— ${CONFIG.sender}`
        : 'En cualquier universo, volvería a coincidir contigo. ♥';
    finalMessage.classList.add('visible');

    const firstMemory = moments.querySelector('.moment[data-media="video"]') || moments.querySelector('.moment--media') || moments.querySelector('.moment');
    moments.classList.add('is-focused');
    window.setTimeout(() => moments.classList.remove('is-focused'), 2600);

    if (CONFIG.song.src) {
        song.muted = false;
        song.play().then(() => musicToggle.classList.add('is-playing')).catch(() => undefined);
    }

    const scrollToMemory = () => {
        firstMemory?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    };
    const scrollDelay = window.matchMedia('(max-width: 760px)').matches ? 900 : 0;
    window.setTimeout(scrollToMemory, scrollDelay);
});

song.addEventListener('pause', () => musicToggle.classList.remove('is-playing'));
song.addEventListener('ended', () => musicToggle.classList.remove('is-playing'));
document.getElementById('close-media-viewer').addEventListener('click', closeMediaViewer);
mediaViewer.addEventListener('click', event => {
    if (event.target === mediaViewer) closeMediaViewer();
});
mediaViewer.addEventListener('close', () => mediaViewerContent.replaceChildren());

createBotanicalGarden();
createStars();
createHeartConstellation();
createHearts();
renderMoments();
configureMusic();
window.addEventListener('pointermove', event => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const x = (event.clientX / window.innerWidth - .5) * 2;
    const y = (event.clientY / window.innerHeight - .5) * 2;
    garden.style.setProperty('--scene-turn', `${x * 2.2}deg`);
    garden.style.setProperty('--scene-tilt', `${y * -1.2}deg`);
});
window.addEventListener('load', () => document.body.classList.remove('container'));
