/* Target Wave - UI & 3D Logic */
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

document.addEventListener('DOMContentLoaded', () => {
    init3DBackground();
    initScrollReveal();
    initMobileMenu();
});

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('#mobile-menu');
    const body = document.body;

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });
}

// Preloader Dismissal
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 800);
    }
});

function init3DBackground() {
    const canvas = document.querySelector('#bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Antigravity Core - Icosahedron Wireframe
    const coreGeometry = new THREE.IcosahedronGeometry(1.5, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFD700,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Inner Solid Core (Glow effect)
    const innerGeometry = new THREE.IcosahedronGeometry(1.4, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFD700,
        transparent: true,
        opacity: 0.05
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // Orbital Particles
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 8;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.008,
        color: 0xFFD700,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 4;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        const elapsedTime = clock.getElapsedTime();

        // Dynamic Rotations
        coreMesh.rotation.y = elapsedTime * 0.15;
        coreMesh.rotation.x = elapsedTime * 0.1;
        innerMesh.rotation.y = -elapsedTime * 0.1;

        particlesMesh.rotation.y = -elapsedTime * 0.05;

        // Mouse Follow
        scene.rotation.y += (mouseX * 0.3 - scene.rotation.y) * 0.05;
        scene.rotation.x += (mouseY * 0.3 - scene.rotation.x) * 0.05;

        // Pulse effect
        const s = 1 + Math.sin(elapsedTime * 0.5) * 0.05;
        coreMesh.scale.set(s, s, s);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .reveal-on-scroll').forEach(el => observer.observe(el));
}
