import { sql } from '@vercel/postgres';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import errorHandler from '../middleware/errorHandler';

const handler = withApiAuthRequired(async function (req, res) {
    //console.log("Starting getUnitSessionsHandler function.");
    //console.log(req.query);

    try {
        const { unit_id:unitId } = req.query;

        if (!unitId) {
            return res.status(400).json({ message: 'unitId is required' });
        }

        const session = await getSession(req, res);
        const userInfo = session?.user;
        if (!userInfo) {
            //console.log("User information is missing.");
            return res.status(401).json({ message: 'User information is missing.' });
        }

        const sessions = await getUnitSessions(parseInt(unitId, 10));

        return res.status(200).json(sessions);

    } catch (error) {
        console.error('Error processing getUnitSessionsHandler request:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
            stack: error.stack
        });
    }
});

async function getUnitSessions(unitId) {
    const query = sql`
        SELECT title, description, session_id, unit_id, position, unicode, details, type 
        FROM sessions 
        WHERE unit_id = ${unitId}
        ORDER BY position
    `;

    //console.log('Executing query:', query);

    try {
        const resultsResponse = await query;
        const results = resultsResponse.rows;

        if (!Array.isArray(results)) {
            console.error('Results are not an array:', results);
            throw new Error('Expected results to be an array');
        }

        const sessions = results.map(res => ({
            type: res.type,
            unicode: res.unicode,
            Id: parseInt(res.session_id, 10),
            SessionTitle: res.title,
            description: res.description,
            features: JSON.parse(res.details).Goals,
        }));

        return sessions;

    } catch (error) {
        console.error('Error fetching unit sessions:', error);
        throw error;
    }
}

export default errorHandler(handler);
