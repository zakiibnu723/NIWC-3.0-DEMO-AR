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
    const selectedFile = event.target.files[0];  
    if (selectedFile) {  
      setFile(selectedFile);  
      loadModel(selectedFile); // Load the model when file changes  
    }  
  };  
  
  const loadModel = (file) => {  
    const url = URL.createObjectURL(file); // Create a URL for the file  
    const loader = new GLTFLoader();  
    const scene = new THREE.Scene();  
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);  
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });  
      
    renderer.setSize(window.innerWidth, window.innerHeight);  
    camera.position.z = 5;  
  
    // Add ambient light  
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);  
    scene.add(ambientLight);  
  
    // Load the GLTF model  
    loader.load(url, (gltf) => {  
      scene.add(gltf.scene);  
      animate();  
    }, undefined, (error) => {  
      console.error(error);  
    });  
  
    const animate = () => {  
      requestAnimationFrame(animate);  
      renderer.render(scene, camera);  
    };  
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
  
  return (  
    <div className="file-upload-container">  
      <h1 className="title">3D Model Uploader</h1>  
      <input  
        type="file"  
        accept=".gltf,.glb"  
        onChange={handleFileChange}  
        className="file-input"  
      />  
      <button onClick={handleUpload} className="upload-button">Upload</button>  
      <canvas ref={canvasRef} className="threed-preview" />  
      {previewLink && (  
        <div className="preview-link-container">  
          <p className="preview-link">{previewLink}</p>  
          <button onClick={copyToClipboard} className="copy-button">  
            {copyButtonText}  
          </button>  
        </div>  
      )}  
    </div>  
  );  
};  
  
export default FileUpload;  
