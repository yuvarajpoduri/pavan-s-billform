import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './App.css';

function BillForm() {
  const [entries, setEntries] = useState([]);
  const [shopName, setShopName] = useState('');
  const [city, setCity] = useState('');
  const [amount, setAmount] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  const shopOptions = ['Shop A', 'Shop B', 'Shop C'];
  const cityOptions = ['New York', 'Los Angeles', 'Chicago'];

  const addEntry = (e) => {
    e.preventDefault();
    if (shopName && city && amount.trim() && !isNaN(amount)) {
      setEntries([
        ...entries,
        { shopName, city, amount: parseFloat(amount), isPaid },
      ]);
      setShopName('');
      setCity('');
      setAmount('');
      setIsPaid(false);
    }
  };

  const calculateTotal = (paidStatus) => {
    return entries
      .filter((entry) => entry.isPaid === paidStatus)
      .reduce((sum, entry) => sum + entry.amount, 0)
      .toFixed(2);
  };

  const deleteEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const today = new Date();
    const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

    const tableColumns = ['Shop Name, City', 'Amount Billed', 'Status'];
    const tableRows = entries.map((entry) => [
      `${entry.shopName}, ${entry.city}`,
      entry.amount.toFixed(2),
      entry.isPaid ? 'Paid' : 'Unpaid',
    ]);

    doc.setFontSize(16);
    doc.text("Billing Summary", 105, 10, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`${dayName}, ${date}`, 200, 10, { align: 'right' });

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
      bodyStyles: { textColor: [0, 0, 0] },
    });

    doc.setFontSize(10);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 128, 0);
    doc.text(`Total Paid: ${calculateTotal(true)}`, 20, doc.previousAutoTable.finalY + 10);
    doc.setTextColor(255, 0, 0);
    doc.text(`Total Unpaid: ${calculateTotal(false)}`, 20, doc.previousAutoTable.finalY + 20);

    doc.save(`${today.getDate().toString().padStart(2, '0')}${today.toLocaleString('en-US', { month: 'short' })}${today.getFullYear()}_bill.pdf`);
  };

  return (
    <div className="App">
      <h1 className="form-title">Billing Form</h1>
      <center>
      <form onSubmit={addEntry} className="billing-form">
        <select
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          required
        >
          <option value="" disabled>Select Shop Name</option>
          {shopOptions.map((shop, index) => (
            <option key={index} value={shop}>{shop}</option>
          ))}
        </select>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        >
          <option value="" disabled>Select City</option>
          {cityOptions.map((city, index) => (
            <option key={index} value={city}>{city}</option>
          ))}
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount Billed"
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isPaid}
            onChange={(e) => setIsPaid(e.target.checked)}
          />
          Paid
        </label>
        <button type="submit" className="btn-primary">Add Entry</button>
      </form>
      </center>
      <div className="entries">
        <h2>Entries</h2>
        <table>
          <thead>
            <tr>
              <th>Shop Name, City</th>
              <th>Amount Billed</th>
              <th>Status</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td>{`${entry.shopName}, ${entry.city}`}</td>
                <td
                  style={{
                    color: entry.isPaid ? 'green' : 'red',
                  }}
                >
                  {entry.amount.toFixed(2)}
                </td>
                <td>{entry.isPaid ? 'Paid' : 'Unpaid'}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteEntry(index)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Total Paid: <span style={{ color: 'green' }}>{calculateTotal(true)}</span></h3>
        <h3>Total Unpaid: <span style={{ color: 'red' }}>{calculateTotal(false)}</span></h3>
      </div>

      <div className="download-options">
        <button onClick={generatePDF} className="btn-primary">Download As PDF</button>
      </div>
    </div>
  );
}

export default BillForm;
