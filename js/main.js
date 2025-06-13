import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';

class Banner3D {
    constructor() {
        this.container = document.getElementById('banner-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.clock = new THREE.Clock();
        this.particles = [];
        
        // Mouse interaction
        this.mouse = new THREE.Vector2();
        this.mousePosition = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster();
        this.mouseInteractionEnabled = true;
        this.interactionStrength = 0.5;
        this.interactionRadius = 2;
        
        // Settings
        this.settings = {
            particleCount: 1000,
            rotationSpeed: 0.1,
            movementSpeed: 1.0,
            particleSize: 0.05,
            systemSize: 10,
            particleColor: '#ffffff',
            backgroundColor: '#000000',
            accentColor: '#ff00ff',
            interactionStrength: 0.5,
            interactionRadius: 2
        };

        // Presets
        this.presets = {
            cosmic: {
                particleCount: 2000,
                rotationSpeed: 0.15,
                movementSpeed: 0.8,
                particleSize: 0.03,
                systemSize: 15,
                particleColor: '#ffffff',
                backgroundColor: '#000000',
                accentColor: '#00ffff',
                interactionStrength: 0.5,
                interactionRadius: 2
            },
            fire: {
                particleCount: 1500,
                rotationSpeed: 0.2,
                movementSpeed: 1.2,
                particleSize: 0.06,
                systemSize: 12,
                particleColor: '#ff4400',
                backgroundColor: '#1a0000',
                accentColor: '#ff8800',
                interactionStrength: 0.7,
                interactionRadius: 2.5
            },
            ocean: {
                particleCount: 1800,
                rotationSpeed: 0.08,
                movementSpeed: 0.6,
                particleSize: 0.04,
                systemSize: 14,
                particleColor: '#00aaff',
                backgroundColor: '#001a33',
                accentColor: '#00ffaa',
                interactionStrength: 0.4,
                interactionRadius: 1.8
            },
            forest: {
                particleCount: 1200,
                rotationSpeed: 0.12,
                movementSpeed: 0.9,
                particleSize: 0.05,
                systemSize: 13,
                particleColor: '#00ff00',
                backgroundColor: '#001a00',
                accentColor: '#88ff00',
                interactionStrength: 0.6,
                interactionRadius: 2.2
            }
        };
        
        this.init();
        this.createParticles();
        this.setupSettings();
        this.setupMouseInteraction();
        this.animate();
        this.handleResize();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.z = 5;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);

        // Add controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = false;
    }

    setupMouseInteraction() {
        // Mouse move event
        this.container.addEventListener('mousemove', (event) => {
            // Calculate mouse position in normalized device coordinates
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Update raycaster
            this.raycaster.setFromCamera(this.mouse, this.camera);

            // Calculate mouse position in 3D space
            const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
            vector.unproject(this.camera);
            const dir = vector.sub(this.camera.position).normalize();
            const distance = -this.camera.position.z / dir.z;
            this.mousePosition.copy(this.camera.position).add(dir.multiplyScalar(distance));
        });

        // Mouse leave event
        this.container.addEventListener('mouseleave', () => {
            this.mouseInteractionEnabled = false;
        });

        // Mouse enter event
        this.container.addEventListener('mouseenter', () => {
            this.mouseInteractionEnabled = true;
        });
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.settings.particleCount * 3);
        const colors = new Float32Array(this.settings.particleCount * 3);
        const originalPositions = new Float32Array(this.settings.particleCount * 3);

