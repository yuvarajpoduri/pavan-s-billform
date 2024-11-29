import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import AddItem from './AddItem';
import BillForm from './BillForm';
import Home from './Home'; // Import Home separately
import './App.css';
import './navbar.css';

const App = () => {
  const username = "Suresh Poduri";
  const [dateTime, setDateTime] = React.useState(new Date());
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    // Clear user session or token if applicable (like localStorage or cookies)
    navigate('/');  // Redirect to the home or login page after logout
  };

  return (
    <div>
      <div className="navbar">
        <div className="navbar-left">
          <h3>PAVAN'S</h3>
        </div>
        <div className="navbar-right">
          <span>{username}</span>
          <span> {dateTime.toLocaleTimeString()}</span>
          <button className="btn-small" onClick={() => navigate('/home')}>Home</button>
          <button className="btn-small" onClick={() => navigate('/add-item')}>Add Item</button>
          <button className="btn-small" onClick={() => navigate('/bill-form')}>Bill Form</button>
          <button className="btn-small" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/bill-form" element={<BillForm />} />
      </Routes>
    </div>
  );
};

export default App;
