import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app'; 
import firebaseConfig from '../../firebaseConfig'; // Your Firebase config

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function AdminDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
      {/* ... (add UI for managing products, orders, users) */}
    </div>
  );
}

export default AdminDashboard;