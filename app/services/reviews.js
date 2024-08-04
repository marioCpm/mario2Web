import { verifyResponse } from "./expiredTokenRouter";

export const getReview = async (sessionId) => {
    const res = await fetch(`/api/direct/review?sessionId=${sessionId}`);
    let data = await verifyResponse(res);
    return data;
};
export const saveNewReview = async (sessionId, userid, review,unit_id,totalSessions,completedSessions,score,unitName) => {
    let obj2 = { sessionId, userid, review: JSON.stringify(review),unit_id,totalSessions,completedSessions,score,unitName };
    const url = '/api/direct/SaveProgress';
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

export const updateFeedbackOfUnit = async (userid,unit_id,rank,feedback) => {
    let obj2 = { userid,unit_id,rank,feedback};
    const url = '/api/direct/UpdateFeedback';
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
