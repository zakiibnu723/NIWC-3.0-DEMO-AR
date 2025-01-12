// src/App.jsx  
import React from 'react';  
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  
import FileUpload from './components/FileUpload';  
  
const App = () => {  
    return (  
        <Router>  
            <Routes>  
                <Route path="/" element={<FileUpload />} />  
                <Route path="/AR" element={<Navigate to="/preview.html" replace />} /> {/* Use ARPreview for the preview route */}  
            </Routes>  
        </Router>  
    );  
};  
  
export default App;  
