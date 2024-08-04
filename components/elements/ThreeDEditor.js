import useMiddleware from '@/app/services/contextMiddleware';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeDEditor = ({ modelUrl, setRenderer,meshColors,setMeshColors }) => {
    
    const mountRef = useRef(null);
    const modelRef = useRef();  // Reference to store the loaded model for rotation
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const resetTimeout = useRef(null);  // Reference for the timeout
    const [meshList, setMeshList] = useState([]);
    const [originalColors, setOriginalColors] = useState({});
    const { colorScales, interpolateColors, scaleToGradient, } = useMiddleware();
    
    useEffect(() => {
        const currentMount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        const initialCameraPosition = new THREE.Vector3(1.12279572297596, 0.8536284682975395, -0.6378972487935892);
        const initialTarget = new THREE.Vector3(-0.1524600900224049, 0.4476697088807893, 0.07010403358594752);

        camera.position.copy(initialCameraPosition);  // Apply initial position immediately

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        if (setRenderer) {
            setRenderer(renderer);
        }
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setClearColor(0x000000, 0);

        currentMount.appendChild(renderer.domElement);
        const ambientLight = new THREE.AmbientLight(0x404040, 100);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 1);
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(10, 20, 20);
        scene.add(ambientLight, directionalLight, pointLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.copy(initialTarget); // Apply initial target immediately

        controls.addEventListener('start', () => {
            clearTimeout(resetTimeout.current);  // Clear the existing timeout when user starts interacting
        });

        controls.addEventListener('end', () => {
            resetTimeout.current = setTimeout(() => {
                // Use lerp to create a smooth transition back to the original position
                const interval = setInterval(() => {
                    camera.position.lerp(initialCameraPosition, 0.02);
                    controls.target.lerp(initialTarget, 0.02);
                    controls.update();
                    
                    // Check if the position is close enough to the initial position to stop the interval
                    if (camera.position.distanceTo(initialCameraPosition) < 0.01) {
                        clearInterval(interval);
                    }
                }, 16); // Run at roughly 60 fps
            }, 2000);  // Start moving back 2 seconds after interaction ends
        });

        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf) => {
            modelRef.current = gltf.scene; 
            scene.add(gltf.scene);
            const meshes = [];
            const originalColors = {}; // Initialize the original colors storage object
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    meshes.push({ name: child.name, mesh: child });
        
                    // Save the original color of the mesh
                    if (child.material && child.material.color) {
                        originalColors[child.name] = child.material.color.clone();
                    }
        
                    // Change the mesh color if specified in meshColors
                    if (meshColors[child.name]) {
                        const newMaterial = child.material.clone();
                        newMaterial.color.set(meshColors[child.name]);
                        child.material = newMaterial;
                    }
                }
            });
            gltf.scene.scale.set(0.7, 0.7, 0.7);

            setMeshList(meshes);
            setOriginalColors(originalColors); // Update this to use the originalColors object
            const box = new THREE.Box3().setFromObject(gltf.scene);
            gltf.scene.position.y = -box.min.y;
            setIsModelLoaded(true);
        });

        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);

        const animate = () => {
            requestAnimationFrame(animate);
            if (modelRef.current) {
                modelRef.current.rotation.y += 0.002;  // Rotate the model
            }
            controls.update();
            renderer.render(scene, camera);
        };

        animate();
        const resizeObserver = new ResizeObserver(() => {
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
        });
        resizeObserver.observe(currentMount);

        return () => {
            clearTimeout(resetTimeout.current);
            resizeObserver.disconnect();
            currentMount.removeChild(renderer.domElement);
            controls.dispose();
        };
    }, [modelUrl, isModelLoaded]);

    const shuffleColors = (colors) => {
        const scale = interpolateColors(colors, 10); // 10 steps between each pair in the scale
        const newColors = {};
        // alert(JSON.stringify(meshList))
        meshList.forEach(({ name, mesh }) => {
            const randomColor = scale[Math.floor(Math.random() * scale.length)];
            newColors[name] = randomColor;
            const newMaterial = mesh.material.clone();  // Clone the existing material
            newMaterial.color.set(randomColor);            // Set the new color on the cloned material
            mesh.material = newMaterial;  
        });
        setMeshColors(newColors);
    };
    const ClearColors = () => {
        meshList.forEach(({ name, mesh }) => {
            const newMaterial = mesh.material.clone();  // Clone the existing material
            newMaterial.color.set(originalColors[name] );            // Set the new color on the cloned material
            mesh.material = newMaterial;  
        });
        setMeshColors(originalColors);
    };
    
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
            
            <div style={{
                position: 'absolute',
                left: '0%',
                top: '5%',
                bottom: '5%',
                width: '150px',
                overflowY: 'auto',
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none'  /* IE 10+ */
            }}>     
                    <div  style={{
                }} onClick={() => ClearColors()}>
                     <div  style={{ display: 'flex', alignItems: 'center', padding: '10px', position: 'relative' }}>
                     <div
                            style={{ border: "1px dashed white", width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                            
                        ></div>
                    </div></div>
            
                   {Object.entries(colorScales).map(([key, colors], index) => (
                <div key={"key17_"+key} style={{
                }} onClick={() => shuffleColors(colors)}>
                     <div key={"key18_"+index} style={{ display: 'flex', alignItems: 'center', padding: '10px', position: 'relative' }}>
                     <div
                            style={{ border: "1px dashed white", width: '34px', height: '34px', borderRadius: '50%', background: scaleToGradient(colors)|| '#fff', cursor: 'pointer' }}
                            
                        ></div>
                    </div></div>
            ))}
                 
            </div>

        </div>
    );};

export default ThreeDEditor;
