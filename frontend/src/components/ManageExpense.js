import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ManageExpense = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [editExpense, setEditExpense] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        } else {
            fetchExpenses(userId);
        }
    }, [userId, navigate]);

    const fetchExpenses = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/manage_expense/${userId}`);
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
            toast.error('Failed to load expenses');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/expense/${id}/`, {
                method: 'DELETE',
            });
            if (response.ok) {
                toast.success('Expense deleted successfully');
                fetchExpenses(userId); // refresh list
            } else {
                toast.error('Failed to delete expense');
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error('Error deleting expense');
        }
    };

    const handleEditClick = (expense) => {
        setEditExpense({ ...expense });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditExpense(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/expense/${editExpense.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editExpense),
            });
            if (response.ok) {
                toast.success('Expense updated successfully');
                setShowModal(false);
                fetchExpenses(userId);
            } else {
                toast.error('Failed to update expense');
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error('Error updating expense');
        }
    };

    return (
        <div className='container mt-5'>
            <div className='text-center mb-4'>
                <h2><i className='fas fa-tasks me-2'></i>Manage Expense</h2>
                <p className='text-muted'>View, edit or delete your expense</p>
            </div>

            <table className='table table-striped table-bordered'>
                <thead className='table-dark text-center'>
                    <tr>
                        <th>Sr.No.</th>
                        <th>Date</th>
                        <th>Expense</th>
                        <th>Cost</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.length > 0 ? (
                        expenses.map((exp, index) => (
                            <tr key={exp.id}>
                                <td>{index + 1}</td>
                                <td>{exp.ExpenseDate}</td>
                                <td>{exp.ExpenseItem}</td>
                                <td>{exp.ExpenseCost}</td>
                                <td>
                                    <button className='btn btn-sm btn-info me-2' onClick={() => handleEditClick(exp)}><i className='fas fa-edit'></i></button>
                                    <button className='btn btn-sm btn-danger' onClick={() => handleDelete(exp.id)}><i className='fas fa-trash-alt'></i></button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-muted">No Expenses found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Edit Modal */}
            {showModal && editExpense && (
                <div className="modal d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title"><i className='fas fa-pen me-2'></i>Edit Expense</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group mb-3">
                                    <label>Date</label>
                                    <input type="date" className="form-control" name="ExpenseDate" value={editExpense.ExpenseDate} onChange={handleInputChange} />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Item</label>
                                    <input type="text" className="form-control" name="ExpenseItem" value={editExpense.ExpenseItem} onChange={handleInputChange} />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Cost</label>
                                    <input type="number" className="form-control" name="ExpenseCost" value={editExpense.ExpenseCost} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Save changes</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default ManageExpense;
