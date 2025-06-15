import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const userId = localStorage.getItem("userId");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/change_password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.error || "Failed to change password.");
      }
    } catch (error) {
      toast.error("Server error.");
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="border p-4 rounded shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="mb-4 text-center text-primary">
          <i className="fas fa-lock me-2"></i>Change Password
        </h4>

        {/* Old Password */}
        <div className="form-group mb-3">
          <label>Old Password</label>
          <div className="input-group">
            <span className="input-group-text"><i className="fas fa-key"></i></span>
            <input
              type="password"
              className="form-control"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
        </div>

        {/* New Password */}
        <div className="form-group mb-3">
          <label>New Password</label>
          <div className="input-group">
            <span className="input-group-text"><i className="fas fa-lock"></i></span>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="form-group mb-4">
          <label>Confirm New Password</label>
          <div className="input-group">
            <span className="input-group-text"><i className="fas fa-check"></i></span>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-primary w-100" onClick={handleChangePassword}>
          <i className="fas fa-sync-alt me-2"></i>Update Password
        </button>

        <ToastContainer />
      </div>
    </div>
  );
};

export default ChangePassword;
