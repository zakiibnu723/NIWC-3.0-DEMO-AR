import express from 'express';  
import cors from 'cors';  
import multer from 'multer';  
import path from 'path';  
import { v4 as uuidv4 } from 'uuid';  
  
const app = express();  
const PORT = process.env.PORT || 5000;  
  
// Enable CORS for all routes  
app.use(cors());  
  
// Set up storage for uploaded files  
const storage = multer.diskStorage({  
  destination: (req, file, cb) => {  
    cb(null, '3d'); // Ensure this folder exists  
  },  
  filename: (req, file, cb) => {  
    const ext = path.extname(file.originalname);  
    const uniqueId = uuidv4(); // Generate a unique ID without the extension  
    cb(null, uniqueId + ext); // Save the file with the unique ID and extension  
  },  
});  
  
const upload = multer({ storage });  
  
// Serve static files from the React app  
app.use(express.static(path.join(process.cwd(), 'build'))); // Adjust path as necessary  
  
// Handle file uploads  
app.post('/upload', upload.single('file'), (req, res) => {  
  const fileId = path.basename(req.file.filename, path.extname(req.file.filename)); // Get the UUID without the extension  
  res.json({ fileId }); // Send the UUID back to the client  
});  
  
// Start the server  
app.listen(PORT, () => {  
  console.log(`Server is running on http://localhost:${PORT}`);  
});  
