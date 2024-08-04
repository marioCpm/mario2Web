import { sql,db } from '@vercel/postgres';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import errorHandler from '../middleware/errorHandler';
const client = await db.connect();

const handler = withApiAuthRequired(async function (req, res) {


        try {
            let { page, searchPattern, levels, stack, userid:userId } = req.query;

            const safeLevels = levels === '' ? []: levels.split(',').map(Number);
            const safeStack = stack === '' ? []: stack.split(',').map(Number);

            searchPattern = '';

            // Handle undefined or "undefined" string values
            const safeSearchPattern = searchPattern && searchPattern !== "undefined" ? searchPattern : "";
            const safeUserId = userId && userId !== "undefined" ? parseInt(userId, 10) : 0;
            // const safeLevels = Array.isArray(levels) ? levels : (levels === '' ? [] : JSON.parse(levels));
            // const safeStack = Array.isArray(stack) ? stack : (stack === '' ? [] : JSON.parse(stack));
            const safePage = parseInt(page, 10) || 1;
            
            const units = await getUnitsByFilters(safeLevels, safeStack, safePage, safeSearchPattern, safeUserId);
            console.log(safeLevels, safeStack, safePage, safeSearchPattern, safeUserId);

            return res.status(200).json({ units });
    
        } catch (error) {
            console.error('Error processing getUnitsByFiltersHandler request:', error);
            return res.status(500).json({
                message: 'Internal Server Error',
                error: error.message,
                stack: error.stack
            });
        }
    });
    
    async function getUnitsByFilters(levels, stacks, page, searchPattern, userId) {
        //console.log(levels, stacks, page, searchPattern, userId);
    
        let query = `
        SELECT DISTINCT u.unit_id, u.topic, u.level, u.unicode, u.imageUrl, u.description, u.stack, u.created_by_figure, u.participated, u.ranking, u.permission 
        FROM units u `;
        
        const params = [];
        let index = 1;
    
        if (stacks.length > 0) {
            query += `JOIN StackUnitRelation sur ON u.unit_id = sur.UnitID `;
        }
    
        query += `WHERE 1=1 `;
    
        if (levels.length > 0) {
            query += `AND u.level IN (${levels.map(() => `$${index++}`).join(', ')}) `;
            params.push(...levels);
        }
    
        if (stacks.length > 0) {
            query += `AND sur.StackID IN (${stacks.map(() => `$${index++}`).join(', ')}) `;
            params.push(...stacks);
        }
    
        if (searchPattern) {
            query += `AND (u.topic LIKE $${index} OR u.unicode LIKE $${index}) `;
            params.push(`%${searchPattern}%`);
            index++;
        }
    
        if (userId > 0) {
            query += `AND u.created_by = $${index} `;
            params.push(userId);
        }
    
        query += `ORDER BY u.unit_id OFFSET $${index} ROWS FETCH NEXT 21 ROWS ONLY;`;
        params.push((page - 1) * 10);
    
        // Log the query and parameters for debugging
        console.log('Executing query:', query);
        console.log('With parameters:', params);
    
       // const resultsResponse = await sql`${query}`;
        const resultsResponse = await client.query(query, params)
        
    
        const results = resultsResponse.rows;
        console.log('Results:', results.length+' Rows');

        if (!Array.isArray(results)) {
            throw new Error('Expected results to be an array');
        }
    
        const units = results.map(res => ({
            ranking: parseFloat(res.ranking),
            participated: parseInt(res.participated, 10),
            created_by_figure: res.created_by_figure,
            id: res.unit_id,
            unicode: res.unicode,
            topic: res.topic,
            level: parseInt(res.level, 10),
            imageUrl: res.imageurl,
            permission: res.permission,
            description: res.description,
            stack: JSON.parse(res.stack)
        }));
    
        return units;
    }
    
    export default errorHandler(handler);
    