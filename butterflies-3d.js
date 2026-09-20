const butterflyLayer = document.getElementById('butterflies');
const butterflyCanvas = document.getElementById('butterfly-canvas');

if (butterflyLayer) {
    butterflyCanvas?.remove();
    butterflyLayer.replaceChildren();
    document.body.append(butterflyLayer);
    butterflyLayer.classList.add('butterflies--gif');

    const profiles = [
        { source: 'media/butterfly-gold-clean.gif', kind: 'gold', y: 31, size: .55, depth: 40, duration: 72, delay: -18, rotate: 12 },
        { source: 'media/butterfly-gold-clean.gif', kind: 'gold', y: 24, size: .68, depth: 55, duration: 84, delay: -42, rotate: 9 },
        { source: 'media/butterfly-gold-clean.gif', kind: 'gold', y: 48, size: .82, depth: 75, duration: 78, delay: -28, rotate: 7 },
        { source: 'media/butterfly-gold-clean.gif', kind: 'gold', y: 73, size: .62, depth: 115, duration: 90, delay: -55, rotate: 5 },
        { source: 'media/butterfly-gold-clean.gif', kind: 'gold', y: 86, size: .48, depth: 130, duration: 74, delay: -36, rotate: 10 },
        { source: 'media/butterfly-verita-clean.gif', kind: 'silver', y: 43, size: .52, depth: 60, duration: 82, delay: -47, rotate: 8 },
        { source: 'media/butterfly-0051-clean.gif', kind: 'amber', y: 58, size: .48, depth: 95, duration: 88, delay: -24, rotate: -6 },
        { source: 'media/butterfly-0115-clean.gif', kind: 'tiny', y: 20, size: .38, depth: 155, duration: 68, delay: -31, rotate: 4 },
        { source: 'media/butterfly-morpho-clean.gif', kind: 'morpho', static: true, x: 7, y: 13, size: .42, depth: 145, delay: .1, rotate: -3 },
        { source: 'media/butterfly-morpho-clean.gif', kind: 'morpho', static: true, x: 28, y: 42, size: .56, depth: 115, delay: .8, rotate: 5 },
        { source: 'media/butterfly-morpho-clean.gif', kind: 'morpho', static: true, x: 54, y: 18, size: .38, depth: 175, delay: 1.5, rotate: -7 },
        { source: 'media/butterfly-morpho-clean.gif', kind: 'morpho', static: true, x: 70, y: 57, size: .5, depth: 100, delay: 2.2, rotate: 4 },
        { source: 'media/butterfly-morpho-clean.gif', kind: 'morpho', static: true, x: 88, y: 29, size: .34, depth: 160, delay: 2.9, rotate: -4 },
        { source: 'media/butterfly-white-clean.gif', kind: 'white', static: true, x: 86, y: 78, size: .46, depth: 35, delay: 1.2, rotate: 13 },
    ];

    profiles.forEach(profile => {
        const wrapper = document.createElement('span');
        wrapper.className = `butterfly-gif butterfly-gif--${profile.kind}${profile.static ? ' butterfly-gif--static' : ''}`;
        wrapper.style.left = profile.static ? `${profile.x}%` : '-24%';
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
