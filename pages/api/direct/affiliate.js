import { sql } from '@vercel/postgres';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import errorHandler from '../middleware/errorHandler';

const handler = withApiAuthRequired(async function (req, res) {
    if (req.method !== 'POST') {
        console.log("Received non-POST request, method: ", req.method);
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const session = await getSession(req, res);
        if (!session || !session.user) {
            console.log("No user session available");
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        console.log("Session found, user info: ", session.user);

        const { name, email, website, phone, message } = req.body;
        console.log("Received form data: ", { name, email, website, phone, message });

        // Ensure table exists
        // const tableCreationResult = await sql`
        //     CREATE TABLE IF NOT EXISTS Affiliates (
        //         id SERIAL PRIMARY KEY,
        //         name VARCHAR(255),
        //         email VARCHAR(255),
        //         website VARCHAR(255),
        //         phone VARCHAR(255),
        //         message TEXT,
        //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        //     )
        // `;
        // console.log("Table creation or verification result: ", tableCreationResult.command);

        // Insert the new affiliate into the database
        const insertResult = await sql`
            INSERT INTO Affiliates (name, email, website, phone, message)
            VALUES (${name}, ${email}, ${website}, ${phone}, ${message})
            RETURNING id
        `;
        console.log("Insert result: ", insertResult);

        if (insertResult.rowCount !== 1) {
            console.log("Insert operation failed, result count: ", insertResult.rowCount);
            throw new Error('Insert operation did not complete as expected.');
        }

        console.log("Affiliate added successfully, new ID: ", insertResult.rows[0].id);
        return res.status(201).json({ message: 'Affiliate added successfully', id: insertResult.rows[0].id,success:true });
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message,success:false });
    }
});

export default errorHandler(handler);
