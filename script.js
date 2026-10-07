/**
 * Spotify Web Player - Audio Engine & Backend Connector
 */

// Embedded fallback songs dataset
const DEFAULT_SONGS = [
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

class SpotifyApp {
    constructor() {
        this.songs = DEFAULT_SONGS;
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffle = false;
        this.repeatMode = 'off'; // 'off' | 'all' | 'one'
        this.volume = 0.8;
        this.isMuted = false;
        this.searchQuery = '';
        this.activeGenre = 'all';

        // Safe Local Storage parsing
        this.likedSongs = new Set();
        try {
            const saved = localStorage.getItem('spotify_liked_tracks');
            if (saved) {
                this.likedSongs = new Set(JSON.parse(saved));
            }
        } catch (e) {
            console.warn('LocalStorage access restricted:', e);
        }

        // Grab or create audio element
        this.audio = document.getElementById('mainAudio') || new Audio();
        this.audio.preload = 'metadata';
        this.audio.volume = this.volume;

        // Cache UI elements
        this.cacheDOM();

        // Bind events
        this.bindEvents();

        // Initialize volume
        this.setVolume(this.volume);

        // Fetch from API backend if available
        this.fetchBackendSongs();

        // Initialize UI
        this.renderQuickGrid();
        this.renderTracklist();
        this.loadSong(this.currentIndex, false);
        this.updateLikedCount();
    }

    async fetchBackendSongs() {
        try {
            const res = await fetch('/api/songs');
            if (res.ok) {
                const data = await res.json();
                if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
                    this.songs = data.data;
                    if (this.backendStatus) {
                        this.backendStatus.innerText = `Connected (${this.songs.length} Tracks)`;
                    }
                    this.renderQuickGrid();
                    this.renderTracklist();
                    this.loadSong(this.currentIndex, false);
                }
            }
        } catch (err) {
            // Standalone mode / file protocol
            console.log('Using local embedded playlist mode');
            if (this.backendStatus) {
                this.backendStatus.innerText = `Local Player (${this.songs.length} Tracks)`;
            }
        }
    }

    cacheDOM() {
        // Player controls
        this.masterPlayBtn = document.getElementById('masterPlay');
        this.masterPlayIcon = document.getElementById('masterPlayIcon');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.progressBar = document.getElementById('myProgressBar');
        this.progressFill = document.getElementById('progressFill');
        this.currentTimeLabel = document.getElementById('currentTimeLabel');
        this.totalDurationLabel = document.getElementById('totalDurationLabel');
        this.playerThumb = document.getElementById('playerThumb');
        this.playerSongName = document.getElementById('playerSongName');
        this.playerArtistName = document.getElementById('playerArtistName');
        this.playerHeartBtn = document.getElementById('playerHeartBtn');
        this.playerBar = document.getElementById('playerBar');

        // Volume controls
        this.volumeBtn = document.getElementById('volumeBtn');
        this.volumeIcon = document.getElementById('volumeIcon');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeFill = document.getElementById('volumeFill');

        // Containers
        this.trackRowsContainer = document.getElementById('trackRowsContainer');
        this.quickGrid = document.getElementById('quickGrid');
        this.heroPlayBtn = document.getElementById('heroPlayBtn');
        this.heroCoverImg = document.getElementById('heroCoverImg');
        this.shuffleAllBtn = document.getElementById('shuffleAllBtn');
        this.searchInput = document.getElementById('searchInput');
        this.clearSearchBtn = document.getElementById('clearSearchBtn');
        this.searchCounter = document.getElementById('searchCounter');
        this.likedCount = document.getElementById('likedCount');
        this.toast = document.getElementById('toast');
        this.topHeader = document.getElementById('topHeader');
        this.mainContent = document.getElementById('mainContent');
        this.backendStatus = document.getElementById('backendStatus');
    }

    bindEvents() {
        // Master Play / Pause Buttons
        if (this.masterPlayBtn) {
            this.masterPlayBtn.addEventListener('click', () => this.togglePlay());
        }
        if (this.heroPlayBtn) {
            this.heroPlayBtn.addEventListener('click', () => this.togglePlay());
        }

        // Previous / Next Buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSong());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSong());
        }

        // Shuffle & Repeat
        if (this.shuffleBtn) {
            this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        }
        if (this.shuffleAllBtn) {
            this.shuffleAllBtn.addEventListener('click', () => {
                this.isShuffle = true;
                if (this.shuffleBtn) this.shuffleBtn.classList.add('active');
                this.playRandomSong();
            });
        }
        if (this.repeatBtn) {
            this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        }

        // Player Bar Heart Button
        if (this.playerHeartBtn) {
            this.playerHeartBtn.addEventListener('click', () => {
                this.toggleLike(this.songs[this.currentIndex].id);
            });
        }

        // Audio Events
        this.audio.addEventListener('timeupdate', () => this.onTimeUpdate());
        this.audio.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
        this.audio.addEventListener('ended', () => this.onTrackEnded());
        this.audio.addEventListener('play', () => this.syncPlayState(true));
        this.audio.addEventListener('pause', () => this.syncPlayState(false));
        this.audio.addEventListener('error', (e) => {
            console.error('Audio playback error:', e);
            this.showToast('Playback error for this track.');
        });

        // Seekbar interaction
        if (this.progressBar) {
            this.progressBar.addEventListener('input', (e) => {
                const pct = parseFloat(e.target.value);
                if (this.progressFill) this.progressFill.style.width = `${pct}%`;
            });
            this.progressBar.addEventListener('change', (e) => {
                if (this.audio.duration && !isNaN(this.audio.duration)) {
                    const targetTime = (parseFloat(e.target.value) / 100) * this.audio.duration;
                    this.audio.currentTime = targetTime;
                }
            });
        }

        // Volume interaction
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => {
                this.setVolume(parseFloat(e.target.value) / 100);
            });
        }
        if (this.volumeBtn) {
            this.volumeBtn.addEventListener('click', () => this.toggleMute());
        }

        // Search Input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.trim().toLowerCase();
                if (this.clearSearchBtn) {
                    this.clearSearchBtn.style.display = this.searchQuery ? 'block' : 'none';
                }
                this.renderTracklist();
            });
        }
        if (this.clearSearchBtn) {
            this.clearSearchBtn.addEventListener('click', () => {
                if (this.searchInput) this.searchInput.value = '';
                this.searchQuery = '';
                this.clearSearchBtn.style.display = 'none';
                this.renderTracklist();
            });
        }

        // Filter Pills
        document.querySelectorAll('.pill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.activeGenre = e.currentTarget.dataset.genre;
                this.renderTracklist();
            });
        });

        // Sidebar Playlist Filters
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.playlist-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const filter = item.dataset.filter;
                this.activeGenre = filter;
                document.querySelectorAll('.pill-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.genre === filter);
                });
                this.renderTracklist();
            });
        });

        // Top Header Scroll Effect
        if (this.mainContent && this.topHeader) {
            this.mainContent.addEventListener('scroll', () => {
                this.topHeader.classList.toggle('scrolled', this.mainContent.scrollTop > 60);
            });
        }

        // Keyboard Shortcuts
        window.addEventListener('keydown', (e) => {
            if (document.activeElement === this.searchInput) return;

            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            } else if (e.code === 'ArrowRight') {
                e.preventDefault();
                this.seekRelative(5);
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                this.seekRelative(-5);
            } else if (e.key === 'n' || e.key === 'N') {
                this.nextSong();
            } else if (e.key === 'p' || e.key === 'P') {
                this.prevSong();
            } else if (e.key === 'm' || e.key === 'M') {
                this.toggleMute();
            }
        });
    }

    loadSong(index, shouldPlay = true) {
        if (index < 0 || index >= this.songs.length) return;
        this.currentIndex = index;
        const song = this.songs[this.currentIndex];

        this.audio.src = song.filePath;
        if (this.playerThumb) this.playerThumb.src = song.coverPath;
        if (this.playerSongName) this.playerSongName.innerText = song.title;
        if (this.playerArtistName) this.playerArtistName.innerText = song.artist;
        if (this.heroCoverImg) this.heroCoverImg.src = song.coverPath;

        // Reset progress bar
        if (this.progressBar) this.progressBar.value = 0;
        if (this.progressFill) this.progressFill.style.width = '0%';
        if (this.currentTimeLabel) this.currentTimeLabel.innerText = '0:00';
        if (this.totalDurationLabel) this.totalDurationLabel.innerText = song.duration || '0:00';

        // Update Liked status
        const isLiked = this.likedSongs.has(song.id);
        if (this.playerHeartBtn) {
            this.playerHeartBtn.classList.toggle('is-liked', isLiked);
            this.playerHeartBtn.innerHTML = isLiked ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
        }

        // Media Session API for native lockscreen controls
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: song.artist,
                album: song.album,
                artwork: [{ src: song.coverPath, sizes: '512x512', type: 'image/jpeg' }]
            });
        }

        this.updateActiveRow();
        this.updateActiveQuickCard();

        if (shouldPlay) {
            this.play();
        }
    }

    play() {
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.syncPlayState(true);
            }).catch(err => {
                console.warn('Playback blocked or pending user interaction:', err);
                this.isPlaying = false;
                this.syncPlayState(false);
            });
        }
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.syncPlayState(false);
    }

    togglePlay() {
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    nextSong() {
        if (this.isShuffle) {
            this.playRandomSong();
            return;
        }
        let nextIndex = this.currentIndex + 1;
        if (nextIndex >= this.songs.length) {
            nextIndex = 0;
        }
        this.loadSong(nextIndex, true);
    }

    prevSong() {
        if (this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
            return;
        }
        let prevIndex = this.currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.songs.length - 1;
        }
        this.loadSong(prevIndex, true);
    }

    playRandomSong() {
        if (this.songs.length <= 1) return;
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length);
        } while (randomIndex === this.currentIndex);
        this.loadSong(randomIndex, true);
    }

    seekRelative(seconds) {
        if (!this.audio.duration) return;
        const newTime = Math.max(0, Math.min(this.audio.duration, this.audio.currentTime + seconds));
        this.audio.currentTime = newTime;
    }

    onTrackEnded() {
        if (this.repeatMode === 'one') {
            this.audio.currentTime = 0;
            this.play();
        } else if (this.repeatMode === 'all' || this.currentIndex < this.songs.length - 1 || this.isShuffle) {
            this.nextSong();
        } else {
            this.pause();
            this.audio.currentTime = 0;
        }
    }

    syncPlayState(isPlaying) {
        this.isPlaying = isPlaying;

        if (this.masterPlayIcon) {
            this.masterPlayIcon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
        }
        if (this.heroPlayBtn) {
            this.heroPlayBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
        }
        if (this.playerBar) {
            this.playerBar.classList.toggle('playing', isPlaying);
        }

        this.updateActiveRow();
        this.updateActiveQuickCard();
    }

    onTimeUpdate() {
        if (!this.audio.duration || isNaN(this.audio.duration)) return;
        const pct = (this.audio.currentTime / this.audio.duration) * 100;
        if (this.progressBar) this.progressBar.value = pct;
        if (this.progressFill) this.progressFill.style.width = `${pct}%`;
        if (this.currentTimeLabel) this.currentTimeLabel.innerText = this.formatTime(this.audio.currentTime);
    }

    onLoadedMetadata() {
        if (this.audio.duration && !isNaN(this.audio.duration)) {
            if (this.totalDurationLabel) {
                this.totalDurationLabel.innerText = this.formatTime(this.audio.duration);
            }
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        this.audio.volume = this.volume;
        if (this.volumeSlider) this.volumeSlider.value = this.volume * 100;
        if (this.volumeFill) this.volumeFill.style.width = `${this.volume * 100}%`;

        if (this.volumeIcon) {
            if (this.volume === 0) {
                this.isMuted = true;
                this.volumeIcon.className = 'fa-solid fa-volume-xmark';
            } else if (this.volume < 0.5) {
                this.isMuted = false;
                this.volumeIcon.className = 'fa-solid fa-volume-low';
            } else {
                this.isMuted = false;
                this.volumeIcon.className = 'fa-solid fa-volume-high';
            }
        }
    }

    toggleMute() {
        if (this.isMuted) {
            this.setVolume(this.prevVolume || 0.8);
        } else {
            this.prevVolume = this.volume;
            this.setVolume(0);
        }
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        if (this.shuffleBtn) this.shuffleBtn.classList.toggle('active', this.isShuffle);
        this.showToast(this.isShuffle ? 'Shuffle ON' : 'Shuffle OFF');
    }

    toggleRepeat() {
        if (this.repeatMode === 'off') {
            this.repeatMode = 'all';
            if (this.repeatBtn) {
                this.repeatBtn.classList.add('active');
                this.repeatBtn.innerHTML = '<i class="fa-solid fa-repeat"></i>';
            }
            this.showToast('Repeat All ON');
        } else if (this.repeatMode === 'all') {
            this.repeatMode = 'one';
            if (this.repeatBtn) {
                this.repeatBtn.classList.add('active');
                this.repeatBtn.innerHTML = '<i class="fa-solid fa-repeat-1"></i>';
            }
            this.showToast('Repeat Track ON');
        } else {
            this.repeatMode = 'off';
            if (this.repeatBtn) {
                this.repeatBtn.classList.remove('active');
                this.repeatBtn.innerHTML = '<i class="fa-solid fa-repeat"></i>';
            }
            this.showToast('Repeat OFF');
        }
    }

    toggleLike(songId) {
        const song = this.songs.find(s => s.id === songId);
        if (!song) return;

        if (this.likedSongs.has(songId)) {
            this.likedSongs.delete(songId);
            this.showToast(`Removed from Liked Songs`);
        } else {
            this.likedSongs.add(songId);
            this.showToast(`Added to Liked Songs`);
        }

        try {
            localStorage.setItem('spotify_liked_tracks', JSON.stringify(Array.from(this.likedSongs)));
        } catch (e) {
            console.warn('Unable to persist likes to localStorage:', e);
        }

        this.updateLikedCount();

        if (this.songs[this.currentIndex].id === songId && this.playerHeartBtn) {
            const isLiked = this.likedSongs.has(songId);
            this.playerHeartBtn.classList.toggle('is-liked', isLiked);
            this.playerHeartBtn.innerHTML = isLiked ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
        }

        this.renderTracklist();
    }

    updateLikedCount() {
        if (this.likedCount) {
            this.likedCount.innerText = `${this.likedSongs.size} song${this.likedSongs.size === 1 ? '' : 's'}`;
        }
    }

    showToast(message) {
        if (!this.toast) return;
        this.toast.innerText = message;
        this.toast.classList.add('show');
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            if (this.toast) this.toast.classList.remove('show');
        }, 2200);
    }

    getFilteredSongs() {
        return this.songs.filter(song => {
            const matchesQuery = !this.searchQuery ||
                song.title.toLowerCase().includes(this.searchQuery) ||
                song.artist.toLowerCase().includes(this.searchQuery) ||
                song.album.toLowerCase().includes(this.searchQuery);

            let matchesGenre = true;
            if (this.activeGenre === 'ncs') {
                matchesGenre = song.genre === 'ncs';
            } else if (this.activeGenre === 'favorites') {
                matchesGenre = this.likedSongs.has(song.id);
            } else if (this.activeGenre === 'electronic') {
                matchesGenre = song.genre === 'electronic';
            }

            return matchesQuery && matchesGenre;
        });
    }

    renderQuickGrid() {
        if (!this.quickGrid) return;
        const quickItems = this.songs.slice(0, 6);
        this.quickGrid.innerHTML = quickItems.map(song => {
            const isCurrent = song.id === this.currentIndex;
            return `
                <div class="quick-card ${isCurrent ? 'active-card' : ''}" data-id="${song.id}">
                    <img src="${song.coverPath}" alt="${song.title}">
                    <div class="quick-card-info">
                        <span class="qc-title">${song.title}</span>
                        <span class="qc-artist">${song.artist}</span>
                    </div>
                    <button class="qc-play-btn" title="Play">
                        <i class="fa-solid ${isCurrent && this.isPlaying ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                </div>
            `;
        }).join('');

        this.quickGrid.querySelectorAll('.quick-card').forEach(card => {
            card.addEventListener('click', () => {
                const songId = parseInt(card.dataset.id);
                if (this.currentIndex === songId) {
                    this.togglePlay();
                } else {
                    this.loadSong(songId, true);
                }
            });
        });
    }

    renderTracklist() {
        if (!this.trackRowsContainer) return;
        const filtered = this.getFilteredSongs();
        if (this.searchCounter) {
            this.searchCounter.innerText = `Showing ${filtered.length} song${filtered.length === 1 ? '' : 's'}`;
        }

        if (filtered.length === 0) {
            this.trackRowsContainer.innerHTML = `
                <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
                    <i class="fa-solid fa-music" style="font-size: 2.5rem; margin-bottom: 12px; opacity: 0.5;"></i>
                    <p style="font-size: 1.1rem; font-weight: 700; color: #fff;">No tracks found</p>
                    <p style="font-size: 0.85rem; margin-top: 4px;">Try searching for a different song or artist.</p>
                </div>
            `;
            return;
        }

        this.trackRowsContainer.innerHTML = filtered.map((song, idx) => {
            const isCurrent = song.id === this.currentIndex;
            const isLiked = this.likedSongs.has(song.id);
            return `
                <div class="track-row ${isCurrent ? 'active-row' : ''}" data-id="${song.id}">
                    <div class="row-index">
                        <span class="num">${idx + 1}</span>
                        ${isCurrent && this.isPlaying ? `
                            <div class="row-eq">
                                <span class="eq-bar"></span>
                                <span class="eq-bar"></span>
                                <span class="eq-bar"></span>
                                <span class="eq-bar"></span>
                            </div>
                        ` : ''}
                        <i class="fa-solid ${isCurrent && this.isPlaying ? 'fa-pause' : 'fa-play'} row-play-icon"></i>
                    </div>
                    <div class="row-title-col">
                        <img src="${song.coverPath}" alt="${song.title}" class="row-thumb">
                        <div class="row-title-meta">
                            <span class="row-title">${song.title}</span>
                            <span class="row-artist">${song.artist}</span>
                        </div>
                    </div>
                    <div class="row-album-col">${song.album}</div>
                    <div class="row-actions-col">
                        <button class="row-heart-btn ${isLiked ? 'is-liked' : ''}" data-like-id="${song.id}" title="Like">
                            <i class="fa-${isLiked ? 'solid' : 'regular'} fa-heart"></i>
                        </button>
                        <span class="row-duration">${song.duration}</span>
                    </div>
                </div>
            `;
        }).join('');

        // Row Click Listeners
        this.trackRowsContainer.querySelectorAll('.track-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.closest('.row-heart-btn')) return;
                const songId = parseInt(row.dataset.id);
                if (this.currentIndex === songId) {
                    this.togglePlay();
                } else {
                    this.loadSong(songId, true);
                }
            });
        });

        // Heart Click Listeners
        this.trackRowsContainer.querySelectorAll('.row-heart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const songId = parseInt(btn.dataset.likeId);
                this.toggleLike(songId);
            });
        });
    }

    updateActiveRow() {
        document.querySelectorAll('.track-row').forEach(row => {
            const songId = parseInt(row.dataset.id);
            const isCurrent = songId === this.currentIndex;
            row.classList.toggle('active-row', isCurrent);

            const numSpan = row.querySelector('.num');
            const playIcon = row.querySelector('.row-play-icon');
            let eqWrap = row.querySelector('.row-eq');

            if (isCurrent && this.isPlaying) {
                if (!eqWrap) {
                    const eqEl = document.createElement('div');
                    eqEl.className = 'row-eq';
                    eqEl.innerHTML = '<span class="eq-bar"></span><span class="eq-bar"></span><span class="eq-bar"></span><span class="eq-bar"></span>';
                    row.querySelector('.row-index').appendChild(eqEl);
                }
                if (playIcon) playIcon.className = 'fa-solid fa-pause row-play-icon';
            } else {
                if (eqWrap) eqWrap.remove();
                if (playIcon) playIcon.className = 'fa-solid fa-play row-play-icon';
            }
        });
    }

    updateActiveQuickCard() {
        document.querySelectorAll('.quick-card').forEach(card => {
            const songId = parseInt(card.dataset.id);
            const isCurrent = songId === this.currentIndex;
            card.classList.toggle('active-card', isCurrent);
            const playIcon = card.querySelector('.qc-play-btn i');
            if (playIcon) {
                playIcon.className = `fa-solid ${isCurrent && this.isPlaying ? 'fa-pause' : 'fa-play'}`;
            }
        });
    }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.spotifyApp = new SpotifyApp();
});