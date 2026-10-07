const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 5500;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg'
};

const SONGS_DATA = [
    {
        id: 0,
        title: "Mortals (feat. Laura Brehm)",
        artist: "Warriyo",
        album: "NCS: Elevate",
        genre: "ncs",
        filePath: "songs/1.mp3",
        coverPath: "covers/1.jpg",
        duration: "03:50"
    },
    {
        id: 1,
        title: "Cielo",
        artist: "Huma-Huma",
        album: "YouTube Audio Library",
        genre: "electronic",
        filePath: "songs/2.mp3",
        coverPath: "covers/2.jpg",
        duration: "02:33"
    },
    {
        id: 2,
        title: "Invincible [NCS Release]",
        artist: "DEAF KEV",
        album: "NCS: Infinity",
        genre: "ncs",
        filePath: "songs/3.mp3",
        coverPath: "covers/3.jpg",
        duration: "04:33"
    },
    {
        id: 3,
        title: "My Heart [NCS Release]",
        artist: "Different Heaven & EH!DE",
        album: "NCS: Uplifting",
        genre: "ncs",
        filePath: "songs/4.mp3",
        coverPath: "covers/4.jpg",
        duration: "04:27"
    },
    {
        id: 4,
        title: "Heroes Tonight (feat. Johnning)",
        artist: "Janji",
        album: "NCS: Uplifting",
        genre: "ncs",
        filePath: "songs/5.mp3",
        coverPath: "covers/5.jpg",
        duration: "03:28"
    },
    {
        id: 5,
        title: "On & On (feat. Daniel Levi)",
        artist: "Cartoon",
        album: "NCS: Best of Electronic",
        genre: "ncs",
        filePath: "songs/6.mp3",
        coverPath: "covers/6.jpg",
        duration: "03:28"
    },
    {
        id: 6,
        title: "Cradles",
        artist: "Sub Urban",
        album: "NCS Releases",
        genre: "ncs",
        filePath: "songs/7.mp3",
        coverPath: "covers/7.jpg",
        duration: "04:33"
    },
    {
        id: 7,
        title: "Fade [NCS Release]",
        artist: "Alan Walker",
        album: "NCS: Origins",
        genre: "ncs",
        filePath: "songs/8.mp3",
        coverPath: "covers/8.jpg",
        duration: "03:50"
    },
    {
        id: 8,
        title: "Sky High [NCS Release]",
        artist: "Elektronomia",
        album: "NCS: Infinity",
        genre: "ncs",
        filePath: "songs/9.mp3",
        coverPath: "covers/9.jpg",
        duration: "03:28"
    },
    {
        id: 9,
        title: "Reality (feat. Janieck Devy)",
        artist: "Lost Frequencies",
        album: "Deep Waves",
        genre: "electronic",
        filePath: "songs/10.mp3",
        coverPath: "covers/10.jpg",
        duration: "04:27"
    }
];

const server = http.createServer((req, res) => {
    // Enable CORS and disable browser caching during development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    let pathname = decodeURI(parsedUrl.pathname);

    // API Routes
    if (pathname === '/api/songs') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, count: SONGS_DATA.length, data: SONGS_DATA }));
        return;
    }

    if (pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), timestamp: new Date() }));
        return;
    }

    // Default route
    if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
    }

    const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(PUBLIC_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const totalSize = stats.size;
        const range = req.headers.range;

        // HTTP 206 Byte Range Request (Smooth Audio Seeking)
        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

            if (start >= totalSize || end >= totalSize || start > end) {
                res.writeHead(416, { 'Content-Range': `bytes */${totalSize}` });
                res.end();
                return;
            }

            const chunkSize = (end - start) + 1;
            const fileStream = fs.createReadStream(filePath, { start, end });

            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${totalSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            });

            fileStream.pipe(res);
        } else {
            res.writeHead(200, {
                'Content-Length': totalSize,
                'Content-Type': contentType,
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            });

            if (req.method === 'HEAD') {
                res.end();
                return;
            }

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        }
    });
});

server.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🎵 Modern Spotify Web Server Running!`);
    console.log(`🔗 Web App: http://localhost:${PORT}`);
    console.log(`📡 API:     http://localhost:${PORT}/api/songs`);
    console.log(`========================================`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        const altPort = PORT + 1;
        console.warn(`Port ${PORT} in use, trying ${altPort}...`);
        server.listen(altPort);
    } else {
        console.error('Server error:', err);
    }
});
