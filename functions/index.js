/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(); 
const db = admin.firestore();
const auth = admin.auth();

// Create a new product
exports.createProduct = functions.https.onCall(async (data, context) => {
  try {
    // Validate data (name, description, price, etc.)
    const productRef = await db.collection('products').add(data);
    return { productId: productRef.id };
  } catch (error) {
    console.error("Error creating product:", error);
    throw new functions.https.HttpsError('internal', 'Error creating product.'); 
  }
});

// Get a product by ID
exports.getProduct = functions.https.onCall(async (data, context) => {
  try {
    const productDoc = await db.collection('products').doc(data.productId).get();
    if (!productDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Product not found.');
    }
    return productDoc.data();
  } catch (error) { 
    console.error("Error getting product:", error);
    throw new functions.https.HttpsError('internal', 'Error getting product.');
  }
});

// ... (similar functions for updating and deleting products)

// Create a new order
exports.createOrder = functions.https.onCall(async (data, context) => {
    try {
      // Validate order data (items, shipping address, etc.)
      const orderRef = await db.collection('orders').add(data); 
      // Update inventory (decrease stock for ordered items)
      // ... (implementation for inventory updates) 
      return { orderId: orderRef.id }; 
    } catch (error) { 
      console.error("Error creating order:", error);
      throw new functions.https.HttpsError('internal', 'Error creating order.');
    }
  });


 

// Create a new user (with custom claims for roles)
exports.createUser = functions.https.onCall(async (data, context) => {
  try {
    // Validate data (email, password, role)
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password, 
    });

    // Set custom claims for roles (admin, store user, etc.)
    await auth.setCustomUserClaims(userRecord.uid, { role: data.role }); 

    return { uid: userRecord.uid };
  } catch (error) { 
    console.error("Error creating user:", error);
    throw new functions.https.HttpsError('internal', 'Error creating user.');
  }
});


exports.createOrder = functions.https.onCall(async (data, context) => { 
    // ... (order creation logic)
  
    if (data.paymentMethod === 'COD') {
      // Mark the order as "pending COD verification"
      await orderRef.update({ status: 'pendingCODVerification' });
      // ... (potentially send a notification to the admin)
    }
  
    return { orderId: orderRef.id };
  });