import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { changePassword } from "../Services/api";
import { Storybook } from "./story";
import { AllPost } from "./getpostAll"; // Ensure this path is correct
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successAlert, setSuccessAlert] = useState(false);
    const [formError, setFormError] = useState({});

    const handleCloseAlert = () => {
        setSuccessAlert(false);
        setErrorAlert(false);
        setErrorMessage('');
    };

    const validatePassword = (password) => {
        const isLowerCase = /[a-z]/.test(password);
        const isUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const isMinLength = password.length >= 8;

        if (!isLowerCase) return 'Password must contain at least one lowercase letter.';
        if (!isUpperCase) return 'Password must contain at least one uppercase letter.';
        if (!hasNumber) return 'Password must contain at least one number.';
        if (!isMinLength) return 'Password must be at least 8 characters long.';
        return null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'newPassword' || name === 'confirmPassword') {
            const validationError = validatePassword(value);
            setFormError({ ...formError, [name]: validationError || '' });
        }

        if (name === 'newPassword') setNewPassword(value);
        else if (name === 'confirmPassword') setConfirmPassword(value);
        else setCurrentPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('New Password and Confirm Password do not match.');
            setErrorMessage('New Password and Confirm Password do not match.');
            setErrorAlert(true);
            return;
        }

        const passwordValidationError = validatePassword(newPassword);
        if (passwordValidationError) {
            setError(passwordValidationError);
            setErrorMessage(passwordValidationError);
            setErrorAlert(true);
            return;
        }

        const userData = { oldPassword: currentPassword, newPassword };

        try {
            const response = await changePassword(userData);
            if (response.message === "Password has been changed successfully") {
                setSuccess('Password changed successfully!');
                setSuccessAlert(true);
                setError('');
            }
        } catch (err) {
            setError('Failed to change password.');
            setErrorMessage('Failed to change password.');
            setErrorAlert(true);
        }
    };

    return (
        <div className="post_page">
            <div className="nav_menu"></div>
            <div className="second_container">
                <div className="main_section">
                    <div className="posts_container">
                        <div className="posts">
                            <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                                <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                                    <Link to="/default-settings" className="d-inline-block mt-2">
                                        <i className="ti-arrow-left font-sm text-white"></i>
                                    </Link>
                                    <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">Change Password</h4>
                                </div>
                                <div className="card-body p-lg-5 p-4 w-100 border-0">
                                    {error && <p className="text-danger">{error}</p>}
                                    {success && <p className="text-success">{success}</p>}
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-lg-12 mb-3">
                                                <div className="form-group position-relative">
                                                    <label className="mont-font fw-600 font-xssss">Current Password</label>
                                                    <input
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        name="currentPassword"
                                                        className="form-control"
                                                        value={currentPassword}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <div
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        style={{
                                                            position: 'absolute',
                                                            right: '15px',
                                                            top: '28px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {showCurrentPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 mb-3">
                                                <div className="form-group position-relative">
                                                    <label className="mont-font fw-600 font-xssss">New Password</label>
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        name="newPassword"
                                                        className="form-control"
                                                        value={newPassword}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    {formError.newPassword && (
                                                        <p className="text-danger">{formError.newPassword}</p>
                                                    )}
                                                    <div
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        style={{
                                                            position: 'absolute',
                                                            right: '15px',
                                                            top: '28px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 mb-3">
                                                <div className="form-group position-relative">
                                                    <label className="mont-font fw-600 font-xssss">Confirm New Password</label>
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        name="confirmPassword"
                                                        className="form-control"
                                                        value={confirmPassword}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    {formError.confirmPassword && (
                                                        <p className="text-danger">{formError.confirmPassword}</p>
                                                    )}
                                                    <div
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        style={{
                                                            position: 'absolute',
                                                            right: '15px',
                                                            top: '28px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 mb-0">
                                                <button
                                                    type="submit"
                                                    className="bg-primary text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
