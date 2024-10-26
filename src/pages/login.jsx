import React,{useState, useContext} from 'react';
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../Context/Authcontext";
import { Spinner } from 'react-bootstrap';
import {LoginUser} from '../Services/api'
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
export const Login = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // State for loading
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Submit form data to the backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await LoginUser(formData);
            console.log('Login response:', response);
            if (response.token) {
                const success = login(response.token);
                if (success) {
                    navigate("/home"); // Navigate on successful login
                }
            } else {
                console.error("Token not found in response.");
                throw new Error("Token not found in response");
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || "An error occurred during login.");
        } finally {
            setLoading(false);
        }
    };



    return (


        <>
            <div className="container">
                <div className="login">
                    <div className="images d-none d-lg-block">
                        <div className="frame">
                            <img src="./images/home-phones.png" alt="picutre frame"/>
                        </div>
                        <div className="sliders">
                            <div id="carouselExampleSlidesOnly" className="carousel slide carousel-fade"
                                 data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img src="./images/screenshot1.png" className="d-block" alt="screenshot1"/>
                                    </div>
                                    <div className="carousel-item">
                                        <img src="./images/screenshot2.png" className="d-block" alt="screenshot2"/>
                                    </div>
                                    <div className="carousel-item">
                                        <img src="./images/screenshot3.png" className="d-block" alt="screenshot3"/>
                                    </div>
                                    <div className="carousel-item">
                                        <img src="./images/screenshot4.png" className="d-block" alt="screenshot4"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="log-on border_insc">
                            <div className="logo">
                                <img src="./images/logo.png" alt="Instagram logo"/>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="e-mail"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group position-relative">

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <div
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '15px',
                                            top: '8px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {showPassword ? <AiOutlineEyeInvisible/> : <AiOutlineEye/>}
                                    </div>
                        </div>
                        {error && <p className="error">{error}</p>}
                                <div className="form-group mb-1">
                                    <button
                                        type="submit"
                                        className="log_btn"
                                        disabled={loading} // Disable button while loading
                                    >
                                        {loading ? (
                                            <>
                                            <Spinner as="span" animation="border" size="sm" role="status"
                                                         aria-hidden="true"/>
                                                {' '}Logging In...
                                            </>
                                        ) : (
                                            "Log in"
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="other-ways">
                                <div className="seperator">
                                    <span className="ligne"></span>
                                    <span className="ou">OR</span>
                                    <span className="ligne"></span>
                                </div>
                                <div className="facebook-connection">
                                    <a href="#">
                                        <img src="./images/facebook.png" alt="facebook icon"/>
                                        Log in with Facebook
                                    </a>
                                </div>
                                <div className="forget-password">
                                    <a href="#">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="sing-up border_insc">
                            <p>
                                Don't have an account?
                                <a href="/">Sign up</a>
                            </p>
                        </div>
                        <div className="download">
                            <p>Get the app.</p>
                            <div>
                                <img src="./images/google_play_icon.png" alt="download app from google play"/>
                                <img src="./images/microsoft-icon.png" alt="download app from microsoft"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}