import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeDCharacter = ({ modelUrl,initialYRotation = 0 }) => {
    const mountRef = useRef(null);
    const animationFrameId = useRef(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const resetTimeout = useRef(null);
    const movementInterval = useRef(null);
    const initialCameraPosition = useRef(new THREE.Vector3(1.12279572297596, 0.8536284682975395, -0.6378972487935892));
    const initialTarget = useRef(new THREE.Vector3(-0.1524600900224049, 0.4476697088807893, 0.07010403358594752));
    const targetCameraPosition = useRef(initialCameraPosition.current.clone());
    const targetTarget = useRef(initialTarget.current.clone());

    useEffect(() => {
        if (modelUrl) {
            const currentMount = mountRef.current;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
            camera.position.copy(initialCameraPosition.current);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            renderer.setClearColor(0x000000, 0);

            const ambientLight = new THREE.AmbientLight(0x404040, 100);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(0, 1, 1);
            const pointLight = new THREE.PointLight(0xffffff, 1, 100);
            pointLight.position.set(10, 20, 20);
            scene.add(ambientLight, directionalLight, pointLight);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.target.copy(initialTarget.current);

            controls.addEventListener('start', () => {
                clearTimeout(resetTimeout.current);
                clearInterval(movementInterval.current);
            });

            controls.addEventListener('end', () => {
                resetTimeout.current = setTimeout(() => {
                    targetCameraPosition.current.copy(camera.position);
                    targetTarget.current.copy(controls.target);
                    movementInterval.current = setInterval(moveCamera, 6000);
                }, 2000);
            });

            const loader = new GLTFLoader();
            loader.load(modelUrl, (gltf) => {
                scene.add(gltf.scene);
                const scaleFactor = 0.8;
                gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

                const box = new THREE.Box3().setFromObject(gltf.scene);
                gltf.scene.position.y = -box.min.y;

                const initialYRotationRadians = (initialYRotation * Math.PI) / 180;
                gltf.scene.rotation.y = initialYRotationRadians;

                setIsModelLoaded(true);
            });

            const gridHelper = new THREE.GridHelper(10, 10);
            scene.add(gridHelper);

            const randomMovement = (base, range) => base + (Math.random() - 0.5) * range;

            const moveCamera = () => {
                targetCameraPosition.current.x = randomMovement(initialCameraPosition.current.x, 1);
                targetCameraPosition.current.y = randomMovement(initialCameraPosition.current.y, 1);
                targetCameraPosition.current.z = randomMovement(initialCameraPosition.current.z, 1);
            };

            const animate = () => {
                camera.position.lerp(targetCameraPosition.current, 0.01);
                controls.target.lerp(targetTarget.current, 0.01);
                controls.update();
                renderer.render(scene, camera);
                animationFrameId.current = requestAnimationFrame(animate);
            };

            movementInterval.current = setInterval(moveCamera, 6000);
            animate();

            const resizeObserver = new ResizeObserver(() => {
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
                camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                camera.updateProjectionMatrix();
            });
            resizeObserver.observe(currentMount);

            const handleContextLost = (event) => {
                event.preventDefault();
            };

            renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
            currentMount.appendChild(renderer.domElement);

            return () => {
                clearTimeout(resetTimeout.current);
                clearInterval(movementInterval.current);
                resizeObserver.disconnect();
                if (currentMount.contains(renderer.domElement)) {
                    currentMount.removeChild(renderer.domElement);
                }
                controls.dispose();
                renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
                if (animationFrameId.current) {
                    cancelAnimationFrame(animationFrameId.current);
                }
                setTimeout(() => {
                    const gl = renderer.getContext();
                    const loseContextExtension = gl.getExtension('WEBGL_lose_context');
                    if (loseContextExtension) {
                        loseContextExtension.loseContext();
                    }
                }, 100);
                if (currentMount.contains(renderer.domElement)) {
                    currentMount.removeChild(renderer.domElement);
                }
            };
        }
    }, [modelUrl, isModelLoaded]);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default ThreeDCharacter;
