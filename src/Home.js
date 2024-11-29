import React, { useState, useEffect } from 'react';
import './Home.css';
import './navbar.css'

const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Load items from localStorage when the component mounts
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItems(storedItems);
  }, []);

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const updateItem = (index, updatedContent) => {
    const updatedItems = [...items];
    updatedItems[index].content = updatedContent;
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  return (
    <div className="home-container">
      <h2>Items</h2>
      <div className="card-container">
        {items.map((item, index) => (
          <div className="card" key={index}>
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="card-image"
              />
            )}
            <h3 className="item-name">{item.name}</h3>
            <p className={item.content < 5 ? "red-bold" : "green-bold"}>
              {`Content: ${item.content} KG`}
            </p>
            <div className="buttons-container">
              <button
                className="edit-btn"
                onClick={() => {
                  const updatedContent = prompt("Update content in KG:", item.content);
                  if (updatedContent && !isNaN(updatedContent)) {
                    updateItem(index, parseFloat(updatedContent));
                  }
                }}
              >
                ✏️ Edit
              </button>
              <button className="deletebtn" onClick={() => deleteItem(index)}>
                ❌ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;