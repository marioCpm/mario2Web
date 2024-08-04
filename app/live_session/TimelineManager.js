class TimelineManager {
    constructor() {
        this.startTime = 0;
    }

    startTimeline() {
        this.startTime = Date.now();
    }

    getTimestamp() {
        return Date.now() - this.startTime;
    }
    getTimestampFormatted() {
        const elapsed = Date.now() - this.startTime;
        const seconds = Math.floor((elapsed / 1000) % 60);
        const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
        const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
    
        const paddedHours = hours.toString().padStart(2, '0');
        const paddedMinutes = minutes.toString().padStart(2, '0');
        const paddedSeconds = seconds.toString().padStart(2, '0');
    
        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }
    resetTimeline() {
        this.startTimeline(); // Reset by restarting
    }
}
module.exports = TimelineManager;
