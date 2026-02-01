// script.js

let players = {};

// Variables to keep track of currently playing music and spoken word tracks
let currentMusic = null;
let currentSpoken = null;
let currentBackgroundVideo = null;

// Variables to keep track of which sfx tracks are playing
let playingSfx = new Set();

// Variable to keep track of tracks playing before stop
let tracksPlayingBeforeStop = new Set();

// Variables to store track information
let musicInfo = 'Not playing';
let wordsInfo = 'Not playing';
let videoInfo = ''; // Will be set upon background video initialization

// Define audio sources with IDs matching the HTML and specify their type
const audioSources = [
    { id: 'cracklePlayer', videoId: '6vdw3yO4JBg', fixedVolume: 50, type: 'sfx', title: 'Record Player Crackle', artist: '', url: 'https://www.youtube.com/watch?v=6vdw3yO4JBg' }, // Record Player Crackle
    { id: 'manhattanPlayer', videoId: 'Vg1mpD1BICI', fixedVolume: 25, type: 'sfx', title: 'Midtown Manhattan at Night', artist: '', url: 'https://www.youtube.com/watch?v=Vg1mpD1BICI' }, // Midtown Manhattan at Night
    { id: 'rainPlayer', videoId: '8plwv25NYRo', fixedVolume: 20, type: 'sfx', title: 'Rain and Thunder', artist: '', url: 'https://www.youtube.com/watch?v=8plwv25NYRo' }, // Rain and Thunder
    { id: 'kidsPlayer', videoId: 'FCVBnE6GTg4', fixedVolume: 20, type: 'sfx', title: 'Kids', artist: '', url: 'https://www.youtube.com/watch?v=FCVBnE6GTg4' }, // Kids

    { id: 'spokenPlayer1', videoId: 'Tikm0CsDB3c', fixedVolume: 75, type: 'spoken', title: 'You Are Everything', artist: 'Alan Watts', url: 'https://www.youtube.com/watch?v=Tikm0CsDB3c' }, // Spoken Word Track 1
    { id: 'spokenPlayer2', videoId: 'OYXLVpyv0f4', fixedVolume: 75, type: 'spoken', title: 'The Architecture of Insecurity', artist: 'Alan Watts', url: 'https://www.youtube.com/watch?v=OYXLVpyv0f4' }, // Spoken Word Track 2
    { id: 'spokenPlayer3', videoId: 'Y93qFCJWygA', fixedVolume: 100, type: 'spoken', title: 'Veil of Thoughts', artist: 'Alan Watts', url: 'https://www.youtube.com/watch?v=Y93qFCJWygA' }, // Spoken Word Track 3
    { id: 'spokenPlayer4', videoId: 'C48hI9Qb2q4', fixedVolume: 100, type: 'spoken', title: 'Myth of Myself', artist: 'Alan Watts', url: 'https://www.youtube.com/watch?v=C48hI9Qb2q4' }, // Spoken Word Track 4

    { id: 'musicPlayer1', videoId: 'QejFhqJ7hkw', fixedVolume: 90, type: 'music', title: 'Son', artist: 'Komodo', url: 'https://www.youtube.com/watch?v=QejFhqJ7hkw' }, // Music Track 1
    { id: 'musicPlayer2', videoId: '6t8ySMAtW5w', fixedVolume: 90, type: 'music', title: 'Bridges', artist: 'Koresma', url: 'https://www.youtube.com/watch?v=6t8ySMAtW5w' }, // Music Track 2
    { id: 'musicPlayer3', videoId: 'aE3lFXdvwlc', fixedVolume: 90, type: 'music', title: 'Ghost Pong', artist: 'Emancipator', url: 'https://www.youtube.com/watch?v=aE3lFXdvwlc' }, // Music Track 3
    { id: 'musicPlayer4', videoId: 'JOcAZsQ4MUc', fixedVolume: 90, type: 'music', title: 'Emei', artist: 'il:lo', url: 'https://www.youtube.com/watch?v=JOcAZsQ4MUc' }, // Music Track 4
    { id: 'musicPlayer5', videoId: 'kH1bxrWH1Oc', fixedVolume: 90, type: 'music', title: "Who's to say", artist: 'Ford.', url: 'https://www.youtube.com/watch?v=kH1bxrWH1Oc' }, // Music Track 5
    { id: 'musicPlayer6', videoId: 'sFG6QWi7zHg', fixedVolume: 90, type: 'music', title: "Pink & Blue (Instrumental)", artist: 'Tycho', url: 'https://www.youtube.com/watch?v=sFG6QWi7zHg' }, // Music Track 6
    { id: 'musicPlayer7', videoId: '2zz35NZEpvw', fixedVolume: 90, type: 'music', title: "Evenings", artist: 'Still Young', url: 'https://www.youtube.com/watch?v=sFG6QWi7zHg' } // Music Track 7

    // Add more tracks as needed
];

