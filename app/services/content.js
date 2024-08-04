import { verifyResponse } from "./expiredTokenRouter";

export const publishTempUnit = async (unit,sessions) => {
    unit.sessions = sessions

    let obj2 = { unit };
    const url = '/api/direct/PublishUnit';
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

export const saveTempUnit = async (unit,sessions) => {
    unit.sessions = sessions

    let obj2 = { unit };
    const url = '/api/direct/saveTempUnit';
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
export const getJourney = async (journeyId) => {
    // Pass unit_id as a query parameter to your Next.js API
    const res = await fetch(`/api/direct/journey?journeyId=${journeyId}`);
    const data = await verifyResponse(res);

    return data;
};

export const getSession = async (sessionId) => {
    // Pass unit_id as a query parameter to your Next.js API
    const res = await fetch(`/api/direct/session?sessionId=${sessionId}`);
    const sessionData = await verifyResponse(res);
    console.log("sessionData");
    console.log(sessionData);
    let data = {
        "data": sessionData, "session_id": sessionId
    }
    return data;

};

export const getSessionsOfUnit = async (unit_id) => {
    // Pass unit_id as a query parameter to your Next.js API
    const res = await fetch(`/api/direct/sessions?unit_id=${unit_id}`);
    const sessionsData = await verifyResponse(res);
    return sessionsData
};

export const getFilters = async () => {
    const res = await fetch('/api/direct/filters');
    const filtersData = await verifyResponse(res);
    return filtersData;
};


export const getMyTempUnits = async (userid) => {

    const queryParams = new URLSearchParams({
        userid,
        page: 1
    }).toString();
    const url = `/api/direct/tempUnitsByUserId?${queryParams}`;
    const res = await fetch(url);

    const parsedResults = await verifyResponse(res);

        
    return parsedResults; // Then set new units

};
export const getMoreMyTempUnits = async (page,units,userid) => {

    const queryParams = new URLSearchParams({
        userid,
        page: page,
       
    }).toString();
    
    const url = `/api/direct/tempUnitsByUserId?${queryParams}`;
    const res = await fetch(url);
    try {
        const units = await verifyResponse(res);
        console.log(units)
            const existingIds = new Set(units.map(unit => unit.id));
            const uniqueNewUnits = units.filter(unit => !existingIds.has(unit.id));

            // Now concatenate the original units array with the unique new units
            const updatedUnits = units.concat(uniqueNewUnits);
            if (uniqueNewUnits.length == 0){
               // alert("no more")
            }
            return updatedUnits;
    } catch {
        console.log("error setting results ", res)
    }
};



export const getUnitsByFilters = async (filterItems) => {
    // Assuming filters is an object with properties that match the expected query parameters
    // Initialize empty arrays for categories, stacks, and levels
    let categories = [];
    let stacks = [];
    let levels = [];
    let concepts = [];

    // Populate arrays based on sid
    filterItems.forEach(item => {
        switch (item.sid) {
            case 1:
                categories.push(item.id);
                break;
            case 2:
                stacks.push(item.id);
                break;
            case 3:
                levels.push(item.id);
                break;
            case 4:
                concepts.push(item.id);
                break;
                
            default:
                // Handle unexpected sid value
                console.log(`Unexpected sid: ${item.sid}`);
                break;
        }
    });

    // Set default values for missing parameters
    const searchPattern = 'defaultPattern';

    const queryParams = new URLSearchParams({
        page: 1,
        searchPattern,
        categories: categories, // Convert array to comma-separated string
        levels: levels,
        stack: stacks,
        concepts: concepts
    }).toString();
    const url = `/api/direct/unitsByFilters?${queryParams}`;
    const res = await fetch(url);

    const parsedResults = await verifyResponse(res);

        
    return parsedResults.units; // Then set new units

};


export const getMoreUnitsByFilters = async (filterItems,page,units) => {
    // Assuming filters is an object with properties that match the expected query parameters
    // Initialize empty arrays for categories, stacks, and levels
    let categories = [];
    let stacks = [];
    let levels = [];
    let concepts = [];

    // Populate arrays based on sid
    filterItems.forEach(item => {
        switch (item.sid) {
            case 1:
                categories.push(item.id);
                break;
            case 2:
                stacks.push(item.id);
                break;
            case 3:
                levels.push(item.id);
                break;
            case 4:
                concepts.push(item.id);
                break;
            default:
                // Handle unexpected sid value
                console.log(`Unexpected sid: ${item.sid}`);
                break;
        }
    });

    // Set default values for missing parameters
    const searchPattern = 'defaultPattern';

    const queryParams = new URLSearchParams({
        page: page,
        searchPattern,
        categories: categories, // Convert array to comma-separated string
        levels: levels,
        stack: stacks,
        concepts: concepts
    }).toString();
    
    const url = `/api/direct/unitsByFilters?${queryParams}`;
    const res = await fetch(url);
    try {
        const parsedResults = await verifyResponse(res);
        console.log(parsedResults.units)
            const existingIds = new Set(units.map(unit => unit.id));
            const uniqueNewUnits = parsedResults.units.filter(unit => !existingIds.has(unit.id));

            // Now concatenate the original units array with the unique new units
            const updatedUnits = units.concat(uniqueNewUnits);
            if (uniqueNewUnits.length == 0){
                //alert("no more")
            }
            return updatedUnits;
    } catch {
        console.log("error setting results ", res)
    }
};