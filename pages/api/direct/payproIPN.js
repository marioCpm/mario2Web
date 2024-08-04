import { sql } from '@vercel/postgres';

const handler = async function (req, res) {
    try {

        // Parse the URL-encoded body
        const parsedBody = req.body;

        console.log("Parsed body:", parsedBody);

        let ORDER_ITEM_NAME = parsedBody.ORDER_ITEM_NAME;
        let CUSTOMER_EMAIL = parsedBody.CUSTOMER_EMAIL;
        let ORDER_ID = parsedBody.ORDER_ID;
        let PRODUCT_ID = parsedBody.PRODUCT_ID;
        let ORDER_STATUS = parsedBody.ORDER_STATUS;
        let IPN_TYPE_NAME = parsedBody.IPN_TYPE_NAME;
        let SUBSCRIPTION_ID = parsedBody.SUBSCRIPTION_ID;
        let SUBSCRIPTION_NEXT_CHARGE_DATE = parsedBody.SUBSCRIPTION_NEXT_CHARGE_DATE;
        let ORDER_CUSTOM_FIELDS = parsedBody.ORDER_CUSTOM_FIELDS;

        const pairs = ORDER_CUSTOM_FIELDS.split(',');
        const extractedFields = {};
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            extractedFields[key] = value;
        });

        console.log("Extracted fields:", extractedFields);

        let authID = extractedFields["x-authID"];
        console.log("AuthID:", authID);

        // Check if user exists in the database
        const userCheckResult = await sql`
            SELECT * FROM Users WHERE auth0id = ${authID}
        `;
        console.log("User check query result:", JSON.stringify(userCheckResult, null, 2));

        const users = userCheckResult.rows;

        if (users.length === 0) {
            console.log("User not found in the database.");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User found, updating data...");
        const userId = users[0].user_id;
        console.log("User ID:", userId);

        const isPositiveCase = [
            'OrderCharged', 
            'SubscriptionChargeSucceed', 
            'SubscriptionRenewed'
        ].includes(IPN_TYPE_NAME);

        const isFailureCase = [
            'SubscriptionChargeFailed', 
            'SubscriptionSuspended', 
            'SubscriptionTerminated', 
            'SubscriptionFinished'
        ].includes(IPN_TYPE_NAME);

        let plan = 'free';
        switch(ORDER_ITEM_NAME) {
            case 'Basic-Plan-1Y':
            case 'Basic-Plan-1M':
                plan = 'basic';
                break;
            case 'PRO-Plan-1Y':
            case 'PRO-Plan-1M':
            case 'PRO-Plan-1M-TEST':
                plan = 'pro';
                break;
        }
        console.log("Plan type:", plan);

        if (isPositiveCase) {
            console.log("Handling positive case for subscription ID:", SUBSCRIPTION_ID);
            await upsertSubscription(SUBSCRIPTION_ID, userId, plan, SUBSCRIPTION_NEXT_CHARGE_DATE, {
                ORDER_ITEM_NAME, CUSTOMER_EMAIL, ORDER_STATUS, authID, IPN_TYPE_NAME, ORDER_ID
            });
        } else if (isFailureCase) {
            console.log("Handling failure case for subscription ID:", SUBSCRIPTION_ID);
            // await logSubscriptionFailure(SUBSCRIPTION_ID, IPN_TYPE_NAME);
        }

        console.log("ORDER_ITEM_NAME:", ORDER_ITEM_NAME);
        console.log("CUSTOMER_EMAIL:", CUSTOMER_EMAIL);
        console.log("ORDER_ID:", ORDER_ID);
        console.log("PRODUCT_ID:", PRODUCT_ID);
        console.log("ORDER_STATUS:", ORDER_STATUS);
        console.log("Auth ID:", authID);

        return res.status(200).json('Hello from Next.js API route!');
    } catch (error) {
        console.error('Error parsing event body:', error);
        return res.status(500).json('Internal Server Error');
    }
};

async function upsertSubscription(subscriptionId, userId, planType, nextChargeDate, additionalFields) {
    try {
        console.log("Upserting subscription for user ID:", userId, "with subscription ID:", subscriptionId);
        
        // Ensure nextChargeDate is valid and in the correct format
        const date = new Date(nextChargeDate);
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date format for nextChargeDate: ${nextChargeDate}`);
        }
        const formattedNextChargeDate = date.toISOString().split('T')[0];
        console.log("Formatted nextChargeDate:", formattedNextChargeDate);

        const {
            ORDER_ITEM_NAME, CUSTOMER_EMAIL, ORDER_STATUS, authID, IPN_TYPE_NAME, ORDER_ID
        } = additionalFields;

        // Check if the subscription exists
        const checkResult = await sql`
            SELECT COUNT(*) AS count
            FROM subscriptions
            WHERE user_id = ${userId}
        `;
        console.log("Subscription check result:", checkResult);

        const checkResults = checkResult.rows;
        console.log("Parsed subscription check result:", checkResults);

        if (checkResults[0].count > 0) {
            // Update existing subscription
            console.log("Updating existing subscription");
            await sql`
                UPDATE subscriptions
                SET untilWhen = ${formattedNextChargeDate}, plan_type = ${planType}, subscription_id = ${subscriptionId},
                    ORDER_ITEM_NAME = ${ORDER_ITEM_NAME}, CUSTOMER_EMAIL = ${CUSTOMER_EMAIL}, ORDER_STATUS = ${ORDER_STATUS}, 
                    authID = ${authID}, IPN_TYPE_NAME = ${IPN_TYPE_NAME}, ORDER_ID = ${ORDER_ID}
                WHERE user_id = ${userId}
            `;
            console.log("Subscription updated successfully");
        } else {
            // Insert new subscription
            console.log("Inserting new subscription");
            await sql`
                INSERT INTO subscriptions (user_id, plan_type, untilWhen, subscription_id, ORDER_ITEM_NAME, 
                                           CUSTOMER_EMAIL, ORDER_STATUS, authID, IPN_TYPE_NAME, ORDER_ID)
                VALUES (${userId}, ${planType}, ${formattedNextChargeDate}, ${subscriptionId}, ${ORDER_ITEM_NAME}, 
                        ${CUSTOMER_EMAIL}, ${ORDER_STATUS}, ${authID}, ${IPN_TYPE_NAME}, ${ORDER_ID})
            `;
            console.log("Subscription inserted successfully");
        }
    } catch (error) {
        console.error('Error upserting subscription:', error);
        throw error;
    }
}

// async function logSubscriptionFailure(subscriptionId, failureType) {
//     await sql`
//         INSERT INTO subscription_failures (subscription_id, failure_type)
//         VALUES (${subscriptionId}, ${failureType})
//     `;
// }

export default handler;
