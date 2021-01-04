import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';

import feedRoutes from './routes/feed.js';
import authRoutes from './routes/auth.js';

import { multerSetup } from './utils/multerUtils.js';
import { corsHeadersMiddelware, handleErrorMiddelware } from './utils/middlewareUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(multer(multerSetup).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(corsHeadersMiddelware);

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use(handleErrorMiddelware);

mongoose.connect('mongodb+srv://rgederin:rownUovIp5jHzPQ2@cluster0.9acrc.mongodb.net/blog?retryWrites=true&w=majority')
    .then(result => {
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    });