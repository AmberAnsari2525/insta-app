
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserData, updateProfile } from "../Services/api"; // Import updateProfile

export const EditProfile = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        image: '',
    });
    const [imageFile, setImageFile] = useState(null); // Store the image file
    const [originalData, setOriginalData] = useState({}); // Store original user data
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false); // To show success message
    const [isChanged, setIsChanged] = useState(false); // To track if data has changed

    useEffect(() => {
        const getUserData = async () => {
            try {
                const data = await fetchUserData(); // Fetch user data from your API
                console.log('Fetched user data:', data);

                if (data && data.user) {
                    // Store the user_id in localStorage
                    localStorage.setItem('user_id', data.user.id); // Assuming `id` is the field for user ID

                    // Set the user data for display and original data for comparison
                    const userDataFromApi = {
                        username: data.user.name,
                        email: data.user.email,
                        image: data.user.image,
                    };
                    setUserData(userDataFromApi);
                    setOriginalData(userDataFromApi); // Store original data
                } else {
                    setError('Failed to load user data.');
                }
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                setError(`An error occurred: ${err.message}`);
            }
        };
        getUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setIsChanged(true); // Mark as changed
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (e.g., limit to 2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                setError("File size exceeds 2MB.");
                return; // Exit if the file is too large
            }

            // Create a URL for the selected image and update userData.image
            const imageUrl = URL.createObjectURL(file); // Create a temporary URL
            setUserData((prevData) => ({
                ...prevData,
                image: imageUrl, // Update the userData with the temporary image URL
            }));

            setImageFile(file); // Store the file for upload
            setIsChanged(true);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting user data:', userData);

        // Create a FormData object to send image and other data
        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('email', userData.email);

        if (imageFile) {
            formData.append('image', imageFile); // Append the image file to FormData
        }

        try {
            const response = await updateProfile(formData); // Make sure the API can handle multipart form data
            console.log('Profile updated:', response);

            // Update user data with response
            setUserData((prevData) => ({
                ...prevData,
                username: response.user.username || prevData.username, // Ensure to set new username from response
                email: response.user.email || prevData.email, // Ensure to set new email from response
                image: response.user.image || prevData.image, // Ensure to set new image from response
            }));

            setSuccess(true);
            setIsChanged(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile.');
        }
    };

    return (
        <>
            <div className="nav_menu">


            </div>

    <div className=" main_section">
            <div className="middle-sidebar-bottom">
                <div className="middle-sidebar-left">
                    <div className="middle-wrap">
                        <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                            <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                                <Link to="/default-settings" className="d-inline-block mt-2">
                                    <i className="ti-arrow-left font-sm text-white"></i>
                                </Link>
                                <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">Account Details</h4>
                            </div>
                            <div className="card-body p-lg-5 p-4 w-100 border-0">
                                <div className="row justify-content-center">
                                    <div className="col-lg-4 text-center">
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <figure className="avatar ms-auto me-auto mb-0 mt-2 w100">
                                                <img
                                                    src={userData.image || "images/default-avatar.jpg"}
                                                    alt="User Avatar"
                                                    className="shadow-sm rounded-3 w-100"
                                                />

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleProfileImageChange}
                                                    style={{display: 'none'}} // Hide the file input
                                                    id="profileImageInput"
                                                />
                                                <label
                                                    htmlFor="profileImageInput"
                                                    style={{
                                                        cursor: 'pointer',
                                                        position: 'absolute',
                                                        bottom: '10px',
                                                        right: '10px',
                                                        background: 'rgba(255, 255, 255, 0.8)',
                                                        borderRadius: '50%',
                                                        padding: '5px',
                                                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
                                                    }}>
                                                    <i className="ti-pencil font-sm text-primary"></i>
                                                </label>
                                            </figure>
                                        </div>
                                        <h2 className="fw-700 font-sm text-grey-900 mt-3">User Name</h2>
                                        <h4 className="text-grey-500 fw-500 mb-3 font-xsss mb-4">{userData.username || 'user name'}</h4>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-lg-6 mb-3">
                                            <div className="form-group">
                                                <label className="mont-font fw-600 font-xsss">Username</label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={userData.username}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-6 mb-3"></div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-6 mb-3">
                                            <div className="form-group">
                                                <label className="mont-font fw-600 font-xsss">Email</label>
                                                <input
                                                    type="text"
                                                    name="email"
                                                    value={userData.email}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-12">
                                            <button
                                                type="submit"
                                                className="bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block"
                                                disabled={!isChanged} // Disable button if no changes
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {success && <p className="text-success mt-3">Profile updated successfully!</p>}
                                {error && <p className="text-danger mt-3">{error}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};


