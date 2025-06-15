import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ExpenseDate: '',
        ExpenseItem: '',
        ExpenseCost: '',
    });

    const userId = localStorage.getItem('userId');
    useEffect(()=>{
        if (!userId){
            navigate('/login')
        }
    },[]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/api/add_expense/", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({...formData,UserId:userId})
            });
            const data =await response.json();
            if (response.status === 201) {
                toast.success(data.message);
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
                <h2><i className='fas fa-plus-circle me-2'></i>Add Expense</h2>
                <p className='text-muted'>Track your new spending here</p>
            </div>

            <div className='d-flex justify-content-center'>
                <div className='card shadow-lg p-4 border-0' style={{ maxWidth: '500px', width: '100%', borderRadius: '15px' }}>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label className='form-label'>
                                <i className='fas fa-calendar-alt me-2'></i>Expense Date
                            </label>
                            <input
                                type='date'
                                name='ExpenseDate'
                                value={formData.ExpenseDate}
                                className='form-control'
                                placeholder='Enter your date'
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className='mb-3'>
                            <label className='form-label'>
                                <i className='fas fa-shopping-cart me-2'></i>Expense Item
                            </label>
                            <input
                                type='text'
                                name='ExpenseItem'
                                value={formData.ExpenseItem}
                                className='form-control'
                                placeholder='Enter your Item'
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className='mb-3'>
                            <label className='form-label'>
                                <i className='fas fa-rupee-sign me-2'></i>Expense Cost
                            </label>
                            <input
                                type='number'
                                name='ExpenseCost'
                                value={formData.ExpenseCost}
                                className='form-control'
                                placeholder='Enter cost'
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className='d-grid'>
                            <button type='submit' className='btn btn-primary'><i className='fas fa-plus me-2'></i>Add Expense</button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default AddExpense