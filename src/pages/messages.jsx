import React, { useEffect, useState } from 'react';
import {getUser, sendMessage, fetchMessages, fetchUserData} from "../Services/api";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your backend server URL

export const Messages = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    const userId = localStorage.getItem('user_id'); // Get user ID from localStorage


    useEffect(() => {
        const getUserData = async () => {
            try {
                const data = await fetchUserData();
                setUserData(data.user); // Set user profile data
            } catch (error) {
                console.log("Failed to fetch user data");
            }
        };
        getUserData();
    }, []);
    // Fetch users to start the messaging conversation
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
                setError(error.message || "Failed to fetch users.");
            }
        };

        fetchUsers();
    }, []);

    // Fetch messages whenever a user is selected
    useEffect(() => {
        if (selectedUser && userId) {
            const fetchChatMessages = async () => {
                try {
                    const response = await fetchMessages(userId, selectedUser.id);
                    setMessages(response || []);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                    setError("Failed to fetch messages.");
                }
            };

            fetchChatMessages();
        }
    }, [selectedUser, userId]);

    // WebSocket listener for incoming messages
    useEffect(() => {
        socket.on('sendMessage', (newMessage) => {
            // Check if the new message is for the selected user
            if (selectedUser && (newMessage.sender_id === selectedUser.id || newMessage.receiver_id === selectedUser.id)) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        });

        // Cleanup the socket listener when the component unmounts
        return () => {
            socket.off('sendMessage');
        };
    }, [selectedUser]);

    // Handle user selection
    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    // Handle message input change
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    // Send the message
    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (message && selectedUser && userId) {
            const newMessage = {
                message,
                sender_id: userId,
                receiver_id: selectedUser.id,
            };

            // Optimistically add the new message to the UI
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessage("");

            // Emit the message to other connected clients via WebSocket
            socket.emit('sendMessage', newMessage);

            // Send the message to the backend
            try {
                const response = await sendMessage(newMessage);
                if (!response.status) {
                    setError("Failed to send message.");
                }
            } catch (error) {
                console.error("Error sending message:", error);
                setError("Failed to send message.");
            }
        }
    };

    return (
        <div className="post_page message_page">
            <div className="nav_menu">
            </div>

            <div id="message">
                <div className="message_container">
                    <div className="persons">
                        <div className="account_name">
                            <p>{userData.username}</p>

                        </div>
                        <div className="account_message">
                            <div className="desc">
                                <p>Messages</p>
                                <p><a href="#"> users</a></p>
                            </div>
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map((user) => (
                                    <div key={user.id} className="cart" onClick={() => handleUserClick(user)}>
                                        <div>
                                            <div className="img">
                                                <img
                                                    src={user.image && user.image !== "http://instagram.techxdeveloper.com/uploads/null" ? user.image : './images/profile_img.jpg'}
                                                    alt="user-avatar"
                                                />
                                            </div>
                                            <div className="info">
                                                <p className="name">{user.username || "No username available"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="error-message">{error || "No users to display."}</p>
                            )}
                        </div>
                    </div>

                    {selectedUser && (
                        <div className="message">
                            <div className="options">
                                <div className="cart">
                                    <div>
                                        <div className="img">
                                            <img src={selectedUser.image || './images/profile_img.jpg'} alt="user-avatar"/>
                                        </div>
                                        <div className="info">
                                            <p className="name">{selectedUser.username}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="other">
                                    <a href="#">
                                        <img src="./images/telephone.png" alt="call"/>
                                    </a>
                                    <a href="#">
                                        <img src="./images/video_call.png" alt="video call"/>
                                    </a>
                                </div>
                            </div>


                            <div className="content">
                                {messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={msg.sender_id === userId ? 'my_message' : 'response_message'}>
                                            <p className="p_message">{msg.message}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No messages yet.</p>
                                )}
                            </div>



                            <form onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={handleMessageChange}
                                    id="emoji"
                                    placeholder="Write your message"
                                />
                                <button className="btn bg-primary">
                                    Send
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
