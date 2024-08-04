import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;
    let frameId;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Load GLTF model
    const loader = new GLTFLoader();
    loader.load('/assets/3dmodels/roboto/scene.gltf', function (gltf) {
      scene.add(gltf.scene);
    });

    // Camera position
    camera.position.z = 5;

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        console.log('Mesh clicked:', intersects[0].object);
        // You can perform actions with the clicked mesh here
      }
    };

    window.addEventListener('click', onClick);

    // Rendering loop
    const renderScene = () => {
      frameId = window.requestAnimationFrame(renderScene);
      renderer.render(scene, camera);
    };

    renderScene();

    // Cleanup
    return () => {
      window.removeEventListener('click', onClick);
      window.cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default ThreeScene;
