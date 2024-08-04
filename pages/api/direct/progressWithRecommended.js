import { sql } from '@vercel/postgres';
import { getAccessToken, withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import errorHandler from '../middleware/errorHandler';

const handler = withApiAuthRequired(async function getProgressWithRecommendedHandler(req, res) {
    console.log("Starting getProgressWithRecommendedHandler function.");

    try {
        console.log("Event received:", JSON.stringify(req.body, null, 2));

        // Extract and verify the authorization header
        const session = await getSession(req, res);
        const userInfo = session?.user;
        const userAuthId = userInfo.sub;

        console.log("User ID obtained:", userAuthId);

        // Check if user exists in the database
        const userCheckResult = await sql`
            SELECT * FROM Users WHERE auth0id = ${userAuthId}
        `;
        //console.log("User check query result:", JSON.stringify(userCheckResult, null, 2));

        const users = userCheckResult.rows;
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const userId = users[0].user_id;

        // Load partial progress
        const partialProgress = await loadPartialProgress(userId);

        // Load completed units
        const completedUnits = await loadCompletedUnits(userId);

        // Load recommended units
        const recommendedUnits = await loadRecommended(partialProgress);

        const recommendedJourneys = await loadRecommendedJourneys(completedUnits);
        console.log(JSON.stringify(recommendedJourneys));
        console.log(JSON.stringify("recommendedJourneys"));
        // Calculate stack count
        const stackCount = {};
        completedUnits.forEach(unitProgress => {
            unitProgress.unit.stack.forEach(stack => {
                stackCount[stack] = (stackCount[stack] || 0) + 1;
            });
        });

        return res.status(200).json({
            progress: partialProgress,
            recommended: recommendedUnits,
            completed: completedUnits,
            stackCount: stackCount,
            recommendedJourneys: recommendedJourneys
        });

    } catch (error) {
        console.error('Error processing getProgressWithRecommendedHandler request:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
            stack: error.stack
        });
    }
});

async function loadPartialProgress(userId) {
    const query = sql`
        WITH LatestProgress AS (
            SELECT 
                up.user_id,
                up.session_id,
                up.score,
                up.review,
                up.id,
                up.created_at,
                s.unit_id,
                u.topic AS unit_name,
                ROW_NUMBER() OVER (PARTITION BY up.session_id ORDER BY up.id DESC) AS rn
            FROM 
                userProgress up
            INNER JOIN 
                sessions s ON up.session_id = s.session_id
            INNER JOIN 
                units u ON s.unit_id = u.unit_id
            WHERE 
                up.user_id = ${userId} AND up.status = 'active'
        )
        SELECT 
            user_id,
            session_id,
            score,
            review,
            id,
            created_at,
            unit_id,
            unit_name
        FROM 
            LatestProgress
        WHERE 
            rn = 1
        ORDER BY created_at DESC
    `;

    const querySessions = sql`
        SELECT 
            s.unit_id,
            COUNT(s.session_id) AS total_sessions
        FROM 
            sessions s
        GROUP BY 
            s.unit_id
    `;

    const userProgressResultsResponse = await query;
    const userProgressResults = userProgressResultsResponse.rows || [];

    const sessionResultsResponse = await querySessions;
    const sessionResults = sessionResultsResponse.rows || [];

    //console.log('User Progress Results:', userProgressResults);
    //console.log('Session Results:', sessionResults);

    if (!Array.isArray(userProgressResults) || !Array.isArray(sessionResults)) {
        throw new Error('Expected array response from SQL query');
    }

    const totalSessionsDict = sessionResults.reduce((acc, row) => {
        acc[parseInt(row.unit_id, 10)] = parseInt(row.total_sessions, 10);
        return acc;
    }, {});

    const unitSessions = userProgressResults.reduce((acc, row) => {
        const unitId = parseInt(row.unit_id, 10);
        const unitName = row.unit_name;
        if (!acc[unitId]) {
            acc[unitId] = { unitId, unitName, sessions: [] };
        }
        acc[unitId].sessions.push({
            score: parseInt(row.score, 10),
            session_id: parseInt(row.session_id, 10)
        });
        return acc;
    }, {});

    const userUnitProgressList = await Promise.all(Object.values(unitSessions).map(async unitGroup => {
        const totalSessions = totalSessionsDict[unitGroup.unitId] || 0;
        const completedSessions = unitGroup.sessions.filter(session => session.score > 0).length;
        return {
            score: unitGroup.sessions.reduce((sum, session) => sum + session.score, 0),
            unit_id: unitGroup.unitId,
            unit: await getUnitByID(unitGroup.unitId),
            unit_name: unitGroup.unitName,
            completedSessions: completedSessions,
            totalSessions: totalSessions,
            completed: completedSessions === totalSessions,
            sessions: unitGroup.sessions,
        };
    }));

    return userUnitProgressList;
}

