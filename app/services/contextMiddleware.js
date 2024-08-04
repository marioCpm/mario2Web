// middleware.js
import React, { useEffect, useState } from 'react';

import { useGlobalContext } from '../context/GlobalContext';
import { getFilters, getJourney, getSession, getSessionsOfUnit } from './content';
import { CalculateMilestones, getUserProfile_Test,getUserProfile, getUserProgress, getUserProgressWithRecommended, updateProfileDetailsApi } from './profile';
import { getReview } from './reviews';

let isFetchingProfile = false;
let isFetchingHome = false;
let isFetchingFilters = false;
let isFetchingProgress = false;

let isFetchingReview = {};
let isFetchingJourney = {};
let isFetchingSession = {};
let isFetchingSessionsOfUnit = {};

const useMiddleware = () => {
    const { globalArguments, updateGlobalArguments } = useGlobalContext();

    const journeyCompletedUnits = (journey) => {

        let jcu = [];
        if (globalArguments?.completedUnits) {
            for (let i = 0; i < globalArguments.completedUnits.length; i++) {
                const unit = globalArguments.completedUnits[i];
                console.log(unit?.unit?.id);
                if (journey?.units && journey.units.includes(unit?.unit?.id)) {
                    jcu.push(unit?.unit?.id);
                }
            }
        }
        return jcu;
    };
    const getDeviceType = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspectRatio = width / height;
        
        if (width <= 480) {
            return 'mobile';
        } else if (width <= 700) {
            return aspectRatio > 1 ? 'mobile_h' : 'tablet';        } 
            else if (width <= 1000) {
            return aspectRatio > 1 ? 'tablet_h' : 'desktop_v';
        } else if (width <= 1400) {
            return aspectRatio > 1 ? 'laptop' : 'desktop_v';
        } else {
            return aspectRatio > 1 ? 'desktop' : 'desktop_v'; // Large screens
        }
    };
    useEffect(() => {
        const handleResize = () => {
            const deviceType = getDeviceType();
            updateGlobalArguments({ deviceType });
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


// INIT FUNCTIONS


    const dynamicStyles = {
        mobile: {2: {  maxWidth: "95%", margin: "8vh 2vh 2vh 2vh"},4:"80px",5:"100%",6:"",8:1,9:1,10:1,11:[],
        12:{marginTop:"180px",height:"15vh"},14:"100%",15:"100%",16:false,17:"10px",18:"20px",19:"100%",20:"100%",21:false,22:"-150px",23:"100%"},
        mobile_h:{2: { maxWidth: "95%", margin: "5vh 5vh 5vh 5vh"}, 3: { zoom:"70%",textAlign: 'center' },5:"50%",6:"flex",8:2,9:1,10:2,11:[],14:"100%",
                  12:{marginTop:"180px",marginBottom:"90px",width:"45vw"},15:"100%",16:false,17:"5px",18:"5px",19:"100%",20:"100%",21:false},
        tablet: {2: { maxWidth: "95%", margin: "5vh 5vh 5vh 5vh"},5:"100%",8:2,9:1,10:1},
        tablet_h:{2: { maxWidth: "95%", margin: "5vh 5vh 5vh 5vh" },5:"50%",7:"80vh",8:3,11:[],16:false},
        laptop: {2: { maxWidth: "65%", margin: "10vh auto" },7:"100%",8:3,10:4},
        desktop: {2: { maxWidth: "45%", margin: "10vh auto" },
                  3: { textAlign: 'center', marginTop: '20px' },4:"55px",5:"30%",6:"",7:"100%",8:3,9:2,10:4,11:[2,3],
                12:{ width: '60%'},14:"80%",15:"50%",16:true,17:"30px",18:"30px",19:"60%",20:"80%",21:true,22:"0px",23:"60%"},
        desktop_v: {},
    };

    const deviceTypePriority = ["mobile", "mobile_h", "tablet", "tablet_h", "laptop", "desktop", "desktop_v"];

    const getDynamicStyle = (key) => {
        let dt = globalArguments?.deviceType;
    
        if (!dt) { dt = "desktop"; }
    
        const index = deviceTypePriority.indexOf(dt);
        if (index === -1) { dt = "desktop"; }
    
        for (let i = index; i < deviceTypePriority.length; i++) {
            const style = dynamicStyles?.[deviceTypePriority[i]]?.[key];
            if (style !== undefined) {
                return style;
            }
        }
    
        return null;
    };
    const figures = [
        {"id": 1, "name": "Motivo", "path3d": "/assets/3dmodels/test2/1.glb", "path2d": "", "description": "Boosts your motivation with positive words and celebrates your progress."},
        {"id": 2, "name": "Simplex", "path3d": "/assets/3dmodels/test2/2.glb", "path2d": "", "description": "Simplifies complex ideas into easy-to-understand concepts."},
        {"id": 3, "name": "Thinko", "path3d": "/assets/3dmodels/test2/3.glb", "path2d": "", "description": "Challenges you with difficult problems to enhance critical thinking."},
        {"id": 5, "name": "Steppo", "path3d": "/assets/3dmodels/test2/5.glb", "path2d": "", "description": "Guides you through tasks one step at a time, ensuring a smooth learning process."},
        {"id": 6, "name": "Creato", "path3d": "/assets/3dmodels/test2/6.glb", "path2d": "", "description": "Makes learning engaging with fun and creative methods."},
        {"id": 8, "name": "Helpo", "path3d": "/assets/3dmodels/test2/8.glb", "path2d": "", "description": "Provides personalized assistance tailored to your learning style."},
        {"id": 14, "name": "Realix", "path3d": "/assets/3dmodels/test2/14.glb", "path2d": "", "description": "Offers practical advice and real-world applications."},
        {"id": 15, "name": "Quizix", "path3d": "/assets/3dmodels/test2/15.glb", "path2d": "", "description": "Tests your knowledge to ensure you grasp the material."},
        {"id": 16, "name": "Creatix", "path3d": "/assets/3dmodels/test2/16.glb", "path2d": "", "description": "Encourages creativity and helps you apply your knowledge innovatively."},
        {"id": 20, "name": "Reflecto", "path3d": "/assets/3dmodels/test2/20.glb", "path2d": "", "description": "Helps you reflect on your learning and learn from any mistakes."}
    ]
    
    const getFigure = (figureId) => {
        return figures.find(figure => figure.id == figureId);
    };
    const getFigures = () => {
        return figures;
    };

    const updateProfileDetails = async (nickname, figure, meshColors) => {
        let profile = globalArguments?.profile;
        if (!profile) return;
        let figureId = figure?.id;
        if (!figureId) figureId = 1;

        updateProfileDetailsApi(nickname,figureId);
        profile.figure = figureId;
        profile.nickname = nickname;
        updateGlobalArguments({ profile });
    };
    const isPermitted = (u_plan) => {
        u_plan = u_plan?.toLowerCase();
        let plan = globalArguments?.profile?.plan_type?.toLowerCase();

        if (u_plan == "") { u_plan = "free"; }
        if (plan == "pro") {
            return true;
        }
        if (plan == "basic" && (u_plan == "free" || u_plan == "basic")) {
            return true;
        }
        if (plan == "free" && u_plan == "free") {
            return true;
        }

        return false;

    };

    const decreaseKey = async () => {
        let profile = globalArguments?.profile
        profile.keys -= 1;
        updateGlobalArguments({ profile });
    };
    const addScore = async (score) => {
        let profile = globalArguments?.profile
        profile.score += score;
        updateGlobalArguments({ profile });
    };


    const initHome = async () => {


        if (!globalArguments?.home && !isFetchingHome) {
            isFetchingHome = true;
            try {

                const response = await fetch('https://raw.githubusercontent.com/galenaiai/galenai_agent/main/home.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const text = await response.text();
                const home = JSON.parse(text);
                updateGlobalArguments({ home });

            } catch (error) {
                console.error("Failed to update home data:", error);
            }
        }
    };


    const initProfile = async () => {


        if (!globalArguments?.profile && !isFetchingProfile) {
            isFetchingProfile = true;
            try {
                let profile = await getUserProfile();
                updateGlobalArguments({ profile });
                await initProgress();

            } catch (error) {
                console.error("Failed to update user profile:", error);
            }
        }
        
    };

    
    const initProfile_Test = async () => {


        if (!globalArguments?.profile && !isFetchingProfile) {
            isFetchingProfile = true;
            try {
                let profile_test = await getUserProfile_Test();
                updateGlobalArguments({ profile_test });

            } catch (error) {
                console.error("Failed to update user profile:", error);
            }
        }
    };
    
    const initFilters = async () => {
        if (!globalArguments?.filters && !isFetchingFilters) {
            isFetchingFilters = true;
            try {
                let filters = await getFilters();
                updateGlobalArguments({ filters });
            } catch (error) {
                console.error("Failed to update filters:", error);
            }
        }
    };

    const initProgress = async () => {
        if (!globalArguments?.progress && !isFetchingProgress) {
            isFetchingProgress = true;
            try {
                let progressWithRecommended = await getUserProgressWithRecommended();
                let milestones = CalculateMilestones(progressWithRecommended.progress, progressWithRecommended.completed);
                updateGlobalArguments({
                    progress: progressWithRecommended.progress,
                    completedUnits: progressWithRecommended.completed,
                    milestones: milestones,
                    totalSessionsCompleted: progressWithRecommended.completed,
                    recommended: progressWithRecommended.recommended,
                    recommendedJourneys: progressWithRecommended.recommendedJourneys,
                    stackCount: progressWithRecommended.stackCount,
                    displayedUnits: globalArguments?.displayedUnits || progressWithRecommended.recommended,
                });
            } catch (error) {
                console.error("Failed to update user progress:", error);
            }
        }
    };

    const initReview = async (sessionId) => {
        if (!globalArguments[`loadedReview_${sessionId}`] && !(isFetchingReview[sessionId])) {
            isFetchingReview[sessionId] = true;
            try {

                let review = await getReview(sessionId);
                updateGlobalArguments({ [`loadedReview_${sessionId}`]: review });
            } catch (error) {
                console.error(`Failed to fetch review for session ${sessionId}:`, error);
            }
        }
    };

    const initJourney = async (journeyId) => {
        if (!globalArguments[`loadedJourney_${journeyId}`] && !(isFetchingJourney[journeyId])) {
            isFetchingJourney[journeyId] = true;

            try {

                let journey = await getJourney(journeyId);
                updateGlobalArguments({ [`loadedJourney_${journeyId}`]: journey });
            } catch (error) {
                console.error(`Failed to fetch review for session ${sessionId}:`, error);
            }
        }
        return globalArguments[`loadedJourney_${journeyId}`];

    };
    const initSession = async (session_id) => {
        if (!globalArguments[`loadedSession_${session_id}`] && !(isFetchingSession[session_id])) {
            isFetchingSession[session_id] = true;

            try {
                let session = await getSession(session_id);
                updateGlobalArguments({ [`loadedSession_${session_id}`]: session });
                return session;
            } catch (error) {
                console.error(`Failed to fetch session ${session_id}:`, error);
            }
        }

        return globalArguments[`loadedSession_${session_id}`];

    };
    const initSessionsOfUnit = async (unitId) => {
        if (!globalArguments[`loadedSessions_${unitId}`] && !(isFetchingSessionsOfUnit[unitId])) {
            isFetchingSessionsOfUnit[unitId] = true;

            try {
                let sessions = await getSessionsOfUnit(unitId);
                for (var ss of sessions) {
                    if (ss?.Id) {
                        // Change the key to 'nickname'
                        ss.id = ss.Id;
                        delete ss.Id;
                    }
                }
                updateGlobalArguments({ [`loadedSessions_${unitId}`]: sessions });
            } catch (error) {
                console.error(`Failed to fetch sessions ${unitId}:`, error);
            }
        }
        return globalArguments[`loadedSessions_${unitId}`];

    };



    // HELPER FUNCTIONS
    const updateUnitWithProgress = (unit, unitProgress) => {
        if (!unitProgress) {
            unitProgress = globalArguments?.progress?.find(progress => progress.unit_id == unit.id);
        }

        if (unitProgress) {
            unit.score = unitProgress.score;
            unit.completed = unitProgress.completed;
            unit.totalSessions = unitProgress.totalSessions;
            unit.completedSessions = unitProgress.completedSessions;
            unit.sessions = unitProgress.sessions;
        }
        updateGlobalArguments({ selectedUnit: unit });
    };

    const getRandomImage = () => {
        const maxImages = 13; // Maximum number of images available
        const imageNumber = Math.floor(Math.random() * maxImages) + 1; // Generate random number between 1 and 13
        return `/assets/images/courseExamples/courseExample${imageNumber}.png`;
    };
    const enhanceUnitsWithImages = (units) => {
        const maxImages = 13;
        return units?.map(unit => ({
            ...unit,
            imageUrl: unit.imageUrl || `/assets/images/courseExamples/courseExample${Math.floor(Math.random() * maxImages) + 1}.png`
        }));
    };
    const getStack = (stackArray) => {
        if (!globalArguments?.filters || !Array.isArray(globalArguments.filters)) return [];
        const stackData = globalArguments?.filters?.find(category => category.title === "STACK");

        if (!stackData) {
            return [];
        }

        return stackData.items.filter(item => stackArray?.includes(item.title));
    };
    const updateNewReviewToUnitProgress = async () => {
        try {
            let progress = await getUserProgress();
            updateGlobalArguments({ progress: progress });
            let unitProgress = progress?.find(progress => progress.unit_id == globalArguments?.selectedUnit?.id);

            updateUnitWithProgress(globalArguments?.selectedUnit, unitProgress)
            return unitProgress.completed;

        } catch (error) {
            console.error("Failed to update user progress:", error);
            return false;
        }
    };

    const AddStatusToSessions = (sessions) => {
        let progress = globalArguments?.selectedUnit?.sessions;

        if (!progress) { progress = [] };
        // Convert sessions_progress array to a Map for quick lookup with scores
        const progressMap = new Map(progress.map(sp => [sp.session_id, sp.score]));

        let foundNext = false;

        for (let session of sessions) {
            if (progressMap.has(session.id)) {
                session.status = "done";
                session.score = progressMap.get(session.id); // Add score to the session object
            } else if (!foundNext) {
                session.status = "next";
                foundNext = true;
            } else {
                session.status = "lock";
            }
        }

        return sessions;
    };


    function interpolateColor(color1, color2, factor) {
        if (arguments.length < 3) {
            factor = 0.5;
        }
        var result = color1.slice();
        for (var i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return result;
    };

    function interpolateColors(colorScale, steps) {
        let scale = [];
        for (let i = 0; i < colorScale.length - 1; i++) {
            let startColor = colorScale[i];
            let endColor = colorScale[i + 1];
            for (let j = 0; j < steps; j++) {
                scale.push(interpolateColor(startColor, endColor, j / steps));
            }
        }
        scale.push(colorScale[colorScale.length - 1]); // make sure to include the last color
        return scale.map(color => `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
    }
    function rgbToHex(rgb) {
        return '#' + rgb.map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    function scaleToGradient(colorScale, orientation = 'to right') {
        const gradientPoints = colorScale.map(color => {
            return rgbToHex(color);
        }).join(', ');

        return `linear-gradient(${orientation}, ${gradientPoints})`;
    }
    const colorScales = {
        forest: [
            [34, 139, 34],  // Forest green
            [85, 107, 47],  // Dark olive green
            [154, 205, 50], // Yellow-green
            [0, 100, 0],    // Dark green
            [107, 142, 35]  // Olive drab
        ],
        desert: [
            [244, 164, 96],  // Sandy brown
            [210, 180, 140], // Tan
            [255, 228, 181], // Moccasin
            [250, 235, 215], // Antique white
            [255, 222, 173]  // Navajo white
        ]
        , deep_sea: [
            [0, 105, 148],   // Deep sky blue
            [0, 51, 102],    // Darker blue
            [72, 61, 139],   // Dark slate blue
            [25, 25, 112],   // Midnight blue
            [70, 130, 180]   // Steel blue
        ], space: [
            [25, 25, 30],    // Almost black
            [75, 0, 130],    // Indigo
            [48, 25, 52],    // Dark purple
            [0, 0, 0],       // Black
            [139, 0, 139]    // Dark magenta
        ], tropic: [
            [255, 165, 0],   // Orange
            [255, 215, 0],   // Gold
            [124, 252, 0],   // Lawn green
            [0, 255, 255],   // Aqua
            [255, 20, 147]   // Deep pink
        ], cyber: [
            [255, 0, 255],   // Magenta
            [0, 255, 0],     // Lime
            [75, 0, 130],    // Indigo
            [0, 255, 255],   // Cyan
            [255, 69, 0]     // Red-orange
        ],

        warm: [[255, 0, 0], [0, 255, 0], [0, 0, 255]],
        cool: [[51, 193, 255], [51, 158, 255], [51, 102, 255]],
        nature: [[76, 175, 80], [139, 195, 74], [205, 220, 57]]
    };

    return {
        journeyCompletedUnits,
        colorScales,
        updateProfileDetails,
        interpolateColors,
        scaleToGradient,
        getDeviceType,
        addScore,
        decreaseKey,
        isPermitted,
        getDynamicStyle,
        getFigure,
        getFigures,
        initHome,
        initProfile,
        initProfile_Test,
        initFilters,
        initReview,
        initJourney,
        initSession,
        initSessionsOfUnit,
        getStack,
        enhanceUnitsWithImages,
        updateUnitWithProgress,
        updateNewReviewToUnitProgress,
        getRandomImage,
        AddStatusToSessions,
        globalArguments,
        updateGlobalArguments// Expose globalArguments to the component
    };
};

export default useMiddleware;