// utils/sounds.js - Sound manager for custom audio files
class SoundManager {
    constructor() {
        this.sounds = new Map();
        this.isEnabled = true;
        this.volume = 0.7; // Default volume (0-1)
        
    this.preloadSounds();
    }

    preloadSounds() {
        try {
            this.sounds.set('work-complete', new Audio('/assets/sounds/break.mp3'));
            this.sounds.set('break-complete', new Audio('/assets/sounds/work.mp3'));
            
            // Set volume for all sounds
            this.sounds.forEach(audio => {
                audio.volume = this.volume;
                audio.preload = 'auto';
                
                audio.addEventListener('error', (e) => {
                    console.warn('Failed to load sound:', e.target.src);
                });
            });
            
            console.log('Sounds preloaded successfully');
        } catch (error) {
            console.warn('Failed to preload sounds:', error);
        }
    }

    // Play work session completion sound
    async playWorkCompleteSound() {
        if (!this.isEnabled) return;
        
        try {
            const audio = this.sounds.get('work-complete');
            if (audio) {
                // Reset to beginning if already played
                audio.currentTime = 0;
                await audio.play();
                console.log('🔊 Playing work completion sound');
            }
        } catch (error) {
            console.warn('Failed to play work completion sound:', error);
        }
    }

    // Play break completion sound
    async playBreakCompleteSound() {
        if (!this.isEnabled) return;
        
        try {
            const audio = this.sounds.get('break-complete');
            if (audio) {
                audio.currentTime = 0;
                await audio.play();
                console.log('🔊 Playing break completion sound');
            }
        } catch (error) {
            console.warn('Failed to play break completion sound:', error);
        }
    }

    // Test sounds (for settings)
    async testWorkSound() {
        console.log('🔊 Testing work completion sound');
        await this.playWorkCompleteSound();
    }

    async testBreakSound() {
        console.log('🔊 Testing break completion sound');
        await this.playBreakCompleteSound();
    }

    // Enable/disable sounds
    setEnabled(enabled) {
        this.isEnabled = enabled;
        console.log(`🔊 Sounds ${enabled ? 'enabled' : 'disabled'}`);
    }

    // Set volume (0-1)
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.sounds.forEach(audio => {
            audio.volume = this.volume;
        });
        console.log(`🔊 Volume set to ${Math.round(this.volume * 100)}%`);
    }

    // Check if sounds are loaded
    areSoundsLoaded() {
        return Array.from(this.sounds.values()).every(audio => 
            audio.readyState >= 2 // HAVE_CURRENT_DATA
        );
    }

    // Get loading status
    getLoadingStatus() {
        const total = this.sounds.size;
        const loaded = Array.from(this.sounds.values()).filter(audio => 
            audio.readyState >= 2
        ).length;
        
        return { loaded, total, percentage: total > 0 ? (loaded / total) * 100 : 0 };
    }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;
