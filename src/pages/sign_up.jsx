import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../Services/api";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        username: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [formError, setFormError] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validate password on change
        if (name === 'password') {
            const validationError = validatePassword(value);
            setFormError({ ...formError, [name]: validationError || '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, fullName, username, password } = formData;

        // Check if all required fields are filled
        if (!email || !fullName || !username || !password) {
            setError("All fields are required.");
            return;
        }

        // Validate password on submit
        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
            setFormError({ ...formError, password: passwordValidationError });
            setError(passwordValidationError);
            return;
        }

        try {
            const response = await registerUser(formData);
            if (response.data) {
                navigate("/home"); // Redirect on successful registration
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred.");
        }
    };

    return (
        <div className="container">
            <div className="sign_up">
                <div className="content">
                    <div className="log-on border_insc">
                        <div className="logo">
                            <img src="./images/logo.png" alt="Instagram logo" />
                            <p>Sign up to see photos and videos from your friends.</p>
                            <button className="btn log_fac">
                                <a href="#">
                                    <img src="./images/facebook_white.png" alt="facebook icon" />
                                    Log in with Facebook
                                </a>
                            </button>
                            <div className="seperator">
                                <span className="ligne"></span>
                                <span className="ou">OR</span>
                                <span className="ligne"></span>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                {formError.password && (
                                    <p className="text-danger">{formError.password}</p>
                                )}
                                <div
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '15px',
                                        top: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                </div>
                            </div>
                            {error && <p className="error">{error}</p>}
                            <div className="info">
                                <p>
                                    People who use our service may have uploaded your contact information to
                                    Instagram. <a href="#">Learn more</a>
                                </p>
                                <p>
                                    By signing up, you agree to our <a href="#">Terms, Privacy Policy, and Cookies
                                    Policy.</a>
                                </p>
                            </div>
                            <button type="submit" className="log_btn">Sign Up</button>
                        </form>
                    </div>
                    <div className="sing-in border_insc">
                        <p>
                            Have an account?
                            <Link to="log-in">Log in</Link>
                        </p>
                    </div>
                    <div className="download">
                        <p>Get the app.</p>
                        <div>
                            <img src="./images/google_play_icon.png" alt="download app from google play" />
                            <img src="./images/microsoft-icon.png" alt="download app from microsoft" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
