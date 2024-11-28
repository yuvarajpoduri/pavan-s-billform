import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './App.css';

function App() {
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

  const generatePDF = (language) => {
    const doc = new jsPDF();

    // Get today's date
    const today = new Date();
    const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

    // Translations
    const translations = {
      EN: {
        title: "PAVAN'S",
        date: `${dayName}, ${date}`,
        shopCity: 'Shop Name, City',
        amount: 'Amount Billed',
        status: 'Status',
        paid: 'Paid',
        unpaid: 'Unpaid',
        totalPaid: 'Total Paid',
        totalUnpaid: 'Total Unpaid',
      },
      TE: {
        title: 'పవన్ యొక్క',
        date: `${dayName}, ${date}`,
        shopCity: 'దుకాణం పేరు, నగరం',
        amount: 'బిల్లు మొత్తం',
        status: 'స్థితి',
        paid: 'చెల్లించబడింది',
        unpaid: 'చెల్లించబడలేదు',
        totalPaid: 'మొత్తం చెల్లింపులు',
        totalUnpaid: 'మొత్తం బకాయిలు',
      },
    };

    const t = translations[language];

    // Add title and date
    doc.setFontSize(16);
    doc.text(t.title, 105, 10, { align: 'center' });
    doc.setFontSize(10);
    doc.text(t.date, 200, 10, { align: 'right' });

    // Table header and data
    const tableColumns = [t.shopCity, t.amount, t.status];
    const tableRows = entries.map((entry) => [
      `${entry.shopName}, ${entry.city}`,
      entry.amount.toFixed(2),
      entry.isPaid ? t.paid : t.unpaid,
    ]);

    // Add table to PDF
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] }, // Blue header
      bodyStyles: { textColor: [0, 0, 0] }, // Black text
    });

    // Add total paid and unpaid amounts
    doc.setFontSize(10);

// Set font to bold for the text
doc.setFont('Helvetica', 'bold');

// Add total paid amount in green
doc.setTextColor(0, 128, 0); // Green color for paid
doc.text(`${t.totalPaid}: ${calculateTotal(true)}`, 20, doc.previousAutoTable.finalY + 10);

// Add total unpaid amount in red
doc.setTextColor(255, 0, 0); // Red color for unpaid
doc.text(`${t.totalUnpaid}: ${calculateTotal(false)}`, 20, doc.previousAutoTable.finalY + 20);

// Reset the font to normal
doc.setFont('Helvetica', 'normal');


    // Save the PDF
    doc.save(`${new Date().getDate().toString().padStart(2, '0')}${new Date().toLocaleString('en-US', { month: 'short' })}${new Date().getFullYear()}_bill.pdf`);

  };

  return (
    <div className="App">
      <h1>Billing Form</h1>
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
        <button onClick={() => generatePDF('EN')} className="btn-primary">Download As PDF</button>
      </div>
    </div>
  );
}

export default App;
