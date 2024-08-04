import { verifyResponse } from "./expiredTokenRouter";

export const getUserProfile_Test = async () => {
    const res = await fetch('/api/direct/test');
    let profileData = await verifyResponse(res);
    return profileData;
  };


export const getUserProfile = async () => {
    const res = await fetch('/api/direct/profile');

    let profileData = await verifyResponse(res);
    return profileData;
  };

  export const CalculateMilestones = (progress,completed)=> {
    if (!progress) return [];

    // Initialize levels and milestoneLevels
    const milestoneLevels = {
        1: "Novice",
        2: "Basic",
        3: "Intermediate",
        4: "Advanced",
        5: "Specialist",
        6: "Professional"
    };
    const levels = {};
    let total = 0;

    // Group units by their levels and sum completed sessions
    progress.forEach(item => {
        const level = item.unit.level;
        levels[level] = (levels[level] || 0) + item.completedSessions;
    });
    completed.forEach(item => {
        const level = item.unit.level;
        levels[level] = (levels[level] || 0) + item.completedSessions;
    });
    // Calculate milestones
    const milestones = [];
    for (let i = 1; i <= 6; i++) { // Directly loop through 6 levels
        const completedSessions = levels[i] || 0;
        milestones.push({
            milestone: `milestone${i}`,
            completedSessions: completedSessions,
            level: milestoneLevels[i],
            levelIndex: i
        });
        total += completedSessions;

    }

    return (total,milestones);
}

  export const updateProfileDetailsApi = async (nickname,figure_id) => {
    let obj2 = { figure_id ,nickname};
    const url = '/api/direct/updateProfileDetails';
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj2)
        });
        
        const parsedResults = await verifyResponse(res);
        console.log(parsedResults);
    } catch (error) {
        console.log("Error setting results", error);
    }
    return;
};


export const updateProfileFigure = async (figure) => {
    let obj2 = { path3d: figure.path3d,path2d: figure.path2d,figure_id: figure.id };
    const url = '/api/direct/updateProfileFigure';
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj2)
        });
        
        const parsedResults = await verifyResponse(res);
        console.log(parsedResults);
    } catch (error) {
        console.log("Error setting results", error);
    }
    return;
};


export const getUserProgress = async () => {
    const res = await fetch('/api/direct/progress');
    let progressData = await verifyResponse(res);
    return progressData;
};
export const getUserProgressWithRecommended = async () => {
    const res = await fetch('/api/direct/progressWithRecommended');
    let progressData = await verifyResponse(res);
    return progressData;
};
