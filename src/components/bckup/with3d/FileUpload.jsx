import React, { useState, useEffect, useRef } from 'react';  
import * as THREE from 'three';  
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';  
import './FileUpload.css'; // Import the CSS file for styling  
  
const FileUpload = () => {  
  const [file, setFile] = useState(null);  
  const [previewLink, setPreviewLink] = useState('');  
  const [copyButtonText, setCopyButtonText] = useState('Copy Link');  
  const canvasRef = useRef(null); // Reference for the canvas  
  
  const handleFileChange = (event) => {  
    setFile(event.target.files[0]);  
  };  
  
  const handleUpload = async () => {  
    if (!file) return;  
  
    const formData = new FormData();  
    formData.append('file', file);  
  
    // Send the file to the server  
    const response = await fetch('http://localhost:5000/upload', {  
      method: 'POST',  
      body: formData,  
    });  
  
    if (response.ok) {  
      const data = await response.json();  
      const link = `http://localhost:5173/preview.html?model=${data.fileId}`;  
      setPreviewLink(link);  
      setCopyButtonText('Copy Link');  
    } else {  
      alert('File upload failed.');  
    }  
  };  
  
  const copyToClipboard = () => {  
    navigator.clipboard.writeText(previewLink);  
    setCopyButtonText('Copied!');  
  };  
  
  useEffect(() => {  
    if (file) {  
      const loader = new GLTFLoader();  
      const scene = new THREE.Scene();  
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);  
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });  
      renderer.setSize(window.innerWidth, window.innerHeight);  
      document.body.appendChild(renderer.domElement);  
  
      // Load the GLTF model  
      const reader = new FileReader();  
      reader.onload = (event) => {  
        const arrayBuffer = event.target.result;  
        loader.parse(arrayBuffer, '', (gltf) => {  
          scene.add(gltf.scene);  
          camera.position.z = 5;  
  
          // Animation loop  
          const animate = () => {  
            requestAnimationFrame(animate);  
            gltf.scene.rotation.y += 0.01; // Rotate the model  
            renderer.render(scene, camera);  
          };  
          animate();  
        });  
      };  
      reader.readAsArrayBuffer(file);  
  
      // Cleanup on component unmount  
      return () => {  
        renderer.dispose();  
        scene.clear();  
      };  
    }  
  }, [file]);  
  
  return (  
    <div className="file-upload-container">  
      <h1>3D Model Uploader</h1>  
      <input type="file" accept=".gltf,.glb" onChange={handleFileChange} />  
      <button onClick={handleUpload}>Upload</button>  
  
      {/* Canvas for 3D preview */}  
        <canvas className='threed-preview' ref={canvasRef} style={{ width: '100%', height: '400px' }} />  
      <div className="preview-link-container">  
        {previewLink && (  
          <>  
            <p className="preview-link">{previewLink}</p>  
            <button onClick={copyToClipboard} className="copy-button">  
              {copyButtonText}  
            </button>  
          </>  
        )}  
      </div>  
  
    </div>  
  );  
};  
  
export default FileUpload;  
