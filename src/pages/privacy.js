import React, { useState, useEffect, useContext } from 'react';
import Switch from '@mui/material/Switch';
import { Modal } from 'react-bootstrap';
import { accountSettings } from "../Services/api";
import { AuthContext } from '../Context/Authcontext'; // Import AuthContext
import Swal from 'sweetalert2'; // Import SweetAlert2

function PrivacySetting() {
    const [isPrivate, setIsPrivate] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Use useContext to access user data
    const { user } = useContext(AuthContext); // Get logged-in user data (id)

    // Update state on initial load if user data is available or from localStorage
    useEffect(() => {
        const storedPrivacyStatus = localStorage.getItem('isPrivate');

        if (storedPrivacyStatus !== null) {
            // If the value exists in localStorage, use it
            setIsPrivate(JSON.parse(storedPrivacyStatus));
        } else if (user) {
            // Set the initial privacy status from user data
            setIsPrivate(user.isPrivate);
        }
    }, [user]);

    const handleToggle = () => {
        setShowModal(true);
    };

    const confirmPrivacySetting = async () => {
        try {
            const newPrivacyStatus = !isPrivate;
            // Pass the userId and the new privacy status to the API function
            const response = await accountSettings(newPrivacyStatus, user.id); // Pass user.id as the second argument

            if (response?.isPrivate === newPrivacyStatus) {
                setIsPrivate(newPrivacyStatus); // Update the state with the new privacy setting
                // Save the new privacy setting to localStorage
                localStorage.setItem('isPrivate', JSON.stringify(newPrivacyStatus));

                // Show SweetAlert success message
                Swal.fire({
                    icon: 'success',
                    title: 'Privacy Setting Updated!',
                    text: newPrivacyStatus
                        ? 'Your account is now private.'
                        : 'Your account is now public.',
                });

                setShowModal(false); // Close the modal after the update
            } else {
                console.error("Failed to update privacy setting");
            }
        } catch (error) {
            console.error("Error updating privacy setting:", error.response?.data?.message || error.message);
        }
    };

    return (
        <>
            <div className="post_page">
                <div className="nav_menu"></div>
                <div className="second_container">
                    <div className="main_section">
                        <div className="posts_container">
                            <div className="posts">
                                <div className="container">
                                    <div className="header">
                                        <h2>Account Privacy</h2>
                                    </div>
                                    <div className="privacy-info">
                                        <p>Private Account</p>
                                        <p>
                                            When your account is public, your profile and posts can be seen by anyone,
                                            on or off Instagram, even if they don't have an Instagram account.
                                        </p>
                                        <p>
                                            When your account is private, only the followers you approve can see what
                                            you share, including your photos or videos on hashtag and location pages,
                                            and your followers and following lists. Certain info on your profile, like
                                            your profile picture and username, is visible to everyone on and off
                                            Instagram.
                                        </p>
                                    </div>
                                    <div className="switch-container">
                                        <Switch
                                            checked={isPrivate}
                                            onChange={handleToggle}
                                            aria-label="Private account"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal for privacy setting confirmation */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Privacy Change</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {isPrivate
                                ? "Are you sure you want to make your account public?"
                                : "Are you sure you want to make your account private?"}
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={confirmPrivacySetting}>
                                Confirm
                            </button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </>
    );
}

export default PrivacySetting;
