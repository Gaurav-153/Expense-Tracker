import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
 
      const data = await response.json();
      if (response.status === 200) {
        toast.success('Login Successful!');
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userName', data.userName);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Try again.');
    }
  };

  return (
    <div className='container mt-5'>
      <div className='text-center mb-4'>
        <h2><i className='fas fa-user me-2'></i>Login</h2>
        <p className='text-muted'>Access your expense Dashboard</p>
      </div>

      <div className='d-flex justify-content-center'>
        <div className='card shadow-lg p-4 border-0' style={{ maxWidth: '500px', width: '100%', borderRadius: '15px' }}>
          <form onSubmit={handleSubmit}>
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
                placeholder='Enter your password'
                onChange={handleChange}
                required
              />
            </div>

            <div className='d-grid'>
              <button type='submit' className='btn btn-primary'>Login</button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
