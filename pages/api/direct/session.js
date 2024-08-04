import { sql } from '@vercel/postgres';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import errorHandler from '../middleware/errorHandler';

const handler = withApiAuthRequired(async function (req, res) {
    console.log("Starting getSessionHandler function.");

    try {
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

        const { sessionId } = req.query;

        if (!sessionId) {
            return res.status(400).json({ message: 'sessionId is required' });
        }

        // Check profile plan_type in SQL database
        const plan = await getProfilePlan(userId);
        if (plan) {
            const isSessionPermitted = await isPermitted(plan, sessionId);
            if (isSessionPermitted) {
                // Retrieve the session from Vercel Postgres
                const session = await getSessionFromVercelPostgres(Number(sessionId));

                return res.status(200).json(session);
            } else {
                return res.status(403).json({ message: 'Unauthorized' });
            }
        } else {
            return res.status(200).json({ message: 'Please register to access this session.' });
        }

    } catch (error) {
        console.error('Error processing getSessionHandler request:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

async function getProfilePlan(userId) {
    const resultsResponse = await sql`
        SELECT plan_type, untilWhen FROM subscriptions WHERE user_id = ${userId}
    `;
    const results = resultsResponse.rows;

    if (results.length === 0) {
        console.error('No plan found for user:', userId);
        return 'free';
    }

    const plan = results[0].plan_type;
    const untilWhen = new Date(results[0].untilWhen);

    if (new Date() > untilWhen) {
        return 'free';
    }

    return plan;
}

async function isPermitted(plan, sessionId) {
    const unitId = await getSessionUnitID(sessionId);
    const unitDetails = await getUnitByID(unitId);
    const uPlan = unitDetails.permission.toLowerCase();
    const userPlan = plan.toLowerCase();

    if (uPlan === "" || uPlan === "free") {
        return true;
    }

    if (userPlan === "pro") {
        return true;
    }

    if (userPlan === "basic" && (uPlan === "free" || uPlan === "basic")) {
        return true;
    }

    if (userPlan === "free" && uPlan === "free") {
        return true;
    }

    return false;
}

async function getSessionUnitID(sessionId) {
    const resultsResponse = await sql`
        SELECT unit_id FROM sessions WHERE session_id = ${sessionId}
    `;
    const results = resultsResponse.rows;

    if (results.length === 0) {
        console.error('No unit ID found for session:', sessionId);
        throw new Error('No unit ID found for session');
    }

    return results[0].unit_id;
}

async function getUnitByID(unitId) {
    const resultsResponse = await sql`
        SELECT unit_id, level, unicode, topic, stack, imageUrl, concepts, description, permission 
        FROM units 
        WHERE unit_id = ${unitId}
    `;
    const results = resultsResponse.rows;

    if (results.length === 0) {
        console.error('No unit details found for unit ID:', unitId);
        throw new Error('No unit details found for unit ID');
    }

    const unit = {
        id: results[0].unit_id,
        level: results[0].level,
        unicode: results[0].unicode,
        topic: results[0].topic,
        stack: JSON.parse(results[0].stack),
        concepts: JSON.parse(results[0].concepts),
        description: results[0].description,
        permission: results[0].permission
    };

    return unit;
}

async function getSessionFromVercelPostgres(sessionId) {
    console.log('Getting session:', sessionId);
    const resultsResponse = await sql`
        SELECT steps_url FROM sessions WHERE session_id = ${sessionId}
    `;
    const results = resultsResponse.rows;

    if (results.length === 0) {
        console.error('Session not found for sessionId:', sessionId);
        throw new Error('Session not found');
    }
    console.log('steps_url:', results[0].steps_url);
    if (!results[0].steps_url) return {steps: "[{}]"}
    //console.log('Session found:', results[0]);
    return fetchJsonFromBlob(results[0].steps_url);
}


async function fetchJsonFromBlob(url) {
    try {
      const response = await fetch(url); // Fetch the JSON data
      if (!response.ok) { // Check for HTTP errors
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json(); // Parse the JSON data
      console.log({steps: jsonData}); // Output the JSON data to the console
      return {steps: jsonData}; // Return the JSON data
    } catch (error) {
      console.error('Error fetching JSON:', error); // Handle any errors
    }
  }


export default errorHandler(handler);
