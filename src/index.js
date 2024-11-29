import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './Login';
import AddItem from './AddItem';
import BillForm from './BillForm';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<App />} />
      <Route path="/add-item" element={<AddItem />} />
      <Route path="/bill-form" element={<BillForm />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
