import { sql } from '@vercel/postgres';
import { getAccessToken, withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import errorHandler from '../middleware/errorHandler';

const handler = withApiAuthRequired(async function getProgressHandler(req, res) {
    //console.log("Starting getProgressHandler function.");

    try {
        //console.log("Event received:", JSON.stringify(req.body, null, 2));

        // Extract and verify the authorization header
        const session = await getSession(req, res);
        const userInfo = session?.user;
        if (!userInfo) {
            //console.log("User information is missing.");
            return res.status(401).json({ message: 'User information is missing.' });
        }

        const userAuthId = userInfo.sub;
        //console.log("User ID obtained:", userAuthId);

        // Check if user exists in the database
        const userCheckResult = await sql`
            SELECT * FROM Users WHERE auth0id = ${userAuthId}
        `;
        //console.log("User check query result:", JSON.stringify(userCheckResult, null, 2));

        const users = userCheckResult.rows;
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userId = users[0].user_id;

        // Load partial progress
        const partialProgress = await loadPartialProgress(userId);

        return res.status(200).json(partialProgress);
    } catch (error) {
        console.error('Error processing getProgressHandler request:', error);
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
        stack: JSON.parse(res.stack),
        concepts: JSON.parse(res.concepts),
        description: res.description
    };
}

export default errorHandler(handler);
