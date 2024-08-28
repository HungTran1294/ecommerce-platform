import React, { useState, useEffect } from 'react'; 
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebaseConfig'; 

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

function Home() {
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
      <h1>Welcome to Our Store!</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <img src={product.imageUrl} alt={product.name} width="100" />
            {product.name} - ${product.price} 
            {/* ... (Add to Cart button, etc.) */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;