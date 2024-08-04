import { sql } from '@vercel/postgres';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import errorHandler from '../middleware/errorHandler';

const handler = withApiAuthRequired(async function profile(req, res) {  


  var isDev = false;

  const session = await getSession(req, res);
    const userInfo = session?.user;

    //console.log("Starting handler function.");

    try {
        //console.log("Event received:", JSON.stringify(req.body, null, 2));


        //console.log("User ID obtained:", userInfo.sub);

        // Check if user exists in the database
        const userCheckQuery = sql`SELECT * FROM Users WHERE auth0id = ${userInfo.sub}`;
        const userCheckResult = await userCheckQuery;

        //console.log("User check query result:", JSON.stringify(userCheckResult, null, 2));

        const users = userCheckResult.rows;

        if (users.length > 0) {
            //console.log("User found, returning data.");
            const user = users[0];
            console.log("User found, ",user);

            user.plan_type = await getProfilePlan(user.user_id);
            user.badges = await loadBadges(user.user_id);
            user.journeyStatus = user.journeystatus;
            return res.status(200).json(user);
        } else {
            const insertUserQuery = sql`
            INSERT INTO Users (auth0id, Details)
            VALUES (${userInfo.sub}, ${JSON.stringify(userInfo)})
            RETURNING user_id; 
        `;
        const insertedUserResult = await insertUserQuery;
        const insertedUserId = insertedUserResult.rows[0].user_id;
        
        // After obtaining the userId, fetch the full user record
        const fetchNewUserQuery = sql`SELECT * FROM Users WHERE user_id = ${insertedUserId}`;
        const newUserResult = await fetchNewUserQuery;
        
        const newUser = newUserResult.rows[0];
        
        // Assume getProfilePlan and loadBadges are asynchronous and properly handle userId
        newUser.plan_type = await getProfilePlan(insertedUserId);
        newUser.badges = await loadBadges(insertedUserId);
        console.log("newUser " + newUser);

        // Return the fully formed new user object
        return res.status(201).json(newUser);
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
            stack: error.stack,
            status: 500
        });
    }
});
async function getProfilePlan(userid) {
    console.log("getting plan of " + userid);
    const query = sql`SELECT plan_type, untilWhen FROM subscriptions WHERE user_id = ${userid}`;
    const resultsResponse = await query;
    console.log("results count " + resultsResponse.rows.length);
    console.log(resultsResponse.rows);

    if (resultsResponse.rows) {
        const results = resultsResponse.rows;
        //console.log(results);
        if (Array.isArray(results)) {
            for (const row of results) {
                const plan = row.plan_type;
                const untilWhen = new Date(row.untilwhen);

                if (new Date() < untilWhen) {
                    return plan;
                }
            }
        }
    }

    return "free";
}

async function loadBadges(userid) {
    const query = sql`
        SELECT j.journey_id, j.topic, j.imageUrl, j.description, jc.completedAt 
        FROM Journeys j, JourneyCompletion jc
        WHERE j.journey_id = jc.journey_id AND jc.user_id = ${userid}`;
    const resultsResponse = await query;

    if (resultsResponse.rows) {
        const results = resultsResponse.rows;
        if (Array.isArray(results)) {
            const badges = [];
            for (const row of results) {
                badges.push({
                    id: row.journey_id,
                    img: row.imageUrl,
                    journeyName: row.topic,
                    CompletedAt: new Date(row.completedAt)
                });
            }
            return badges;
        }
    }

    return [];
}
export default errorHandler(handler);

