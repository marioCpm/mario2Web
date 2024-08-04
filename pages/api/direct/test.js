// pages/api/direct/test.js

import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  try {
    // Fetch rows from the test table
    const { rows } = await sql`Update sessions set steps = ${req.query.steps} where session_id = ${req.query.sid}`;
    console.log("wiwiwiwiwiwiwiwiwi Update sessions")
    // Respond with the rows
    return res.status(200).json({m:"did"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}