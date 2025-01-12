import React from 'react';  
import './Modal.css'; // Import the CSS file for styling  
  
const Modal = ({ isOpen, onClose, link }) => {  
  const copyToClipboard = () => {  
    navigator.clipboard.writeText(link);  
    alert('Link copied to clipboard!');  
  };  
  
  if (!isOpen) return null;  
  
  return (  
    <div className="modal-overlay">  
      <div className="modal-content">  
        <h2>File Uploaded Successfully!</h2>  
        <p>Your preview link:</p>  
        <input type="text" value={link} readOnly className="link-input" />  
        <button onClick={copyToClipboard} className="copy-button">Copy Link</button>  
        <button onClick={onClose} className="close-button">Close</button>  
      </div>  
    </div>  
  );  
};  
  
export default Modal;  