// Define background video sources
// Upload your .mp4 files to Cloudflare R2 and update the filenames below
const backgroundVideos = [
    { id: 'backgroundVideo1', videoUrl: 'https://pub-99bd7862c66d4583a72e94b93f809058.r2.dev/2977285-uhd_3840_2160_30fps.mp4', attribution: 'Video from <a href="https://www.pexels.com/video/2977285/" target="_blank" rel="noopener noreferrer">Pexels</a>' },
    { id: 'backgroundVideo2', videoUrl: 'https://pub-99bd7862c66d4583a72e94b93f809058.r2.dev/2977311-uhd_3840_2160_30fps.mp4', attribution: 'Video from <a href="https://www.pexels.com/video/2977311/" target="_blank" rel="noopener noreferrer">Pexels</a>' },
    { id: 'backgroundVideo3', videoUrl: 'https://pub-99bd7862c66d4583a72e94b93f809058.r2.dev/4913621-uhd_3840_2160_25fps.mp4', attribution: 'Video from <a href="https://www.pexels.com/video/4913621/" target="_blank" rel="noopener noreferrer">Pexels</a>' },
    { id: 'backgroundVideo4', videoUrl: 'https://pub-99bd7862c66d4583a72e94b93f809058.r2.dev/4913623-uhd_3840_2160_25fps.mp4', attribution: 'Video from <a href="https://www.pexels.com/video/4913623/" target="_blank" rel="noopener noreferrer">Pexels</a>' },
    { id: 'backgroundVideo5', videoUrl: 'https://pub-99bd7862c66d4583a72e94b93f809058.r2.dev/5769257-uhd_3840_2160_30fps.mp4', attribution: 'Video from <a href="https://www.pexels.com/video/5769257/" target="_blank" rel="noopener noreferrer">Pexels</a>' },
];

/**
 * Function to dynamically generate background video elements
 */
function generateBackgroundVideos() {
    const container = document.getElementById('backgroundVideosContainer');
    container.innerHTML = ''; // Clear existing content

    backgroundVideos.forEach((video, index) => {
        const audioSourceDiv = document.createElement('div');
        audioSourceDiv.classList.add('audio-source');

        const audioHeaderDiv = document.createElement('div');
        audioHeaderDiv.classList.add('audio-header');

        const title = document.createElement('h2');
        title.textContent = `Background Video ${index + 1}: "${video.title}" by ${video.artist}`;

        const button = document.createElement('button');
        button.classList.add('play-button');
        button.id = `backgroundToggleButton${index + 1}`;
        button.setAttribute('aria-pressed', 'false');
        button.textContent = 'Play';

        audioHeaderDiv.appendChild(title);
        audioHeaderDiv.appendChild(button);

        audioSourceDiv.appendChild(audioHeaderDiv);
        container.appendChild(audioSourceDiv);
    });
}

/**
 * Function to dynamically generate audio source elements
 */
