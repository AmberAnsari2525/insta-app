import React, { useState, useEffect } from 'react';
import {addComment, deletePost, fetchUserData, getCommentsById, userGetPost} from "../Services/api";
import {Link, useParams} from 'react-router-dom';
import {Dropdown, Modal} from "react-bootstrap";
import {FaEllipsisH} from "react-icons/fa";

export const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);  // State to store posts
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false); // State to track follow status



    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]); // Initialize comments state
    const [activePostId, setActivePostId] = useState(null); // Track active post ID for comments
    const [newComment, setNewComment] = useState(''); // Input state for new comments
    const [isLoading, setIsLoading] = useState(false); // Loading state for comments
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const getUserData = async () => {
            try {
                // Fetch user data (auth details)
                const data = await fetchUserData();

                if (data && data.user) {
                    setUserData(data.user);
                    setIsFollowing(data.user.isFollowing);

                    // Save the user ID to localStorage (or use the data directly if you have access to the user's ID)
                    const userId = data.user.id;
                    localStorage.setItem('user_id', userId);

                    // Fetch the user's posts using the user ID
                    const postsData = await userGetPost(userId);
                    setPosts(postsData); // Store the posts in state
                } else {
                    setError('Failed to load user data.');
                }
            } catch (error) {
                setError("Failed to fetch user data");
            } finally {
                setLoading(false);
            }
        };

        getUserData();
    }, []);
    // Fetch comments whenever selectedPost changes
    useEffect(() => {
        const fetchComments = async () => {
            if (selectedPost) {
                setActivePostId(selectedPost.id); // or whatever identifies the post
                try {
                    const commentsData = await getCommentsById(selectedPost.id);
                    setComments(commentsData);
                } catch (error) {
                    console.error('Failed to fetch comments:', error);
                }
            }
        };

        fetchComments();
    }, [selectedPost]);



    const confirmUnfollow = () => {
        setShowModal(true);
    };

    const openPostModal = (post) => {
        setSelectedPost(post); // Set the selected post
    };

    const closePostModal = () => {
        setSelectedPost(null); // Clear the selected post
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) return <p>{error}</p>;



    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (newComment.trim() && activePostId) {
            setIsLoading(true); // Set loading state
            try {
                await addComment(activePostId, newComment);
                setNewComment(''); // Clear the comment input field
                // Fetch updated comments immediately
                const commentsData = await getCommentsById(activePostId);
                setComments(commentsData);
            } catch (error) {
                console.error('Failed to add comment:', error);
            } finally {
                setIsLoading(false); // Reset loading state
            }
        }
    };

    const handleEdit = () => {

        console.log("Edit clicked");
    };

    const handleDelete = () => {

        console.log("Delete clicked");
    };


    const handleDeletePost = async () => {
        try {
            await deletePost(selectedPost.id);
            setShowDeleteModal(false);  // Close the delete confirmation modal
            closePostModal();  // Close the post details modal
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };



    return (
        <div className="post_page">
            {/* Nav Menu */}
            <div className="nav_menu">
                {/* Bottom navigation for smaller screens */}
            </div>

            <div className="profile_container">
                <div className="profile_info">
                    <div className="cart">
                        <div className="img">
                            <img src={userData?.image || "/images/profile_img.jpg"} alt={userData?.username || "Profile"} />
                        </div>
                        <div className="info">
                            <p className="name">{userData?.username || "User Name"}


                            </p>

                            <div className="general_info">
                                <p><span>{posts.length}</span> post{posts.length !== 1 ? 's' : ''}</p>
                                <p><span>{userData?.followersCount || 0}</span> followers</p>
                                <p><span>{userData?.followingCount || 0}</span> following</p>

                            </div>
                         {/*   <p className="nick_name">{userData?.nickname || "Zin Ess"}</p>
                            <p className="desc">{userData?.bio || "I'm an engineering student\nENSAO"}</p>*/}
                        </div>
                    </div>
                </div>

                {/* Highlights Section */}
                <div className="highlights">
                    <div className="highlight">
                        <div className="img">
                            <img src="/images/profile_img.jpg" alt="Highlight" />
                        </div>
                        <p>Highlight</p>
                    </div>
                    <div className="highlight highlight_add">
                        <div className="img">
                            <img src="/images/plus.png" alt="Add Highlight" />
                        </div>
                        <p>New</p>
                    </div>
                </div>
                <hr />

                {/* Posts Section */}
                <div className="posts_profile">
                    <ul className="nav-pills w-100 d-flex justify-content-center" id="pills-tab" role="tablist">
                        <li className="nav-item mx-2" role="presentation">
                            <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                <img src="/images/feed.png" alt="Posts" /> POSTS
                            </button>
                        </li>
                        <li className="nav-item mx-2" role="presentation">
                            <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                                <img src="/images/save-instagram.png" alt="Saved" /> SAVED
                            </button>
                        </li>
                        <li className="nav-item mx-2" role="presentation">
                            <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">
                                <img src="/images/tagged.png" alt="Tagged" /> TAGGED
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex="0">
                            <div id="posts_sec" className="post">
                                {posts.length > 0 ? posts.map((post) => (
                                    <div className="item" key={post.id} onClick={() => openPostModal(post)}>
                                        {post.post_type === "image" ? (
                                            post.media_links.length > 0 ? (
                                                post.media_links.map((link, idx) => (
                                                    <img key={idx} className="img-fluid item_img" src={link} alt={`Post by ${userData?.username || "User"}`} />
                                                ))
                                            ) : (
                                                <p>No images available</p>
                                            )
                                        ) : post.post_type === "video" ? (
                                            post.media_links.length > 0 ? (
                                                post.media_links.map((link, idx) => (
                                                    <video key={idx} controls style={{ width: '100%', maxHeight: '250px' }}>
                                                        <source src={link} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                ))
                                            ) : (
                                                <p>No videos available</p>
                                            )
                                        ) : null}
                                    </div>
                                )) : <p>No posts available</p>}

                            </div>
                        </div>
                        {/* Modal for Post Details */}
                        <>
                            {/* Post Details Modal */}
                            {selectedPost && (
                                <Modal show onHide={closePostModal} className="social-media-modal">
                                    <Modal.Header closeButton>
                                        <Modal.Title className="d-flex align-items-center">
                                            <img
                                                src={userData?.image || './images/default-profile.png'}
                                                alt="Profile"
                                                className="rounded-circle me-2"
                                                style={{ width: "40px", height: "40px" }}
                                            />
                                            {userData?.username}
                                        </Modal.Title>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="link" id="dropdown-more">
                                                <FaEllipsisH size={20} />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
                                                <Dropdown.Item onClick={() => setShowDeleteModal(true)}>Delete</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="container">
                                            <div className="row">
                                                {/* Left Column for Comments */}
                                                <div className="col-md-6 border-end">
                                                    <h5 className="text-muted">Comments</h5>
                                                    <div className="comments-section overflow-auto" style={{ maxHeight: '400px' }}>
                                                        {comments.map((comment) => (
                                                            <div key={comment.id} className="comment mb-3 p-2 border-bottom">
                                                                <div className="d-flex align-items-start">
                                                                    <img
                                                                        src={comment.user?.image || './images/default-profile.png'}
                                                                        alt="User profile"
                                                                        className="rounded-circle me-2"
                                                                        style={{ width: "40px", height: "40px" }}
                                                                    />
                                                                    <div>
                                                                        <div className="d-flex align-items-center">
                                                                            <h6 className="mb-0">{comment.user?.username || 'Unknown User'}</h6>
                                                                            <span className="text-muted ms-2" style={{ fontSize: '0.8rem' }}>
                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                            </span>
                                                                        </div>
                                                                        <p className="mb-1">{comment.content}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Right Column for Post Media */}
                                                <div className="col-md-6 d-flex flex-column align-items-center">
                                                    {selectedPost.media_links?.map((link, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={link}
                                                            alt={`Post media ${idx + 1}`}
                                                            className="img-fluid mb-2"
                                                            style={{ borderRadius: '8px', objectFit: 'cover', maxHeight: '400px', width: '100%' }}
                                                        />
                                                    ))}
                                                    <p className="text-muted mt-2">{selectedPost.description || " "}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer className="justify-content-between">
                                        <div className="d-flex gap-2 w-100">
                                            <input
                                                type="text"
                                                placeholder="Add a comment..."
                                                // onChange and other functions
                                                className="form-control"
                                            />
                                            <button type="submit" className="btn btn-primary">Post</button>
                                        </div>
                                    </Modal.Footer>
                                </Modal>
                            )}

                            {/* Delete Confirmation Modal */}
                            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Confirm Delete</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    Are you sure you want to delete this post?
                                </Modal.Body>
                                <Modal.Footer>
                                    <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-danger" onClick={handleDeletePost}>
                                        Yes, Delete
                                    </button>
                                </Modal.Footer>
                            </Modal>
                        </>

                        {/* Saved Posts */}
                        <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex="0">
                            <div id="saved_sec" className="post">
                                {/* Sample Saved Posts */}
                                <div className="item">
                                    <img className="img-fluid item_img" src="https://i.ibb.co/6WvdZS9/account12.jpg" alt="Saved Post" />
                                </div>
                            </div>
                        </div>

                        {/* Tagged Posts */}
                        <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabIndex="0">
                            <div id="tagged" className="post">
                                {/* Sample Tagged Posts */}
                                <div className="item">
                                    <img className="img-fluid item_img" src="https://i.ibb.co/Zhc5hHp/account4.jpg" alt="Tagged Post" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};
