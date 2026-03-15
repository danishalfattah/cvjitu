import { adminDb } from "../../lib/firebase-admin";

async function testQuery(userId: string) {
    console.log("Testing query for userId:", userId);
    try {
        const querySnapshot = await adminDb.collection("orders")
            .where("userId", "==", userId)
            .get();
            
        console.log(`Found ${querySnapshot.size} orders`);
        querySnapshot.forEach(doc => {
            console.log(doc.id, "=>", doc.data());
        });
    } catch (e) {
        console.error("Query failed", e);
    }
}

// Example usage if run directly (needs valid userId)
// testQuery("USER_ID_HERE");
