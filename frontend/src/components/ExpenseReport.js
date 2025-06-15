import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExpenseReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const userId = localStorage.getItem('userId');

  const fetchReport = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both dates!");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/expense_report/${userId}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_date: fromDate, to_date: toDate }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setExpenses(data.expenses);
        setTotal(data.total);
      }
    } catch (err) {
      toast.error("Error fetching data");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Expense Report (Date-wise)', 105, 15, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`From: ${fromDate}`, 14, 25);
    doc.text(`To: ${toDate}`, 150, 25);

    const tableData = expenses.map((exp, index) => [
      index + 1,
      exp.ExpenseDate,
      exp.ExpenseItem,
      `₹${exp.ExpenseCost}`,
    ]);

    autoTable(doc, {
      head: [['#', 'Date', 'Item', 'Amount']],
      body: tableData,
      startY: 30,
      theme: 'grid',
    });

    const finalY = doc.lastAutoTable.finalY || 30;
    doc.setFontSize(13);
    doc.text(`Grand Total: ₹${total}`, 105, finalY + 10, null, null, 'center');

    doc.save('expense_report.pdf');
  };

  return (
    <div className='container mt-5'>
      <h2 className='text-center mb-4'>Expense Report (Date-wise)</h2>

      <div className='row mb-4'>
        <div className='col-md-4'>
          <label>From Date</label>
          <input
            type='date'
            className='form-control'
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className='col-md-4'>
          <label>To Date</label>
          <input
            type='date'
            className='form-control'
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className='col-md-4 d-flex align-items-end gap-2'>
          <button className='btn btn-primary' onClick={fetchReport}>
            Search Report
          </button>
          {expenses.length > 0 && (
            <button className='btn btn-success' onClick={downloadPDF}>
              Download PDF
            </button>
          )}
        </div>
      </div>

      <table className='table table-striped table-bordered'>
        <thead className='table-dark'>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Item</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <tr key={expense.id || index}>
                <td>{index + 1}</td>
                <td>{expense.ExpenseDate}</td>
                <td>{expense.ExpenseItem}</td>
                <td>{expense.ExpenseCost}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='4' className='text-center'>
                No expenses found
              </td>
            </tr>
          )}
        </tbody>
        {expenses.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan='4' className='text-center'>
                <strong>Grand Total: ₹{total}</strong>
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      <ToastContainer />
    </div>
  );
};

export default ExpenseReport;