async function loadCompletedUnits(userId) {
    const query = sql`
        SELECT 
            uc.unit_name,
            uc.unit_id,
            uc.completedAt,
            uc.score,
            uc.reviewJson
        FROM 
            UnitCompletion uc
        WHERE 
            uc.user_id = ${userId}
    `;

    const unitResultsResponse = await query;
    const unitResults = unitResultsResponse.rows || [];

    //console.log('Completed Unit Results:', unitResults);

    if (!Array.isArray(unitResults)) {
        throw new Error('Expected array response from SQL query');
    }

    return await Promise.all(unitResults.map(async unitRow => {
        const sessions = JSON.parse(unitRow.reviewjson || '[]');
        const unitId = parseInt(unitRow.unit_id, 10);
        return {
            completedSessions: sessions.length,
            unit: await getUnitByID(unitId),
            unit_id: unitId,
            score: parseInt(unitRow.score, 10),
            unit_name: unitRow.unit_name,
            completedAt: new Date(unitRow.completedAt),
            sessions: sessions
        };
    }));
}

async function loadRecommendedJourneys(completedUnits) {
    let query = sql`
        SELECT j.journey_id, j.unicode, j.topic, j.imageurl, j.description
        FROM Journeys j
        ORDER BY RANDOM() LIMIT ${6}
    `;



    const resultsResponse = await query;
    const results = resultsResponse.rows || [];

    const journeys = await Promise.all(results.map(async journey => ({
        journey_id: journey.journey_id,
        journey: await getJourneyNoUnits(journey.journey_id),
        units: await getJourneyUnits(journey.journey_id),
        completedUnits: []
    })));

    return journeys;
}
async function getJourneyUnits(journeyId) {

    const unitsInJourneyResults = await sql`
    SELECT unit_id
    FROM JourneyUnitRelation
    WHERE journey_id = ${journeyId}
        `;
    const unitsInJourney = unitsInJourneyResults.rows.map(row => row.unit_id);
    return unitsInJourney;
}
async function getJourneyNoUnits(journeyId) {

    const results = await sql`
        SELECT journey_id, unicode, topic, imageUrl, description
        FROM Journeys
        WHERE journey_id = ${journeyId}
    `;
    const journeyRow = results.rows[0];
console.log(journeyRow)
    return {
        journey_id: journeyRow.journey_id,
        unicode: journeyRow.unicode,
        topic: journeyRow.topic,
        imageurl: journeyRow.imageurl,
        description: journeyRow.description
    };
}


async function loadRecommended(progress) {
    const unitIds = progress.map(p => p.unit_id);
    const maxRecommended = 6;
    let query;

    if (unitIds.length === 0) {
        query = sql`
            SELECT u.unit_id, u.unicode, u.topic, u.imageUrl, u.description, u.permission 
            FROM Units u
            WHERE u.level = 1 
            ORDER BY RANDOM() LIMIT ${maxRecommended}
        `;
    } else {
        query = sql`
            SELECT u.unit_id, u.unicode, u.topic, u.imageUrl, u.description, u.permission 
            FROM Units u
            INNER JOIN (
                SELECT DISTINCT u2.unit_id
                FROM conceptUnitRelation cu
                INNER JOIN conceptUnitRelation cu2 ON cu.ConceptId = cu2.ConceptId
                INNER JOIN Units u2 ON cu2.UnitID = u2.unit_id
                WHERE cu.UnitID = ANY (${unitIds})
                UNION
                SELECT DISTINCT u2.unit_id
                FROM stackUnitRelation su
                INNER JOIN stackUnitRelation su2 ON su.StackId = su2.StackId
                INNER JOIN Units u2 ON su2.UnitID = u2.unit_id
                WHERE su.UnitID = ANY (${unitIds})
            ) AS relatedUnits ON u.unit_id = relatedUnits.unit_id
            WHERE u.unit_id != ALL (${unitIds})
            ORDER BY RANDOM() LIMIT ${maxRecommended}
        `;
    }

    const unitsResultsResponse = await query;
    const unitsResults = unitsResultsResponse.rows || [];


    if (!Array.isArray(unitsResults)) {
        throw new Error('Expected array response from SQL query');
    }

    return unitsResults.map(unit => ({
        id: unit.unit_id.toString(),
        unicode: unit.unicode,
        topic: unit.topic,
        imageUrl: unit.imageurl,
        description: unit.description,
        permission: unit.permission
    }));
}
async function getUnitByID(unitId) {
    const query = sql`
        SELECT 
            unit_id,
            level,
            unicode,
            topic,
            stack,
            imageUrl,
            concepts,
            description
        FROM 
            units
        WHERE 
            unit_id = ${unitId}
    `;

    const unitResultResponse = await query;
    const unitResults = unitResultResponse.rows || [];

    //console.log('Unit Results:', unitResults);

    if (!Array.isArray(unitResults) || unitResults.length === 0) {
        throw new Error(`Unit with ID ${unitId} not found.`);
    }

    const res = unitResults[0];
    return {
        id: unitId.toString(),
        level: parseInt(res.level, 10),
        unicode: res.unicode,
        topic: res.topic,
        stack: JSON.parse(res.stack || '[]'),
        concepts: JSON.parse(res.concepts || '[]'),
        description: res.description
    };
}

export default errorHandler(handler);
