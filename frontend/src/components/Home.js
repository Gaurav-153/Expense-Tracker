import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const userId = localStorage.getItem('userId');

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="p-5 rounded shadow-lg text-center bg-white"
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <h1 className="mb-4 text-primary fw-bold">
          <i className="fas fa-coins me-2"></i>Welcome to Daily Expense Tracker
        </h1>
        <p className="lead text-muted mb-4">
          Track and manage your daily expenses with ease.
        </p>

        <div className="d-grid gap-3">
          {userId ? (
            <Link to="/dashboard" className="btn btn-warning btn-lg">
              <i className="fas fa-tachometer-alt me-2"></i>Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary btn-lg">
                <i className="fas fa-user-plus me-2"></i>Sign Up
              </Link>
              <Link to="/login" className="btn btn-success btn-lg">
                <i className="fas fa-sign-in-alt me-2"></i>Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
