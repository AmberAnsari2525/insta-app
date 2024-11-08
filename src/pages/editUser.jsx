import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserData, updateProfile } from '../Services/api';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { FaEdit } from 'react-icons/fa';
export const EditUser = () => {
    const { id } = useParams();
    const [error, setError] = useState(null);
    const [imageFile, setImageFile] = useState(null); // State for the image file
    const [userData, setUserData] = useState({}); // Initialize as an object for easier access
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user data on component load
    useEffect(() => {
        const getUserData = async () => {
            try {
                const data = await fetchUserData(id); // Pass id to fetchUserData if needed
                setUserData(data.user);
                setError(null);
            } catch (error) {
                setError("Failed to fetch user data");
            } finally {
                setIsLoading(false);
            }
        };
        getUserData();
    }, [id]);

    // Handle input changes for updating state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const maxSize = 2 * 1024 * 1024; // 2MB limit
            if (file.size > maxSize) {
                setError("File size exceeds 2MB.");
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            setUserData((prevData) => ({ ...prevData, image: imageUrl }));
            setImageFile(file);
        }
    };


    // Submit updated profile data
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting user data:', userData);

        // Create a FormData object to hold the data
        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('email', userData.email);

        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            // Call the updateProfile function with the form data
            const response = await updateProfile(formData);
            console.log('Profile updated:', response);

            // Check if the response indicates success
            if (response.status) {
                // Update userData with the new response data
                setUserData((prevData) => ({
                    ...prevData,
                    username: response.user.username || prevData.username, // Use new username or previous
                    email: response.user.email || prevData.email, // Use new email or previous
                    image: response.user.image || prevData.image, // Use new image or previous
                }));

                // Display success message
                Swal.fire({
                    title: 'Success!',
                    text: 'User profile updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });

                // Optionally, re-fetch updated data to ensure the frontend reflects the latest data
                const updatedData = await fetchUserData(id);
                setUserData(updatedData.user);
            } else {
                // Show error message if the response indicates a failure
                Swal.fire({
                    title: 'Error!',
                    text: response.message || "Error updating profile",
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            // Handle any errors thrown during the request
            console.error('Error updating profile:', error);
            setError('Failed to update profile.');
            Swal.fire({
                title: 'Error!',
                text: error.message || "Error updating user data",
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };


    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center py-4">Edit User</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit} className="border p-4 rounded bg-light">
                        <div className="mb-3 text-center">
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <img
                                    src={userData.image || "images/default-avatar.jpg"}
                                    alt="Profile"
                                    style={{ width: '100px', borderRadius: '50%' }}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
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
                                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                                    }}
                                >
                                    <FaEdit />
                                </label>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                value={userData.username || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={userData.email || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="btn bg-primary w-100">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