function generateAudioSources() {
    const container = document.getElementById('audioSourcesContainer');
    container.innerHTML = ''; // Clear existing content

    audioSources.forEach(source => {
        const audioSourceDiv = document.createElement('div');
        audioSourceDiv.classList.add('audio-source');

        const audioHeaderDiv = document.createElement('div');
        audioHeaderDiv.classList.add('audio-header');

        const title = document.createElement('h2');
        if (source.type === 'music') {
            title.textContent = `Music Track ${source.id.replace('musicPlayer', '')}: "${source.title}" by ${source.artist}`;
        } else if (source.type === 'spoken') {
            title.textContent = `Spoken Word Track: "${source.title}" by ${source.artist}`;
        } else if (source.type === 'sfx') {
            title.textContent = `${source.title}`;
        }

        const button = document.createElement('button');
        button.classList.add('play-button');
        button.id = `${source.id.replace('Player', 'ToggleButton')}`;
        button.setAttribute('aria-pressed', 'false');
        button.textContent = 'Play';

        audioHeaderDiv.appendChild(title);
        audioHeaderDiv.appendChild(button);

        audioSourceDiv.appendChild(audioHeaderDiv);

        // For audio sources, add the hidden player and loading spinner
        const playerDiv = document.createElement('div');
        playerDiv.id = source.id;
        playerDiv.classList.add('hidden');
        audioSourceDiv.appendChild(playerDiv);

        const spinnerDiv = document.createElement('div');
        spinnerDiv.id = `${source.id.replace('Player', 'LoadingSpinner')}`;
        spinnerDiv.classList.add('loading-spinner');
        audioSourceDiv.appendChild(spinnerDiv);

        container.appendChild(audioSourceDiv);
    });
}

/**
 * Function to update the track information display
 */
function updateTrackInfo() {
    document.getElementById('music-info').innerHTML = `Music: ${musicInfo}`;
    document.getElementById('words-info').innerHTML = `Words: ${wordsInfo}`;
    document.getElementById('video-info').innerHTML = `Video: ${videoInfo}`;
}

/**
 * Initialize the native video background
 */
function initializeBackgroundVideo() {
    const videoElement = document.getElementById('video-container');
    const videoSource = document.getElementById('video-source');

    if (backgroundVideos.length > 0) {
        const firstBackgroundVideo = backgroundVideos[0];
        currentBackgroundVideo = firstBackgroundVideo.id;
        videoSource.src = firstBackgroundVideo.videoUrl;
        videoElement.load();
        videoElement.play().catch(e => console.log('Video autoplay prevented:', e));
        videoInfo = firstBackgroundVideo.attribution;
        updateTrackInfo();
    }
}

/**
 * Function called by the YouTube IFrame API once it's ready
 */
function onYouTubeIframeAPIReady() {
    // Initialize native video background (no YouTube for background)
    initializeBackgroundVideo();

    // Initialize all audio players (still using YouTube for audio)
    loadAllPlayers();

    // Update background video buttons
    updateBackgroundVideoButtons();
}

/**
 * Initialize all audio players
 */
function loadAllPlayers() {
    audioSources.forEach(source => {
        loadPlayerWithFixedVolume(source.id, source.videoId, source.fixedVolume);
    });
}

/**
 * Load player with a fixed volume and no controls
 */
function loadPlayerWithFixedVolume(playerId, videoId, fixedVolume) {
    if (players[playerId]) {
        players[playerId].destroy();
    }

    players[playerId] = new YT.Player(playerId, {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
            autoplay: 0, // Do not autoplay
            controls: 0,
            loop: 1,
            playlist: videoId,
            modestbranding: 1
        },
        events: {
            onReady: function(event) {
                event.target.setVolume(fixedVolume); // Set fixed volume
                hideLoading(playerId); // Hide loading spinner
            },
            onStateChange: onPlayerStateChange,
            onError: function(event) {
                console.error(`Error in player ${playerId}:`, event.data);
                alert(`An error occurred with the ${playerId}. Please try a different video.`);
            }
        }
    });

    showLoading(playerId);
}

/**
 * Sanitize user input (if needed for future enhancements)
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Extract the video ID from the URL (if needed for future enhancements)
 */
function extractVideoID(url) {
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(urlPattern);
    return match ? match[1] : null;
}

/**
 * Handle player state change events
 */
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        event.target.playVideo(); // Loop the video or audio if it ends
    }
}

/**
 * Play a specific track
 */
function playTrack(playerId) {
    const player = players[playerId];
    const button = document.getElementById(`${playerId.replace('Player', 'ToggleButton')}`);
    if (player && player.getPlayerState() !== YT.PlayerState.PLAYING) {
        player.playVideo();
        if (button) {
            button.textContent = 'Pause';
            button.setAttribute('aria-pressed', 'true');
            button.classList.add('active');
        }

        // Update track info
        const source = audioSources.find(src => src.id === playerId);
        if (source) {
            if (source.type === 'music') {
                musicInfo = `<a href="${source.url}" target="_blank" rel="noopener noreferrer">"${source.title}"</a> by ${source.artist}`;
                updateTrackInfo();
            } else if (source.type === 'spoken') {
                wordsInfo = `<a href="${source.url}" target="_blank" rel="noopener noreferrer">"${source.title}"</a> by ${source.artist}`;
                updateTrackInfo();
            }
        }
    }
}

