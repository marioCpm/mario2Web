// levels.js

const levels = {
    1: "Novice",
    2: "Basic",
    3: "Intermediate",
    4: "Advanced",
    5: "Specialist",
    6: "Professional"
  };
  
  /**
   * Retrieves the name of the level by its ID.
   * @param {number} levelId The ID of the level.
   * @returns {string} The name of the level.
   */
  function getLevelNameById(levelId) {
    return levels[levelId] || "Unknown Level"; // Returns "Unknown Level" if ID does not exist
  }
  
  module.exports = { getLevelNameById };