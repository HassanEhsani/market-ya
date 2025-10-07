import axios from 'axios';

export const fetchProducts = async () => {
  try {
    const response = await axios.get('http://192.168.x.x:3000/api/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};