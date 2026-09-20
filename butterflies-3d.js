const butterflyLayer = document.getElementById('butterflies');
const butterflyCanvas = document.getElementById('butterfly-canvas');

if (butterflyLayer) {
    butterflyCanvas?.remove();
    butterflyLayer.replaceChildren();
    document.body.append(butterflyLayer);
    butterflyLayer.classList.add('butterflies--gif');

    const profiles = [
        { source: 'media/cardinal-clean.gif', kind: 'cardinal', y: 14, size: .72, depth: 90, duration: 18, delay: -3, rotate: -8 },
        { source: 'media/butterfly-gold-clean.gif', kind: 'gold', y: 31, size: .55, depth: 40, duration: 23, delay: -12, rotate: 12 },
        { source: 'media/cardinal-clean.gif', kind: 'cardinal', y: 9, size: .96, depth: 140, duration: 26, delay: -8, rotate: -5 },
        { source: 'media/butterfly-gold-clean.gif', kind: 'gold', y: 24, size: .68, depth: 55, duration: 21, delay: -17, rotate: 9 },
        { source: 'media/cardinal-clean.gif', kind: 'cardinal', y: 12, size: .5, depth: 170, duration: 19, delay: -7, rotate: -12 },
        { source: 'media/butterfly-gold-clean.gif', kind: 'gold', y: 48, size: .82, depth: 75, duration: 24, delay: -14, rotate: 7 },
        { source: 'media/cardinal-clean.gif', kind: 'cardinal', y: 68, size: .43, depth: 25, duration: 20, delay: -5, rotate: -11 },
        { source: 'media/butterfly-gold-clean.gif', kind: 'gold', y: 73, size: .62, depth: 115, duration: 27, delay: -19, rotate: 5 },
        { source: 'media/cardinal-clean.gif', kind: 'cardinal', y: 79, size: .56, depth: 45, duration: 22, delay: -10, rotate: -6 },
        { source: 'media/butterfly-gold-clean.gif', kind: 'gold', y: 86, size: .48, depth: 130, duration: 25, delay: -22, rotate: 10 },
        { source: 'media/butterfly-verita-clean.gif', kind: 'silver', y: 48, size: .52, depth: 60, duration: 24, delay: -16, rotate: 8 },
        { source: 'media/butterfly-morpho-clean.gif', kind: 'morpho', y: 58, size: .76, depth: 155, duration: 28, delay: -6, rotate: -9 },
        { source: 'media/butterfly-white-clean.gif', kind: 'white', y: 65, size: .44, depth: 35, duration: 19, delay: -20, rotate: 13 },
        { source: 'media/butterfly-morpho-clean.gif', kind: 'morpho', y: 30, size: .48, depth: 100, duration: 23, delay: -9, rotate: -4 },
    ];

    profiles.forEach(profile => {
        const wrapper = document.createElement('span');
        wrapper.className = `butterfly-gif butterfly-gif--${profile.kind}`;
        wrapper.style.left = '-24%';
        wrapper.style.top = `${profile.y}%`;
        wrapper.style.setProperty('--gif-size', profile.size);
        wrapper.style.setProperty('--gif-depth', `${profile.depth}px`);
        wrapper.style.setProperty('--gif-duration', `${profile.duration}s`);
        wrapper.style.setProperty('--gif-delay', `${profile.delay}s`);
        wrapper.style.setProperty('--gif-rotate', `${profile.rotate}deg`);

        const image = document.createElement('img');
        image.src = encodeURI(profile.source);
        image.alt = '';
        image.loading = 'eager';
        image.draggable = false;
        wrapper.append(image);
        butterflyLayer.append(wrapper);
    });

    document.body.classList.add('butterflies-gif-ready');
}
