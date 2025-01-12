import React, { useState, useRef } from 'react';    
import * as THREE from 'three';    
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';    
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';    
import { QRCodeSVG } from 'qrcode.react'; // Import QRCodeSVG  
import './FileUpload.css'; // Import the CSS file for styling    
    
const FileUpload = () => {    
  const [file, setFile] = useState(null);    
  const [previewLink, setPreviewLink] = useState('');    
  const [embedCode, setEmbedCode] = useState(''); // State for the embed code    
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
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true }); // Set alpha to true for transparent background    
    
    renderer.setSize(800, 600); // Set a fixed size for the canvas    
    camera.position.set(0, 1, 2); // Move the camera closer to the object    
    
    // Add ambient light    
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);    
    scene.add(ambientLight);    
    
    // Load the GLTF model    
    loader.load(url, (gltf) => {    
      // Scale the model to make it larger    
      gltf.scene.scale.set(2, 2, 2); // Adjust the scale as needed (2x larger in this case)    
      scene.add(gltf.scene);    
      animate();    
    }, undefined, (error) => {    
      console.error(error);    
    });    
    
    // Add OrbitControls    
    const controls = new OrbitControls(camera, renderer.domElement);    
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled    
    controls.dampingFactor = 0.25;    
    controls.screenSpacePanning = false;    
    
    const animate = () => {    
      requestAnimationFrame(animate);    
      controls.update(); // Update the controls    
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
      generateEmbedCode(link); // Generate the embed code    
    } else {    
      alert('File upload failed.');    
    }    
  };    
    
  const generateEmbedCode = (link) => {    
    const embedCode = `<a href="${link}" style="background-color: white; color: black; padding: 10px 20px; border-radius: 25px; border: 1px solid #ccc; display: inline-block; font-family: Arial, sans-serif; font-size: 16px; text-align: center; text-decoration: none; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); transition: background-color 0.3s;" onmouseover="this.style.backgroundColor='#e0e0e0';" onmouseout="this.style.backgroundColor='white';">  
            View AR  
        </a>`;    
    setEmbedCode(embedCode); // Set the embed code state    
  };    
    
  const copyToClipboard = () => {    
    navigator.clipboard.writeText(previewLink);    
    alert('Link copied')    
  };    
    
  const copyEmbedCodeToClipboard = () => {    
    navigator.clipboard.writeText(embedCode);    
    alert('Embed Code copied');    
  };    
    
  return (    
    <>    
      <div className="myapp">    
        <div className="file-upload-container">  
          <h1 className="title">AR Generator</h1>    
          <div className='form-input'>
            <input    
              type="file"    
              accept=".gltf,.glb"    
              onChange={handleFileChange}    
              className="file-input"    
            />    
            <button onClick={handleUpload} className="upload-button">Upload</button>    
          </div>  
  
          {/* QR code preview */}  
          {previewLink && (    
            <div className="qr-code-container">    
              <QRCodeSVG value={previewLink} size={180} /> {/* QR Code for the preview link */}  
            </div>    
          )}  
          {previewLink && (    
            <div className="preview-link-container">    
              <p className='label-preview'>Link</p>  
              <p className="preview-link">{previewLink}</p>    
              <button onClick={copyToClipboard} className="copy-button">    
                <svg viewBox="0 0 21 22" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 0h-12C1.4 0 .5.9.5 2v14h2V2h12V0Zm3 4h-11c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 16h-11V6h11v14Z" fill="#ffffff" fill-rule="evenodd" class="fill-000000"></path></svg>  
              </button>    
            </div>    
          )}    
          {embedCode && (    
            <div className="embed-code-container">    
              <p className='label-preview'>Html</p>  
              <p className="embed-code">{embedCode}</p>    
              <button onClick={copyEmbedCodeToClipboard} className="copy-button">    
                <svg viewBox="0 0 21 22" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 0h-12C1.4 0 .5.9.5 2v14h2V2h12V0Zm3 4h-11c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 16h-11V6h11v14Z" fill="#ffffff" fill-rule="evenodd" class="fill-000000"></path></svg>   
              </button>    
            </div>    
          )}    
  
        </div>    
        <div className="threed-preview">    
          <canvas ref={canvasRef} className="threed-preview" />    
        </div>    
      </div>    
    </>    
  );    
};    
    
export default FileUpload;    
