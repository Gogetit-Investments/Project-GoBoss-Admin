import { useState, useEffect } from 'react';
import cookies from 'js-cookie';

const MyForm = () => {
  const [formData, setFormData] = useState({
    shop_id: 9,
    type_id: 1,
    product_type: 'simple',
    unit: '',
    name: '',
    price: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const authCredCookie = cookies.get('AUTH_CRED'); // Retrieve cookie value
      if (!authCredCookie) {
        // Handle case where cookie is not found
        console.error('Cookie not found');
        return;
      }
  
      const authCred = JSON.parse(authCredCookie); // Parse cookie value as JSON
      const token = authCred.token; // Extract the token property
      const permissions = authCred.permissions; // Extract the permissions property
  
      if (!token) {
        // Handle case where token is not found in the cookie
        console.error('Token not found in cookie');
        return;
      }
  
      const response = await fetch('http://localhost:8000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Permissions: permissions.join(',')
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        // Handle successful submission
        console.log('Form submitted successfully');
      } else {
        // Handle error
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="email">Price:</label>
        <input
          type="text"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="unit">Unit:</label>
        <textarea id="unit" name="unit" value={formData.unit} onChange={handleChange} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