/**
 * Pause a specific track
 */
function pauseTrack(playerId) {
    const player = players[playerId];
    const button = document.getElementById(`${playerId.replace('Player', 'ToggleButton')}`);
    if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        if (button) {
            button.textContent = 'Play';
            button.setAttribute('aria-pressed', 'false');
            button.classList.remove('active');
        }

        // Update track info
        const source = audioSources.find(src => src.id === playerId);
        if (source) {
            if (source.type === 'music') {
                musicInfo = 'Not playing';
                updateTrackInfo();
            } else if (source.type === 'spoken') {
                wordsInfo = 'Not playing';
                updateTrackInfo();
            }
        }
    }
}

/**
 * Toggle Play/Pause for individual audio sources
 */
function togglePlayer(playerId) {
    const source = audioSources.find(src => src.id === playerId);
    if (!source) return;

    if (source.type === 'music') {
        if (currentMusic === playerId) {
            pauseTrack(playerId);
            currentMusic = null;
        } else {
            // Pause currently playing music
            if (currentMusic) {
                pauseTrack(currentMusic);
            }
            playTrack(playerId);
            currentMusic = playerId;
        }
    } else if (source.type === 'spoken') {
        if (currentSpoken === playerId) {
            pauseTrack(playerId);
            currentSpoken = null;
        } else {
            // Pause currently playing spoken word
            if (currentSpoken) {
                pauseTrack(currentSpoken);
            }
            playTrack(playerId);
            currentSpoken = playerId;
        }
    } else if (source.type === 'sfx') {
        if (playingSfx.has(playerId)) {
            pauseTrack(playerId);
            playingSfx.delete(playerId);
        } else {
            playTrack(playerId);
            playingSfx.add(playerId);
        }
    }
}

/**
 * Master toggle for Play/Pause Button
 */
function togglePlayStop() {
    const playStopButton = document.getElementById('playStopButton');
    const isPlaying = playStopButton.textContent === 'Pause';

    if (isPlaying) {
        stopAll();
        playStopButton.textContent = 'Play';
    } else {
        playAll();
        playStopButton.textContent = 'Pause';
    }
}

/**
 * Play all SFX and resume previously playing music and spoken word tracks
 */
function playAll() {
    if (tracksPlayingBeforeStop.size > 0) {
        tracksPlayingBeforeStop.forEach(trackId => {
            playTrack(trackId);
            const source = audioSources.find(src => src.id === trackId);
            if (source) {
                if (source.type === 'music') {
                    currentMusic = trackId;
                } else if (source.type === 'spoken') {
                    currentSpoken = trackId;
                } else if (source.type === 'sfx') {
                    playingSfx.add(trackId);
                }
            }
        });
        tracksPlayingBeforeStop.clear();
    } else {
        // If no tracks were playing before, start default tracks

        // Play all SFX tracks
        const sfxTracks = audioSources.filter(source => source.type === 'sfx');
        sfxTracks.forEach(source => {
            playTrack(source.id);
            playingSfx.add(source.id);
        });

        // Play one random music track
        const musicTracks = audioSources.filter(source => source.type === 'music');
        if (musicTracks.length > 0) {
            const randomMusic = musicTracks[Math.floor(Math.random() * musicTracks.length)];
            playTrack(randomMusic.id);
            currentMusic = randomMusic.id;
        }

        // Play one random spoken word track
        const spokenTracks = audioSources.filter(source => source.type === 'spoken');
        if (spokenTracks.length > 0) {
            const randomSpoken = spokenTracks[Math.floor(Math.random() * spokenTracks.length)];
            playTrack(randomSpoken.id);
            currentSpoken = randomSpoken.id;
        }

        // Note: Background video continues playing regardless
    }

    // Update Play/Pause button to "Pause"
    document.getElementById('playStopButton').textContent = 'Pause';
}

