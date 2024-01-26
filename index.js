const express = require('express');
const path = require('path');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// API endpoint for audio conversion
app.post('/convert', async (req, res) => {
    try {
        const { videoUrl } = req.body;
        console.log('Requested Video URL:', videoUrl);

        const info = await ytdl.getInfo(videoUrl);
        console.log('Video Info:', info);

        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        const bestFormat = ytdl.chooseFormat(audioFormats, { quality: 'highestaudio' });
        const audioStream = ytdl(videoUrl, { format: bestFormat });

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', 'attachment; filename=audio.mp3');
        audioStream.pipe(res, { end: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error: ' + error.message);
    }
});

// Handle other routes by serving the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
