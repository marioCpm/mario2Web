import { sql } from '@vercel/postgres';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import errorHandler from '../middleware/errorHandler';

const handler = withApiAuthRequired(async function (req, res) {
    //console.log("Starting UpdateFeedbackHandler function.");

    try {
        //console.log("Event received:", JSON.stringify(req.body, null, 2));

        const session = await getSession(req, res);
        const userInfo = session?.user;
        if (!userInfo) {
            //console.log("User information is missing.");
            return res.status(401).json({ message: 'User information is missing.' });
        }
        //console.log("User ID obtained:", userInfo.sub);
        const userAuthId = userInfo.sub;

        // Check if user exists in the database
        const userCheckResult = await sql`
            SELECT * FROM Users WHERE auth0id = ${userAuthId}
        `;
        //console.log("User check query result:", JSON.stringify(userCheckResult, null, 2));

        const users = userCheckResult.rows;
        if (users.length === 0) {
            //console.log("User not found in the database.");
            return res.status(404).json({ message: "User not found" });
        }

        //console.log("User found, updating data...");
        const userId = users[0].user_id;

        const { unit_id, rank, feedback } = req.body;
        //console.log(unit_id, rank, feedback);

        // Update feedback
        await updateFeedback(userId, unit_id, rank, feedback);

        return res.status(200).json({ message: "Feedback updated successfully." });

    } catch (error) {
        console.error('Error processing UpdateFeedbackHandler request:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

async function updateFeedback(userId, unitId, rank, feedback) {
    const updateUnitCompletionQuery = sql`
        UPDATE UnitCompletion
        SET rank = ${rank ?? null}, feedback = ${feedback ?? null}
        WHERE user_id = ${userId} AND unit_id = ${unitId}
    `;

    await updateUnitCompletionQuery;

    const updateUnitRankingQuery = sql`
        UPDATE Units
        SET ranking = (
            SELECT AVG(CAST(rank AS FLOAT))
            FROM UnitCompletion
            WHERE unit_id = ${unitId} AND rank != -1
        )
        WHERE unit_id = ${unitId}
    `;

    await updateUnitRankingQuery;
}

export default errorHandler(handler);
