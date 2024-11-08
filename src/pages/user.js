import React, { useState, useEffect } from 'react';
import { getUser } from "../Services/api";
import { useNavigate } from "react-router-dom";

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUser();
                if (response.status) {
                    setUsers(response.users);
                } else {
                    setError("Failed to fetch users.");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                if (error.response && error.response.status === 401) {
                    setError("Unauthorized access. Please log in.");
                } else {
                    setError(error.message);
                }
            }
        };
        fetchUsers();
    }, []);

    const handleUser = (userId) => {
        navigate(`/userprofile/${userId}`);
    };

    return (
        <div className="users-page">
            <h2 className="page-title">Users</h2>
            <div className="users-grid">
                {Array.isArray(users) && users.length > 0 ? (
                    users.map((user, index) => (
                        <div key={index} className="user-card">
                            <img src={user.image || './images/profile-2.png'} alt="user-avatar" className="avatar" />
                            <h4 className="username">{user.username || "No username available"}</h4>
                            <button onClick={() => handleUser(user.id)} className="view-profile-btn">VIEW PROFILE</button>
                        </div>
                    ))
                ) : (
                    <p className="error-message">{error || "No users to display."}</p>
                )}
            </div>
        </div>
    );
};

export default Users;
