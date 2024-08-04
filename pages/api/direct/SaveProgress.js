import { sql } from '@vercel/postgres';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import errorHandler from '../middleware/errorHandler';

const handler = withApiAuthRequired(async function (req, res) {
    //console.log("Starting SaveProgressHandler function.");

    try {
        //console.log("Event received:", JSON.stringify(req.body, null, 2));

        const session = await getSession(req, res);
        const userInfo = session?.user;
        if (!userInfo) {
            //console.log("User information is missing.");
            return res.status(401).json({ message: 'User information is missing.' });
        }
        //console.log("User ID obtained:", userInfo.sub);

        // Check if user exists in the database
        const userCheckResult = await sql`
            SELECT * FROM Users WHERE auth0id = ${userInfo.sub}
        `;
        const users = userCheckResult.rows;

        if (users.length === 0) {
            //console.log("User not found in the database.");
            return res.status(404).json({ message: "User not found" });
        }

        const userId = users[0].user_id;

        const { review, score, completedSessions, totalSessions, unit_id, sessionId,unitName } = req.body;
        console.log(review, score, completedSessions, totalSessions, unit_id, sessionId,unitName);

        // Save progress
        await saveProgress(sessionId, userId, review, unit_id, totalSessions, completedSessions, score,unitName);
        await updateUserScore(userId);

        return res.status(200).json({ message: "Progress saved successfully." });

    } catch (error) {
        console.error('Error processing SaveProgressHandler request:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

async function saveProgress(sessionId, userId, review, unitId, totalSessions, completedSessions, score,unitName) {
    console.log(sessionId, userId, review, unitId, totalSessions, completedSessions, score,unitName);

    const status = (completedSessions + 1 === totalSessions) ? "history" : "active";
    await sql`
        INSERT INTO userProgress (user_id, session_id, review, score, status)
        VALUES (${userId}, ${sessionId}, ${review}, ${score}, ${status})
    `;
    await incrementParticipationOfSession(sessionId);

    if (completedSessions + 1 === totalSessions) {
        if (await insertUnitCompletion(userId, unitId, null, null,unitName)) {
            await updateSessionsStatus(userId, unitId);
            await incrementParticipationOfUnit(unitId);
            await checkAndUpdateJourneyCompletion(userId, unitId);
        }
    }
}

async function incrementParticipationOfSession(sessionId) {
    await sql`
        UPDATE sessions
        SET participated = participated + 1
        WHERE session_id = ${sessionId}
    `;
}

async function insertUnitCompletion(userId, unitId, rank, feedback,unitName) {
    const checkResult = await sql`
        SELECT COUNT(*) AS count
        FROM UnitCompletion
        WHERE user_id = ${userId} AND unit_id = ${unitId}
    `;
    const checkCount = checkResult.rows[0].count;

    if (checkCount > 0) {
        return false;
    }

    const sessions = await createUnitReview(userId, unitId);
    const reviewJson = JSON.stringify(sessions);
    const score = sessions.reduce((acc, session) => acc + session.score, 0);

    await sql`
        INSERT INTO UnitCompletion (user_id, score, unit_id, reviewJson, rank, feedback,unit_name)
        VALUES (${userId}, ${score}, ${unitId}, ${reviewJson}, ${rank ?? null}, ${feedback ?? null}, ${unitName ?? null})
    `;
    return true;
}

async function createUnitReview(userId, unitId) {
    const results = await sql`
        SELECT up.session_id, up.score, up.created_at
        FROM userProgress up
        INNER JOIN sessions s ON up.session_id = s.session_id
        WHERE up.user_id = ${userId} AND s.unit_id = ${unitId}
    `;
    return results.rows.map(res => ({
        session_id: res.session_id,
        score: res.score,
        completedAt: new Date(res.created_at)
    }));
}

async function updateSessionsStatus(userId, unitId) {
    await sql`
        UPDATE userProgress
        SET status = 'history'
        FROM userProgress up
        INNER JOIN sessions s ON up.session_id = s.session_id
        WHERE up.user_id = ${userId} AND s.unit_id = ${unitId}
    `;
}

async function incrementParticipationOfUnit(unitId) {
    await sql`
        UPDATE units
        SET participated = participated + 1
        WHERE unit_id = ${unitId}
    `;
}

async function checkAndUpdateJourneyCompletion(userId, unitId) {
    const journeyResults = await sql`
        SELECT journey_id, unit_id 
        FROM JourneyUnitRelation
        WHERE unit_id = ${unitId}
    `;
    const completedUnitsResults = await sql`
        SELECT unit_id
        FROM UnitCompletion
        WHERE user_id = ${userId}
    `;
    const completedUnits = new Set(completedUnitsResults.rows.map(row => row.unit_id));

    for (const journey of journeyResults.rows) {
        const journeyId = journey.journey_id;

        const unitsInJourneyResults = await sql`
            SELECT unit_id
            FROM JourneyUnitRelation
            WHERE journey_id = ${journeyId}
        `;
        const unitsInJourney = unitsInJourneyResults.rows.map(row => row.unit_id);

        await updateUserProfileJson(userId, journeyId, unitsInJourney, completedUnits);

        const allUnitsCompleted = unitsInJourney.every(unit => completedUnits.has(unit));
        if (allUnitsCompleted) {
            await sql`
                INSERT INTO JourneyCompletion (journey_id, user_id)
                VALUES (${journeyId}, ${userId})
            `;
        }
    }
}

// async function updateUserProfileJson(userId, journeyId, unitsInJourney, completedUnits) {
//     const journeyStatus = await getUserJourneysStatusesJson(userId);
//     if (!journeyStatus) journeyStatus = {}
//     let journeyFound = false;
//     const allUnitsCompleted = unitsInJourney.every(unit => completedUnits.has(unit));

//     for (let i = 0; i < journeyStatus.length; i++) {
//         if (journeyStatus[i].journey_id === journeyId) {
//             journeyFound = true;
//             if (allUnitsCompleted) {
//                 journeyStatus.splice(i, 1);
//             } else {
//                 journeyStatus[i].units = unitsInJourney;
//                 journeyStatus[i].journey = await getJourneyNoUnits(journeyId);
//                 journeyStatus[i].completedUnits = Array.from(completedUnits).filter(unit => unitsInJourney.includes(unit));
//             }
//             break;
//         }
//     }

//     if (!journeyFound && !allUnitsCompleted) {
//         const newJourney = {
//             journey_id: journeyId,
//             journey: await getJourneyNoUnits(journeyId),
//             units: unitsInJourney,
//             completedUnits: Array.from(completedUnits).filter(unit => unitsInJourney.includes(unit))
//         };
//         journeyStatus.push(newJourney);
//     }

//     await saveUserJourneysStatusesJson(journeyStatus, userId);
// }

// async function getUserJourneysStatusesJson(userId) {
//     const results = await sql`
//         SELECT journeyStatus
//         FROM users
//         WHERE user_id = ${userId}
//     `;
//     return JSON.parse(results.rows[0].journeystatus);
// }

// async function getJourneyNoUnits(journeyId) {
//     const results = await sql`
//         SELECT journey_id, unicode, topic, imageUrl, description
//         FROM Journeys
//         WHERE journey_id = ${journeyId}
//     `;
//     const journeyRow = results.rows[0];
//     return {
//         journey_id: journeyRow.journey_id,
//         unicode: journeyRow.unicode,
//         topic: journeyRow.topic,
//         imageUrl: journeyRow.imageUrl,
//         description: journeyRow.description
//     };
// }

// async function saveUserJourneysStatusesJson(statuses, userId) {
//     await sql`
//         UPDATE users
//         SET journeyStatus = ${JSON.stringify(statuses)}
//         WHERE user_id = ${userId}
//     `;
// }

async function updateUserScore(userId) {
    const results = await sql`
        WITH RecentSessions AS (
            SELECT 
                user_id,
                session_id,
                score,
                created_at,
                ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY created_at DESC) AS rn
            FROM 
                userProgress
            WHERE 
                user_id = ${userId}
        )
        SELECT 
            score
        FROM 
            RecentSessions
        WHERE 
            rn = 1
    `;
    const totalScore = results.rows.reduce((acc, row) => acc + row.score, 0);

    await sql`
        UPDATE users
        SET score = ${totalScore}
        WHERE user_id = ${userId}
    `;
}

export default errorHandler(handler);
