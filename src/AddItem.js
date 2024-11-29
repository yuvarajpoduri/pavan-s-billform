import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddItem.css';
import './navbar.css';

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [username, setUsername] = useState('Suresh Poduri');
  const [currentTime, setCurrentTime] = useState('');
  const navigate = useNavigate();

  // Set the current time in the navbar when the component mounts
  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString();
      setCurrentTime(time);
    };
    setInterval(updateTime, 1000); // Update time every second
    updateTime(); // Initial time update
  }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName || !content) {
      alert('Please provide valid item details.');
      return;
    }

    const newItem = {
      name: itemName,
      content: parseFloat(content),
      image, // Save the image URL
    };

    // Retrieve existing items from localStorage
    const existingItems = JSON.parse(localStorage.getItem('items')) || [];
    const updatedItems = [...existingItems, newItem];

    // Save the updated items back to localStorage
    localStorage.setItem('items', JSON.stringify(updatedItems));

    // Redirect to Home
    navigate('/home');
  };

  const handleImageURLChange = (e) => {
    setImage(e.target.value); // Set the image URL
  };

  return (
    <div className="add-item-container">
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="navbar-left">
          <h3>PAVAN'S</h3>
        </div>
        <div className="navbar-right">
          <span>{username}</span>
          <span>{currentTime}</span>
          <button className="btn-small" onClick={() => navigate('/home')}>Home</button>
          <button className="btn-small" onClick={() => navigate('/add-item')}>Add Item</button>
          <button className="btn-small" onClick={() => navigate('/bill-form')}>Bill Form</button>
          <button className="btn-small" onClick={() => { /* handle logout */ }}>Logout</button>
        </div>
      </nav>

      {/* Add Item Form */}
      <div className="form-container">
        <h1>Add Item</h1>
        <form onSubmit={handleAddItem}>
          <div className="form-group">
            <label>Item Name:</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Content (KG):</label>
            <input
              type="number"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="text"
              value={image}
              onChange={handleImageURLChange}
              placeholder="Enter image URL"
            />
          </div>
          <button type="submit" className="primary-btn">Add Item</button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
