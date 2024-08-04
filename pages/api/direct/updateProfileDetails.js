import { sql } from '@vercel/postgres';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import errorHandler from '../middleware/errorHandler';

const handler = withApiAuthRequired(async function (req, res) {
    console.log("Starting handler function.");

    try {
        console.log("Event received:", JSON.stringify(req.body, null, 2));

        const session = await getSession(req, res);
        const userInfo = session?.user;
        if (!userInfo) {
            console.log("User information is missing.");
            return res.status(401).json({ message: 'User information is missing.' });
        }
        console.log("User ID obtained:", userInfo.sub);

        // Check if user exists in the database
        const userCheckResult = await sql`
            SELECT * FROM Users WHERE auth0id = ${userInfo.sub}
        `;
        //console.log("User check query result:", JSON.stringify(userCheckResult, null, 2));

        const users = userCheckResult.rows;
        if (users.length === 0) {
            console.log("User not found in the database.");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User found, updating data...");
        const userId = users[0].user_id;
        const { figure_id, nickname } = req.body;
        console.log( figure_id, nickname);
        console.log( userId);
        const userUpdateQuery = sql`
            UPDATE Users 
            SET Nickname = ${nickname}, figure = ${figure_id} 
            WHERE user_id = ${userId}
        `;
        await userUpdateQuery;

        console.log("User updated successfully.");
        return res.status(200).json({ message: "User updated successfully" });

    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
            stack: error.stack
        });
    }
});

export default errorHandler(handler);
