import express from 'express';
import dotenv from 'dotenv';

import fileUpload from 'express-fileupload';
import Client from 'ssh2-sftp-client';

import cors from 'cors';
import { corsConfig } from './config/cors';
import { connectDB } from './config/db';
import projectRoutes from './routes/projectRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

connectDB();

const app = express();
app.use(cors(corsConfig));
app.use(fileUpload());

const config = {
  host: 'your-server.com',
  port: '22',
  username: 'your-username',
  password: 'your-password',
};

app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let uploadedFile = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;
  const localFilePath = `/tmp/${uploadedFile.name}`;

  // Save file locally
  await uploadedFile.mv(localFilePath);

  const sftp = new Client();
  try {
    await sftp.connect(config);
    await sftp.put(localFilePath, `/remote/path/${uploadedFile.name}`);
    await sftp.end();
    res.send('File uploaded!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading file.');
  }
});

app.use(express.json());

//TODO: Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);


export default app;
