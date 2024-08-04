import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { b64, unicode } = req.body;

    const buffer = Buffer.from(b64, 'base64');

    const { url } = await put('images/units/'+unicode+'.png', buffer, {
      access: 'public',  // Change to 'private' when the feature is available
    });
    console.log("unit updated: "+url)
    updateUnit(unicode,url)
    return res.status(200).json({});
  } else {
    console.log(req.method)

    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}



async function updateUnit(unicode, imageUrl) {
    const updateUnitCompletionQuery = sql`
        UPDATE Units
        SET imageUrl = ${imageUrl}
        WHERE unicode = ${unicode}
    `;

    await updateUnitCompletionQuery;

}
