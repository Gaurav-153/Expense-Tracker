import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    Password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.status === 201) {
        toast.success('Signup Successful! Please Login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Signup failed. Try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Try again.');
    }
  };

  return (
    <div className='container mt-5'>
      <div className='text-center mb-4'>
        <h2><i className='fas fa-user-plus me-2'></i>SignUp</h2>
        <p className='text-muted'>Create your Account to start tracking expenses</p>
      </div>

      <div className='d-flex justify-content-center'>
        <div className='card shadow-lg p-4 border-0' style={{ maxWidth: '500px', width: '100%', borderRadius: '15px' }}>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label className='form-label'>
                <i className='fas fa-user me-2'></i>Full Name
              </label>
              <input
                type='text'
                name='FullName'
                value={formData.FullName}
                className='form-control'
                placeholder='Enter your full name'
                onChange={handleChange}
                required
              />
            </div>

            <div className='mb-3'>
              <label className='form-label'>
                <i className='fas fa-envelope me-2'></i>Email address
              </label>
              <input
                type='email'
                name='Email'
                value={formData.Email}
                className='form-control'
                placeholder='Enter your email'
                onChange={handleChange}
                required
              />
            </div>

            <div className='mb-3'>
              <label className='form-label'>
                <i className='fas fa-lock me-2'></i>Password
              </label>
              <input
                type='password'
                name='Password'
                value={formData.Password}
                className='form-control'
                placeholder='Create a password'
                onChange={handleChange}
                required
              />
            </div>

            <div className='d-grid'>
              <button type='submit' className='btn btn-primary'>Sign Up</button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
