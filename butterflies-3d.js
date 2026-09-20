const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    import(THREE_URL).then(THREE => {
        const canvas = document.getElementById('butterfly-canvas');
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
        camera.position.z = 12;

        const butterflies = [];
        const palettes = [
            ['#28c9ff', '#1667d9', '#d4fbff'],
            ['#d15dff', '#6c26df', '#f5d4ff'],
            ['#ffd95c', '#e87920', '#fff7bd'],
            ['#65e4dc', '#278fba', '#d8ffff'],
            ['#ff8db6', '#ad3a96', '#ffe4f0'],
        ];

        function createWingTexture(palette) {
            const textureCanvas = document.createElement('canvas');
            textureCanvas.width = 256;
            textureCanvas.height = 300;
            const context = textureCanvas.getContext('2d');
            const gradient = context.createLinearGradient(35, 40, 220, 270);
            gradient.addColorStop(0, palette[2]);
            gradient.addColorStop(.18, palette[0]);
            gradient.addColorStop(.72, palette[1]);
            gradient.addColorStop(1, '#120c2c');

            context.clearRect(0, 0, 256, 300);
            context.beginPath();
            context.moveTo(128, 152);
            context.bezierCurveTo(79, 135, 20, 133, 16, 52);
            context.bezierCurveTo(14, 15, 73, 25, 112, 70);
            context.bezierCurveTo(137, 99, 142, 128, 128, 152);
            context.closePath();
            context.fillStyle = gradient;
            context.fill();
            context.strokeStyle = `${palette[2]}aa`;
            context.lineWidth = 3;
            context.stroke();

            context.globalAlpha = .7;
            context.strokeStyle = `${palette[2]}99`;
            context.lineWidth = 1.5;
            [[45, 55, 124, 143], [24, 103, 120, 148], [72, 28, 125, 142], [91, 92, 126, 149]].forEach(([fromX, fromY, toX, toY]) => {
                context.beginPath();
                context.moveTo(fromX, fromY);
                context.quadraticCurveTo((fromX + toX) / 2, fromY + 20, toX, toY);
                context.stroke();
            });

            [[52, 57, 13], [31, 100, 8], [75, 36, 6], [86, 88, 9]].forEach(([x, y, radius]) => {
                context.beginPath();
                context.arc(x, y, radius, 0, Math.PI * 2);
                context.fillStyle = `${palette[2]}cc`;
                context.fill();
            });
            context.globalAlpha = 1;

            const texture = new THREE.CanvasTexture(textureCanvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            return texture;
        }

        function createButterfly(index) {
            const palette = palettes[index % palettes.length];
            const group = new THREE.Group();
            const scale = .46 + (index % 4) * .13;
            const leftPivot = new THREE.Group();
            const rightPivot = new THREE.Group();
            const wingGeometry = new THREE.PlaneGeometry(1.35, 1.58);
            const material = new THREE.MeshBasicMaterial({
                map: createWingTexture(palette),
                transparent: true,
                opacity: .95,
                depthWrite: false,
                side: THREE.DoubleSide,
            });
            const leftWing = new THREE.Mesh(wingGeometry, material);
            const rightWing = new THREE.Mesh(wingGeometry, material);
            leftWing.position.x = -.56;
            rightWing.position.x = .56;
            leftWing.scale.x = -1;
            leftPivot.add(leftWing);
            rightPivot.add(rightWing);
            group.add(leftPivot, rightPivot);

            const body = new THREE.Mesh(
                new THREE.CapsuleGeometry(.055, .55, 4, 8),
                new THREE.MeshBasicMaterial({ color: '#16101e' }),
            );
            body.rotation.z = Math.PI / 2;
            group.add(body);

            const antennaMaterial = new THREE.LineBasicMaterial({ color: palette[2], transparent: true, opacity: .8 });
            const antennaGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-.02, .1, 0),
                new THREE.Vector3(-.18, .35, .05),
                new THREE.Vector3(-.32, .42, .02),
            ]);
            const leftAntenna = new THREE.Line(antennaGeometry, antennaMaterial);
            const rightAntenna = leftAntenna.clone();
            rightAntenna.scale.x = -1;
            group.add(leftAntenna, rightAntenna);

            const angle = (index / 8) * Math.PI * 2;
            const butterfly = {
                group,
                leftPivot,
                rightPivot,
                phase: index * 1.83,
                speed: .35 + (index % 3) * .08,
                flap: 8 + (index % 4) * 1.4,
                baseX: Math.cos(angle) * (3.4 + (index % 2) * 1.4),
                baseY: Math.sin(angle * 1.7) * 2.4,
                baseZ: -1.5 - (index % 5) * .72,
                scale,
            };
            group.scale.setScalar(scale);
            group.position.set(butterfly.baseX, butterfly.baseY, butterfly.baseZ);
            scene.add(group);
            butterflies.push(butterfly);
        }

        for (let index = 0; index < 12; index += 1) createButterfly(index);

        function resize() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        }

        const clock = new THREE.Clock();
        function animate() {
            const elapsed = clock.getElapsedTime();
            butterflies.forEach(butterfly => {
                const drift = elapsed * butterfly.speed + butterfly.phase;
                butterfly.group.position.x = butterfly.baseX + Math.sin(drift) * .8 + Math.sin(drift * .43) * .35;
                butterfly.group.position.y = butterfly.baseY + Math.cos(drift * .8) * .55 + Math.sin(drift * .31) * .3;
                butterfly.group.position.z = butterfly.baseZ + Math.sin(drift * .57) * .4;
                butterfly.group.rotation.z = Math.sin(drift * .8) * .15;
                butterfly.group.rotation.y = Math.cos(drift * .52) * .18;
                const wingAngle = .25 + (Math.sin(elapsed * butterfly.flap + butterfly.phase) + 1) * .58;
                butterfly.leftPivot.rotation.y = wingAngle;
                butterfly.rightPivot.rotation.y = -wingAngle;
            });
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        resize();
        window.addEventListener('resize', resize, { passive: true });
        document.body.classList.add('butterflies-3d-ready');
        animate();
    }).catch(() => {
        document.getElementById('butterfly-canvas')?.remove();
    });
}
