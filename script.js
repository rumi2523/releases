// Get all audio elements on the page
const allAudios = document.querySelectorAll('audio');

allAudios.forEach(audio => {
    // 1. Feature: Only play one track at a time
    audio.addEventListener('play', () => {
        allAudios.forEach(otherAudio => {
            if (otherAudio !== audio) {
                otherAudio.pause();
                // Optional: reset others to start
                // otherAudio.currentTime = 0; 
            }
        });
    });

    // 2. Feature: Keybinds (Optional)
    // Allows skipping 10s forward/back with arrow keys if a player is focused
    audio.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') audio.currentTime += 10;
        if (e.key === 'ArrowLeft') audio.currentTime -= 10;
    });
});