/**
 * Stop all audio sources and remember which ones were playing
 */
function stopAll() {
    // Record which tracks are currently playing
    tracksPlayingBeforeStop.clear();

    // Pause all SFX tracks that are playing
    playingSfx.forEach(trackId => {
        pauseTrack(trackId);
        tracksPlayingBeforeStop.add(trackId);
    });
    playingSfx.clear();

    // Pause currently playing music track
    if (currentMusic) {
        pauseTrack(currentMusic);
        tracksPlayingBeforeStop.add(currentMusic);
        // Do not reset currentMusic to null
    }

    // Pause currently playing spoken word track
    if (currentSpoken) {
        pauseTrack(currentSpoken);
        tracksPlayingBeforeStop.add(currentSpoken);
        // Do not reset currentSpoken to null
    }

    // Note: Background video continues playing regardless

    // Update Play/Pause button to "Play"
    document.getElementById('playStopButton').textContent = 'Play';
}

/**
 * Shuffle functionality: randomly select one music, one spoken word track, and one background video
 */
function shuffleTracks() {
    // Shuffle Music
    const musicTracks = audioSources.filter(source => source.type === 'music');
    if (musicTracks.length === 0) {
        console.warn('No music tracks available to shuffle.');
        return;
    }
    const randomMusic = musicTracks[Math.floor(Math.random() * musicTracks.length)];

    // Shuffle Spoken Word
    const spokenTracks = audioSources.filter(source => source.type === 'spoken');
    if (spokenTracks.length === 0) {
        console.warn('No spoken word tracks available to shuffle.');
        return;
    }
    const randomSpoken = spokenTracks[Math.floor(Math.random() * spokenTracks.length)];

    // Shuffle Background Video
    shuffleBackgroundVideo();

    // Ensure that a track is selected for each type
    if (!randomMusic || !randomSpoken) {
        console.error('Shuffle failed to select one track of each type.');
        return;
    }

    // Pause currently playing music track if different
    if (currentMusic && currentMusic !== randomMusic.id) {
        pauseTrack(currentMusic);
    }

    // Pause currently playing spoken word track if different
    if (currentSpoken && currentSpoken !== randomSpoken.id) {
        pauseTrack(currentSpoken);
    }

    // Play shuffled music track
    playTrack(randomMusic.id);
    currentMusic = randomMusic.id;

    // Play shuffled spoken word track
    playTrack(randomSpoken.id);
    currentSpoken = randomSpoken.id;

    // Play all SFX tracks
    const sfxTracks = audioSources.filter(source => source.type === 'sfx');
    sfxTracks.forEach(source => {
        if (!playingSfx.has(source.id)) {
            playTrack(source.id);
            playingSfx.add(source.id);
        }
    });

    // Update background video buttons
    updateBackgroundVideoButtons();

    // Update Play/Pause button to "Pause" if not already
    const playStopButton = document.getElementById('playStopButton');
    if (playStopButton.textContent !== 'Pause') {
        playStopButton.textContent = 'Pause';
    }
}


/**
 * Function to shuffle background video
 */
function shuffleBackgroundVideo() {
    const randomVideo = backgroundVideos[Math.floor(Math.random() * backgroundVideos.length)];
    if (currentBackgroundVideo !== randomVideo.id) {
        changeBackgroundVideo(randomVideo.videoUrl);
        currentBackgroundVideo = randomVideo.id;
    }
}

/**
 * Function to change the background video
 */
function changeBackgroundVideo(videoUrl) {
    const videoElement = document.getElementById('video-container');
    const videoSource = document.getElementById('video-source');
    const video = backgroundVideos.find(v => v.videoUrl === videoUrl);

    if (video) {
        videoInfo = video.attribution;
        updateTrackInfo();
    }

    videoSource.src = videoUrl;
    videoElement.load();
    videoElement.play().catch(e => console.log('Video play prevented:', e));

    // Update background video buttons
    updateBackgroundVideoButtons();
}


/**
 * Update background video buttons to reflect current selection
 */
