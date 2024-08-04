class ReviewManager {
    constructor() {
        this.events = [];
    }

    addEvent(event) {
        this.events.push(event);
    }

    getReview() {
        return this.events; 
    }
}
module.exports = ReviewManager;
