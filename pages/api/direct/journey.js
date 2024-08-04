import { sql } from '@vercel/postgres';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import errorHandler from '../middleware/errorHandler';

const handler = withApiAuthRequired(async function (req, res) {
    console.log("Starting getJourneyHandler function.");

    try {
        console.log("Event received:", JSON.stringify(req.query, null, 2));

        const journeyId = parseInt(req.query.journeyId, 10);

        // Get the journey details
        const journeyQuery = sql`
            SELECT journey_id, unicode, topic, imageUrl, description
            FROM Journeys
            WHERE journey_id = ${journeyId}
        `;

        const unitsQuery = sql`
            SELECT u.unit_id, u.unicode, u.topic, u.imageUrl, u.description, u.concepts, u.level, u.permission
            FROM Units u
            INNER JOIN JourneyUnitRelation jur ON u.unit_id = jur.unit_id
            WHERE jur.journey_id = ${journeyId}
            ORDER BY jur.position
        `;

        // console.log("Executing journey query:", journeyQuery);
        const journeyResults = await journeyQuery;
        const journeyData = journeyResults.rows;


        if (journeyData.length === 0) {
            return res.status(404).json({ message: 'Journey not found' });
        }

        const journeyRow = journeyData[0];
        const journey = {
            JourneyId: journeyRow.journey_id,
            Unicode: journeyRow.unicode,
            Topic: journeyRow.topic,
            ImageUrl: journeyRow.imageurl,
            Description: journeyRow.description,
            Units: []
        };

        const unitResults = await unitsQuery;
        const unitData = unitResults.rows;

        unitData.forEach(unitRow => {
            journey.Units.push({
                level: parseInt(unitRow.level, 10),
                id: unitRow.unit_id,
                unicode: unitRow.unicode,
                topic: unitRow.topic,
                imageUrl: unitRow.imageurl,
                description: unitRow.description,
                permission: unitRow.permission,
                concepts: JSON.parse(unitRow.concepts)
            });
        });
        console.log("journey");
        console.log(journey);

        return res.status(200).json(journey);
    } catch (error) {
        console.error('Error processing getJourneyHandler request:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
            stack: error.stack
        });
    }
});

export default errorHandler(handler);