function updateBackgroundVideoButtons() {
    backgroundVideos.forEach((video, index) => {
        const toggleButtonId = `backgroundToggleButton${index + 1}`;
        const toggleButton = document.getElementById(toggleButtonId);
        if (toggleButton) {
            if (currentBackgroundVideo === video.id) {
                toggleButton.textContent = 'Playing';
                toggleButton.disabled = true;
                toggleButton.classList.add('active');
            } else {
                toggleButton.textContent = 'Play';
                toggleButton.disabled = false;
                toggleButton.classList.remove('active');
            }
        }
    });
}

/**
 * Function to toggle the SFX menu
 */
function toggleSFXMenu() {
    const sfxMenu = document.getElementById('sfx-menu');
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    sfxMenu.classList.toggle('show');

    if (sfxMenu.classList.contains('show')) {
        hamburgerIcon.innerHTML = '&times;'; // Change to "X" icon
    } else {
        hamburgerIcon.innerHTML = '&#9776;'; // Change back to hamburger icon
    }
}

/**
 * Handle window resize (native video handles this via CSS object-fit)
 */
function onResize() {
    // Native video element uses CSS object-fit: cover for responsive sizing
    // No JavaScript resizing needed
}

/**
 * Show and hide loading indicators
 */
function showLoading(playerId) {
    const spinnerId = `${playerId.replace('Player', 'LoadingSpinner')}`;
    const spinner = document.getElementById(spinnerId);
    if (spinner) spinner.style.display = 'block';
}

function hideLoading(playerId) {
    const spinnerId = `${playerId.replace('Player', 'LoadingSpinner')}`;
    const spinner = document.getElementById(spinnerId);
    if (spinner) spinner.style.display = 'none';
}

/**
 * Initialize music URL inputs (if any)
 */
function initializeMusicInputs() {
    // If you have inputs for custom music URLs, you can initialize them here
}

/* Full-Screen Toggle Functionality */

function toggleFullScreen() {
    const fullscreenIcon = document.getElementById('fullscreenIcon');
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    if (!document.fullscreenElement) {
        // Enter full-screen
        document.documentElement.requestFullscreen().catch((err) => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
        // Toggle FontAwesome classes
        fullscreenIcon.classList.remove('fa-expand');
        fullscreenIcon.classList.add('fa-compress');
        // Update accessibility attributes
        fullscreenToggle.setAttribute('aria-label', 'Exit Full-Screen');
        fullscreenToggle.title = 'Exit Full-Screen';
    } else {
        // Exit full-screen
        document.exitFullscreen();
        // Toggle FontAwesome classes
        fullscreenIcon.classList.remove('fa-compress');
        fullscreenIcon.classList.add('fa-expand');
        // Update accessibility attributes
        fullscreenToggle.setAttribute('aria-label', 'Enter Full-Screen');
        fullscreenToggle.title = 'Enter Full-Screen';
    }
}

// Listen for full-screen change events to update the icon accordingly
document.addEventListener('fullscreenchange', () => {
    const fullscreenIcon = document.getElementById('fullscreenIcon');
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    if (!document.fullscreenElement) {
        fullscreenIcon.classList.remove('fa-compress');
        fullscreenIcon.classList.add('fa-expand');
        fullscreenToggle.setAttribute('aria-label', 'Enter Full-Screen');
        fullscreenToggle.title = 'Enter Full-Screen';
    } else {
        fullscreenIcon.classList.remove('fa-expand');
        fullscreenIcon.classList.add('fa-compress');
        fullscreenToggle.setAttribute('aria-label', 'Exit Full-Screen');
        fullscreenToggle.title = 'Exit Full-Screen';
    }
});

// Event listener for the full-screen toggle
document.getElementById('fullscreen-toggle').addEventListener('click', toggleFullScreen);

/**
 * Event listeners
 */
window.addEventListener('resize', onResize);
document.getElementById('playStopButton').addEventListener('click', togglePlayStop);
document.getElementById('shuffleButton').addEventListener('click', shuffleTracks);
document.querySelector('.hamburger-menu').addEventListener('click', toggleSFXMenu);

// Attach toggle events for all audio sources
function attachToggleEvents() {
    audioSources.forEach(source => {
        const toggleButtonId = `${source.id.replace('Player', 'ToggleButton')}`;
        const toggleButton = document.getElementById(toggleButtonId);
        if (toggleButton) {
            toggleButton.addEventListener('click', () => togglePlayer(source.id));
        }
    });

    // Attach toggle events for background videos
    backgroundVideos.forEach((video, index) => {
        const toggleButtonId = `backgroundToggleButton${index + 1}`;
        const toggleButton = document.getElementById(toggleButtonId);
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                if (currentBackgroundVideo === video.id) {
                    // Do nothing if the same video is selected
                    return;
                } else {
                    changeBackgroundVideo(video.videoUrl);
                    currentBackgroundVideo = video.id;
                    updateBackgroundVideoButtons();
                }
            });
        }
    });
}