        for (let i = 0; i < this.settings.particleCount; i++) {
            // Position
            const x = (Math.random() - 0.5) * this.settings.systemSize;
            const y = (Math.random() - 0.5) * this.settings.systemSize;
            const z = (Math.random() - 0.5) * this.settings.systemSize;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            originalPositions[i * 3] = x;
            originalPositions[i * 3 + 1] = y;
            originalPositions[i * 3 + 2] = z;

            // Color
            const color = new THREE.Color(this.settings.particleColor);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('originalPosition', new THREE.BufferAttribute(originalPositions, 3));

        const material = new THREE.PointsMaterial({
            size: this.settings.particleSize,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    setupSettings() {
        // Toggle settings panel
        const settingsToggle = document.querySelector('.settings-toggle');
        const settingsContent = document.querySelector('.settings-content');
        
        settingsToggle.addEventListener('click', () => {
            settingsContent.classList.toggle('active');
        });

        // Update color previews
        const updateColorPreview = (inputId, previewId) => {
            const input = document.getElementById(inputId);
            const preview = document.getElementById(previewId);
            preview.style.backgroundColor = input.value;
        };

        // Initialize color previews
        updateColorPreview('particleColor', 'particleColorPreview');
        updateColorPreview('backgroundColor', 'backgroundColorPreview');
        updateColorPreview('accentColor', 'accentColorPreview');

        // Particle Count
        const particleCountInput = document.getElementById('particleCount');
        const particleCountDisplay = particleCountInput.nextElementSibling;
        
        particleCountInput.addEventListener('input', (e) => {
            this.settings.particleCount = parseInt(e.target.value);
            particleCountDisplay.textContent = this.settings.particleCount;
            this.updateParticleSystem();
        });

        // Rotation Speed
        const rotationSpeedInput = document.getElementById('rotationSpeed');
        const rotationSpeedDisplay = rotationSpeedInput.nextElementSibling;
        
        rotationSpeedInput.addEventListener('input', (e) => {
            this.settings.rotationSpeed = parseFloat(e.target.value);
            rotationSpeedDisplay.textContent = this.settings.rotationSpeed.toFixed(2);
        });

        // Movement Speed
        const movementSpeedInput = document.getElementById('movementSpeed');
        const movementSpeedDisplay = movementSpeedInput.nextElementSibling;
        
        movementSpeedInput.addEventListener('input', (e) => {
            this.settings.movementSpeed = parseFloat(e.target.value);
            movementSpeedDisplay.textContent = this.settings.movementSpeed.toFixed(1);
        });

        // Particle Size
        const particleSizeInput = document.getElementById('particleSize');
        const particleSizeDisplay = particleSizeInput.nextElementSibling;
        
        particleSizeInput.addEventListener('input', (e) => {
            this.settings.particleSize = parseFloat(e.target.value);
            particleSizeDisplay.textContent = this.settings.particleSize.toFixed(2);
            if (this.particleSystem) {
                this.particleSystem.material.size = this.settings.particleSize;
            }
        });

        // System Size
        const systemSizeInput = document.getElementById('systemSize');
        const systemSizeDisplay = systemSizeInput.nextElementSibling;
        
        systemSizeInput.addEventListener('input', (e) => {
            this.settings.systemSize = parseFloat(e.target.value);
            systemSizeDisplay.textContent = this.settings.systemSize.toFixed(1);
            this.updateParticleSystem();
        });

        // Color Controls
        const colorInputs = ['particleColor', 'backgroundColor', 'accentColor'];
        colorInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            input.addEventListener('input', (e) => {
                this.settings[inputId] = e.target.value;
                updateColorPreview(inputId, `${inputId}Preview`);
                
                if (inputId === 'backgroundColor') {
                    document.body.style.backgroundColor = e.target.value;
                } else if (inputId === 'particleColor') {
                    this.updateParticleSystem();
                }
            });
        });

        // Preset Buttons
        const presetButtons = document.querySelectorAll('.preset-button');
        presetButtons.forEach(button => {
            button.addEventListener('click', () => {
                const preset = this.presets[button.dataset.preset];
                if (preset) {
                    this.applyPreset(preset);
                }
            });
        });

        // Add interaction controls
        const interactionGroup = document.createElement('div');
        interactionGroup.className = 'control-group';
        interactionGroup.innerHTML = `
            <label for="interactionStrength">Interaction Strength</label>
            <input type="range" id="interactionStrength" min="0" max="2" value="0.5" step="0.1">
            <div class="value-display">0.5</div>
            <label for="interactionRadius">Interaction Radius</label>
            <input type="range" id="interactionRadius" min="0.5" max="5" value="2" step="0.1">
            <div class="value-display">2.0</div>
        `;
        settingsContent.appendChild(interactionGroup);

        // Add event listeners for interaction controls
        document.getElementById('interactionStrength').addEventListener('input', (e) => {
            this.settings.interactionStrength = parseFloat(e.target.value);
            e.target.nextElementSibling.textContent = this.settings.interactionStrength.toFixed(1);
        });

        document.getElementById('interactionRadius').addEventListener('input', (e) => {
            this.settings.interactionRadius = parseFloat(e.target.value);
            e.target.nextElementSibling.textContent = this.settings.interactionRadius.toFixed(1);
        });
    }

    applyPreset(preset) {
        // Update settings
        Object.assign(this.settings, preset);

        // Update UI
        document.getElementById('particleCount').value = preset.particleCount;
        document.getElementById('rotationSpeed').value = preset.rotationSpeed;
        document.getElementById('movementSpeed').value = preset.movementSpeed;
        document.getElementById('particleSize').value = preset.particleSize;
        document.getElementById('systemSize').value = preset.systemSize;
        document.getElementById('particleColor').value = preset.particleColor;
        document.getElementById('backgroundColor').value = preset.backgroundColor;
        document.getElementById('accentColor').value = preset.accentColor;

        // Update displays
        document.querySelectorAll('.value-display').forEach(display => {
            const input = display.previousElementSibling;
            if (input.type === 'range') {
                display.textContent = parseFloat(input.value).toFixed(2);
            }
        });

        // Update color previews
        ['particleColor', 'backgroundColor', 'accentColor'].forEach(colorId => {
            const preview = document.getElementById(`${colorId}Preview`);
            preview.style.backgroundColor = preset[colorId];
        });

        // Update background
        document.body.style.backgroundColor = preset.backgroundColor;

        // Update particle system
        this.updateParticleSystem();
    }

    updateParticleSystem() {
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
        }
        this.createParticles();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const elapsedTime = this.clock.getElapsedTime();

        if (this.particleSystem) {
            // Rotate particle system
            this.particleSystem.rotation.x = elapsedTime * this.settings.rotationSpeed;
            this.particleSystem.rotation.y = elapsedTime * this.settings.rotationSpeed * 1.5;

            // Get positions and original positions
            const positions = this.particleSystem.geometry.attributes.position.array;
            const originalPositions = this.particleSystem.geometry.attributes.originalPosition.array;

            // Update each particle
            for (let i = 0; i < positions.length; i += 3) {
                const particlePosition = new THREE.Vector3(
                    positions[i],
                    positions[i + 1],
                    positions[i + 2]
                );

                // Calculate distance to mouse
                const distanceToMouse = particlePosition.distanceTo(this.mousePosition);

                // Apply mouse interaction
                if (this.mouseInteractionEnabled && distanceToMouse < this.settings.interactionRadius) {
                    const force = (1 - distanceToMouse / this.settings.interactionRadius) * this.settings.interactionStrength;
                    const direction = new THREE.Vector3()
                        .subVectors(particlePosition, this.mousePosition)
                        .normalize()
                        .multiplyScalar(force);

                    positions[i] += direction.x;
                    positions[i + 1] += direction.y;
                    positions[i + 2] += direction.z;
                } else {
                    // Return to original position
                    const returnSpeed = 0.1;
                    positions[i] += (originalPositions[i] - positions[i]) * returnSpeed;
                    positions[i + 1] += (originalPositions[i + 1] - positions[i + 1]) * returnSpeed;
                    positions[i + 2] += (originalPositions[i + 2] - positions[i + 2]) * returnSpeed;
                }

                // Add wave motion
                positions[i + 1] += Math.sin(elapsedTime * this.settings.movementSpeed + i) * 0.001;
            }

            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }

        // Update controls
        this.controls.update();

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            // Update camera
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            // Update renderer
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }
}

// Initialize the banner
new Banner3D(); 