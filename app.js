const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const userRouter = require('./routes/user.routes');
const indexRouter = require('./routes/index.routes');
const fetch = require('node-fetch');

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use('/user', userRouter);
app.use('/', indexRouter);

app.post('/upload', async (req, res) => {
    if (!req.files || !req.files.file) return res.status(400).send('No file uploaded');
    try {
        const file = req.files.file;
        const response = await fetch('https://api.vercel.com/v1/blob', {
            method: 'POST',
            headers: { Authorization: `Bearer ${process.env.VERCEL_STORAGE_TOKEN}` },
            body: file.data
        });
        const result = await response.json();
        res.send({ fileUrl: result.url });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).send('Failed to upload file');
    }
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});