/**
 * Initialize everything after DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    generateBackgroundVideos();
    generateAudioSources();
    attachToggleEvents();
    initializeMusicInputs();

    // Show and hide credits modal
    var creditsModal = document.getElementById('creditsModal');
    var showCreditsLink = document.getElementById('showCredits');
    var closeCreditsSpan = document.querySelector('.close-credits');

    showCreditsLink.addEventListener('click', function(event) {
        event.preventDefault();
        creditsModal.style.display = 'block';
    });

    closeCreditsSpan.addEventListener('click', function() {
        creditsModal.style.display = 'none';
    });

    // Close the modal when clicking outside of the credits content
    window.addEventListener('click', function(event) {
        if (event.target == creditsModal) {
            creditsModal.style.display = 'none';
        }
    });
});


let fadeOutTimeout; // Variable to store the timeout reference

// Function to show the black bar immediately and fade it out after 6 seconds
function showTopBar() {
    const topBar = document.getElementById('topBar');
    if (topBar) {
        // Immediately show the black bar
        topBar.style.transition = 'none'; // Disable transition for immediate visibility
        topBar.style.opacity = '1'; // Make the bar fully visible

        // Clear any existing fade-out timeout to prevent early fading
        if (fadeOutTimeout) {
            clearTimeout(fadeOutTimeout);
        }

        // Allow the fade-out transition after a small delay
        setTimeout(() => {
            topBar.style.transition = 'opacity 2s ease-in-out'; // Re-enable smooth transition for fading out

            // Set a new fade-out timeout
            fadeOutTimeout = setTimeout(() => {
                topBar.style.opacity = '0'; // Set opacity to 0 to fade it out
            }, 6000); // 6000 milliseconds = 6 seconds
        }, 50); // Small delay to re-enable transition for fade-out
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Show the top bar when the page first loads and fade it after 6 seconds
    showTopBar();

    // Event listener for the shuffle button
    const shuffleButton = document.getElementById('shuffleButton');
    if (shuffleButton) {
        shuffleButton.addEventListener('click', () => {
            showTopBar(); // Show the black bar each time the shuffle button is clicked
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {
    // Event listener for the info button
    const infoToggle = document.getElementById('info-toggle');
    const trackInfo = document.getElementById('track-info');

    if (infoToggle && trackInfo) {
        let infoVisible = false; // Track whether the info is currently visible

        infoToggle.addEventListener('click', () => {
            if (!infoVisible) {
                // Show track info
                trackInfo.style.opacity = '1';
                trackInfo.style.pointerEvents = 'auto'; // Enable interaction when visible
                infoToggle.setAttribute('aria-label', 'Hide Track Info');
                infoToggle.title = 'Hide Track Info';
            } else {
                // Hide track info
                trackInfo.style.opacity = '0';
                trackInfo.style.pointerEvents = 'none'; // Prevent interaction when hidden
                infoToggle.setAttribute('aria-label', 'Show Track Info');
                infoToggle.title = 'Show Track Info';
            }
            infoVisible = !infoVisible; // Toggle the visibility state
        });
    }

    // Event listener for the shuffle button to also show track info temporarily
    const shuffleButton = document.getElementById('shuffleButton');
    if (shuffleButton) {
        shuffleButton.addEventListener('click', () => {
            // Show the track info temporarily for 6 seconds when shuffle is clicked
            if (trackInfo) {
                trackInfo.style.opacity = '1';
                trackInfo.style.pointerEvents = 'auto';

                setTimeout(() => {
                    if (!infoVisible) { // Only fade out if not manually revealed
                        trackInfo.style.opacity = '0';
                        trackInfo.style.pointerEvents = 'none';
                    }
                }, 6000); // 6000 milliseconds = 6 seconds
            }
        });
    }
});

