import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/dashboard_summary/${userId}/`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Failed to load dashboard", err));
  }, []);

  if (!data) return <div className="text-center mt-5">Loading dashboard...</div>;

  const pieData = {
    labels: data.pie_data.map(item => item.ExpenseItem),
    datasets: [{
      label: 'Expenses by Category',
      data: data.pie_data.map(item => item.total),
      backgroundColor: [
        '#007bff', '#dc3545', '#ffc107', '#28a745', '#6610f2', '#20c997',
        '#fd7e14', '#6c757d', '#17a2b8', '#343a40'
      ],
      borderWidth: 1
    }]
  };

  const statCards = [
    { label: "Today's Expense", value: data.today_total, bg: 'bg-primary' },
    { label: "Yesterday's Expense", value: data.yesterday_total, bg: 'bg-danger' },
    { label: "Last 7 Days", value: data.week_total, bg: 'bg-warning' },
    { label: "Last 30 Days", value: data.month_total, bg: 'bg-success' },
    { label: "Current Year", value: data.year_total, bg: 'bg-info' },
    { label: "Grand Total", value: data.grand_total, bg: 'bg-dark' }
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Expense Dashboard</h2>

      {/* Stat Cards */}
      <div className="row">
        {statCards.map((card, idx) => (
          <div className="col-md-4 col-lg-4 mb-4" key={idx}>
            <div className={`card text-white ${card.bg} h-100 shadow-sm border-0`}>
              <div className="card-body text-center">
                <h6 className="card-title">{card.label}</h6>
                <h4>₹ {(card.value || 0).toFixed(2)}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="card shadow-sm p-4 mt-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h5 className="text-center mb-3">Expense Breakdown</h5>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
