import { sql } from '@vercel/postgres';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import errorHandler from '../middleware/errorHandler';

const handler = withApiAuthRequired(async function (req, res) {
    //console.log("Starting getFiltersHandler function.");

    try {
        const filters = [];

        // Fetch stack data
        const stackQuery = sql`
            SELECT StackID, Topic, icon FROM Stack
        `;
        const stackResultsResponse = await stackQuery;
        const stackResults = stackResultsResponse.rows;

        let stack = [];
        if (stackResults && Array.isArray(stackResults)) {
            stack = stackResults.map(res => ({
                id: parseInt(res.stackid, 10),
                title: res.topic,
                icon: res.icon
            }));
        } else {
            console.error('Unexpected stackResults format:', stackResults);
            throw new Error('Unexpected format for stack results');
        }

        // Fetch levels data
        const levelsQuery = sql`
            SELECT LevelID, Topic, icon FROM Levels
        `;
        const levelsResultsResponse = await levelsQuery;
        const levelsResults = levelsResultsResponse.rows;

        let levels = [];
        if (levelsResults && Array.isArray(levelsResults)) {
            levels = levelsResults.map(res => ({
                id: parseInt(res.levelid, 10),
                title: res.topic,
                icon: res.icon
            }));
        } else {
            console.error('Unexpected levelsResults format:', levelsResults);
            throw new Error('Unexpected format for levels results');
        }

        // Add stack filter
        filters.push({
            id: 2,
            title: "STACK",
            items: stack
        });

        // Add levels filter
        filters.push({
            id: 3,
            title: "LEVEL",
            items: levels
        });

        return res.status(200).json(filters);

    } catch (error) {
        console.error('Error processing getFiltersHandler request:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
            stack: error.stack
        });
    }
});

export default errorHandler(handler);
