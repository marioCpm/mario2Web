// // pages/api/direct/test.js

// import { list } from '@vercel/blob';
// import { sql } from '@vercel/postgres';

// export default async function handler(req, res) {
//   console.log('starting test2');

//   async function fetchAllRows(prefix, cursor = null, allItems = []) {
//     const response = await list({ prefix, cursor });
//     allItems = allItems.concat(response.blobs);

//     if (response.nextCursor) {
//       return fetchAllRows(prefix, response.nextCursor, allItems);
//     } else {
//       return allItems;
//     }
//   }

//   function extractId(url) {
//     const regex = /sessions\/(.*?)-/;
//     const match = url.match(regex);
//     return match ? match[1] : null;
//   }

//   try {
//     // Fetch all files in the 'sessions' folder
//     const fileNames = await fetchAllRows("sessions/2");
//     console.log('Files in folder: ', fileNames);
//     const urlList = fileNames.map(item => item.url);
//     console.log('urlList: ', urlList);
//     console.log('urlList count: ', urlList.length);

//      for (const url of urlList) {
//        try {
//         const sid = extractId(url);
//          console.log(sid+',');

//         if (sid) {
//           // Update the sessions table
//           const { rows } = await sql`UPDATE sessions SET steps_url = ${url} WHERE session_id = ${sid} And steps_url IS NULL`;
//           console.log('Updated session:', sid);
//         } else {
//           console.log(`No ID found in URL: ${url}`);
//         }
//        } catch (error) {
//          console.error(error);
//          return res.status(500).json({ error: 'Internal Server Error' });
//       }
//      }

//     return res.status(200).json({ message: 'Processing completed' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// }