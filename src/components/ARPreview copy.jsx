// src/components/ARPreview.jsx  
import React, { useEffect } from 'react';  
import { useParams } from 'react-router-dom';  
import * as THREE from 'three'; // Import Three.js from the installed package  
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';  
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';  
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';  
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';  
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';  
  
const ARPreview = () => {  
    const { id } = useParams(); // Get the model ID from the URL  
    let container, camera, scene, renderer, controls, current_object, reticle, pmremGenerator, envmap;  
  
    useEffect(() => {  
        init();  
        animate();  
        if (id) {  
            loadModel(id);  
        } else {  
            console.error("No model ID provided in the URL.");  
        }  
  
        return () => {  
            // Cleanup on component unmount  
            if (renderer) {  
                renderer.dispose();  
            }  
        };  
    }, [id]);  
  
    const init = () => {  
        container = document.createElement('div');  
        document.getElementById("container").appendChild(container);  
  
        scene = new THREE.Scene();  
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 200);  
  
        const hemisphericLight = new THREE.HemisphereLight(0xffa500, 0x808080, 1);  
        scene.add(hemisphericLight);  
  
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });  
        renderer.setSize(window.innerWidth, window.innerHeight);  
        renderer.xr.enabled = true;  
        container.appendChild(renderer.domElement);  
  
        pmremGenerator = new THREE.PMREMGenerator(renderer);  
        pmremGenerator.compileEquirectangularShader();  
  
        controls = new OrbitControls(camera, renderer.domElement);  
        controls.enableDamping = true;  
        controls.dampingFactor = 0.05;  
  
        document.body.appendChild(VRButton.createButton(renderer));  
        document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));  
  
        // Change RingBufferGeometry to RingGeometry  
        reticle = new THREE.Mesh(  
            new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2), // Use RingGeometry here  
            new THREE.MeshBasicMaterial()  
        );  
        reticle.matrixAutoUpdate = false;  
        reticle.visible = false;  
        scene.add(reticle);  
  
        window.addEventListener('resize', onWindowResize, false);  
    };  
  
    const loadModel = (model) => {  
        // Commenting out the HDR loading for testing  
        // /*  
        // new RGBELoader()  
        //     .setDataType(THREE.UnsignedByteType)  
        //     .setPath('/textures/')  
        //     .load('photo_studio_01_1k.hdr', (texture) => {  
        //         envmap = pmremGenerator.fromEquirectangular(texture).texture;  
        //         scene.environment = envmap;  
        //         texture.dispose();  
        //         pmremGenerator.dispose();  
        // });  
        // */  
      
        const loader = new GLTFLoader().setPath('/3d/');  
        loader.load(`${model}.glb`, (glb) => {  
            current_object = glb.scene;  
            scene.add(current_object);  
            console.log(`Loaded model: ${model}.glb`); // Log when the model is loaded  
        }, undefined, (error) => {  
            console.error(`Error loading model: ${model}.glb`, error); // Log any errors  
        }); 
    };  
    
  
    const onWindowResize = () => {  
        camera.aspect = window.innerWidth / window.innerHeight;  
        camera.updateProjectionMatrix();  
        renderer.setSize(window.innerWidth, window.innerHeight);  
    };  
  
    const animate = () => {  
        renderer.setAnimationLoop(render);  
    };  
  
    const render = () => {  
        renderer.render(scene, camera);  
    };  
  
    return (  
        <div id="container" style={{ position: 'fixed', width: '100%', height: '100%' }} />  
    );  
};  
  
export default ARPreview;  
