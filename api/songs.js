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

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    res.status(200).json({
        success: true,
        count: SONGS_DATA.length,
        data: SONGS_DATA
    });
};
