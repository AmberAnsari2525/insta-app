import React, { useState, useEffect } from 'react';
import { getAllPosts, fetchUserId, likePost, deleteLike, fetchUserData, addComment, getCommentsById , sharePosts} from "../Services/api";
import { Link, useNavigate } from 'react-router-dom';

export const AllPost = () => {
    const [postsData, setPostsData] = useState([]);
    const [isSaved, setIsSaved] = useState([]);
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [activePostId, setActivePostId] = useState(null); // Track active post ID for comments modal
    const [isLoading, setIsLoading] = useState(false); // Loading state for comments
    const [loading, setLoading] = useState(true); // Loading state for posts
    const [likedPosts, setLikedPosts] = useState(new Map()); // Initialize as a Map

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { posts } = await getAllPosts();
                setPostsData(posts);
                setIsSaved(new Array(posts.length).fill(false));
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };
        fetchPosts();
    }, []);

    // Load liked posts with their like IDs from localStorage on page load
    useEffect(() => {
        const storedLikes = localStorage.getItem('likedPosts');
        if (storedLikes) {
            setLikedPosts(new Map(JSON.parse(storedLikes)));
        }
    }, []);

// Update localStorage whenever likedPosts changes
    useEffect(() => {
        if (likedPosts.size > 0) {
            localStorage.setItem('likedPosts', JSON.stringify(Array.from(likedPosts.entries())));
        } else {
            localStorage.removeItem('likedPosts');
        }
    }, [likedPosts]);

    const handleLikeToggle = async (postId, index) => {
        try {
            let updatedLikeCount;

            // Check if the post is already liked
            if (likedPosts.get(postId)) {
                const likeId = likedPosts.get(postId); // Get like_id directly from likedPosts map
                if (!likeId) {
                    console.error("like_id is undefined for the post.");
                    return; // Exit if like_id is missing
                }

                // Delete the like
                const response = await deleteLike(likeId);
                updatedLikeCount = response.updated_like_count;

                setLikedPosts(prevLikedPosts => {
                    const updatedLikes = new Map(prevLikedPosts);
                    updatedLikes.delete(postId); // Remove from local storage map
                    return updatedLikes;
                });
            } else {
                // Add a like
                const response = await likePost(postId);
                updatedLikeCount = response.updated_like_count;
                const newLikeId = response.like.id;

                postsData[index].like_id = newLikeId; // Set like_id in posts data

                setLikedPosts(prevLikedPosts => {
                    const updatedLikes = new Map(prevLikedPosts);
                    updatedLikes.set(postId, newLikeId); // Store postId with like_id in localStorage
                    return updatedLikes;
                });
            }

            setPostsData(prevPosts => {
                const updatedPosts = [...prevPosts];
                updatedPosts[index] = {
                    ...updatedPosts[index],
                    like_count: updatedLikeCount,
                };
                return updatedPosts;
            });

        } catch (error) {
            console.error("Error toggling like:", error.message);
        }
    };


    //share post sate
    const [shareData, setShareData] = useState(null); //state share post
    const [shareError, setShareError] = useState(null); // state share error
    const [copySuccess, setCopySuccess] = useState(false); // State for copy success message

    // handle copy Link
    const handleCopyLink = (event, link) => {
        event.stopPropagation();
        navigator.clipboard.writeText(link) // Copy the link to the clipboard
            .then(() => {
                setCopySuccess(true); // Show success message
                setTimeout(() => setCopySuccess(false), 2000); // Hide message after 2 seconds
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };



// handle share
    const handleShare = async (postId, userId) => {
        console.log("Sharing post with ID:", postId);

        if (!postId || !userId) {
            console.log("postId or userId is missing");
            return;
        }

        try {
            const data = await sharePosts(postId, userId); // Pass postId and userId to `sharePosts`
            setShareData(data);
            console.log("Shared successfully:", data);
        } catch (err) {
            console.log("Error response:", err);
            if (err.response && err.response.status === 404) {
                setShareError('Post not found. Please make sure the post exists.');
            } else if (err.response && err.response.data) {
                setShareError('Failed to share the post. Please try again.');
            } else {
                setShareError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

// Update this function to set the active post ID when the user clicks the "send" button
    const handleSendClick = (postId) => {
        setActivePostId(postId);
    };


    const handleSaveToggle = (index) => {
        setIsSaved((prevSavedPosts) => {
            const updatedSaved = [...prevSavedPosts];
            updatedSaved[index] = !updatedSaved[index];
            return updatedSaved;
        });
    };

    const handleProfileClick = async (userId) => {
        try {
            const userProfile = await fetchUserId(userId);
            navigate(`/userprofile/${userId}`, { state: { user: userProfile } });
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const handleCommentClick = async (postId) => {
        if (activePostId !== postId) {
            setComments([]); // Clear comments when switching posts
            setActivePostId(postId); // Set active post ID
            try {
                const commentsData = await getCommentsById(postId);
                setComments(commentsData);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        } else {
            setActivePostId(null); // Close modal if the same post is clicked
            setComments([]); // Clear comments when closing
        }
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (newComment.trim() && activePostId) {
            setIsLoading(true); // Set loading state
            try {
                await addComment(activePostId, newComment); // Call with postId
                setNewComment(''); // Clear the comment input field
                const commentsData = await getCommentsById(activePostId); // Fetch updated comments
                setComments(commentsData);
            } catch (error) {
                console.error('Failed to add comment:', error);
            } finally {
                setIsLoading(false); // Reset loading state
            }
        }
    };

    return (
        <>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                postsData.map((post, index) => (
                    <div className="post" key={post.id}>
                        <div className="info">
                            <div className="person" style={{cursor: 'pointer'}}
                                 onClick={() => handleProfileClick(post.user_id)}>
                                <img src={userData?.image || './images/profile_img.jpg'}
                                     alt={`${post.username} profile`}/>
                                <a href="#">{post.username}</a>
                                <span className="circle">.</span>
                                <span>{new Date(post.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <div className="more">
                                <img src="./images/show_more.png" alt="show more"/>
                            </div>
                        </div>
                        <div className="image">
                            {post.post_type === "image" ? (
                                post.media_links.length > 0 ? (
                                    post.media_links.map((link, idx) => (
                                        <img key={idx} src={link} alt={`post visual ${idx}`}/>
                                    ))
                                ) : (
                                    <p>No images available</p>
                                )
                            ) : post.post_type === "video" ? (
                                post.media_links.length > 0 ? (
                                    post.media_links.map((link, idx) => (
                                        <video key={idx} controls style={{width: '100%'}}>
                                            <source src={link} type="video/mp4"/>
                                            Your browser does not support the video tag.
                                        </video>
                                    ))
                                ) : (
                                    <p>No videos available</p>
                                )
                            ) : null}
                        </div>
                        <div className="desc">
                            <div className="icons">
                                <div className="icon_left d-flex">
                                    <div className="like" onClick={() => handleLikeToggle(post.id, index)}>
                                        <img
                                            className="not_loved"
                                            src={likedPosts.get(post.id) ? './images/heart.png' : './images/love.png'}
                                            alt="like icon"
                                        />
                                    </div>
                                    <div className="chat">
                                        <button type="button" className="btn p-0" data-bs-toggle="modal"
                                                data-bs-target="#message_modal"
                                                onClick={() => handleCommentClick(post.id)}>
                                            <img src="./images/bubble-chat.png" alt="chat icon"/>
                                        </button>
                                    </div>
                                    <div className="send">
                                        <button
                                            type="button"
                                            className="btn p-0"
                                            data-bs-toggle="modal"
                                            data-bs-target="#send_message_modal"
                                            onClick={() => handleSendClick(post.id)}  // Set active post ID
                                        >
                                            <img src="./images/send.png" alt="send icon"/>
                                        </button>
                                    </div>
                                </div>
                                <div className={`save ${isSaved[index] ? 'saved' : 'not_saved'}`}
                                     onClick={() => handleSaveToggle(index)}>
                                    <img className={`saved ${isSaved[index] ? '' : 'hide'}`}
                                         src="./images/save_black.png" alt="save icon"/>
                                    <img className={`not_saved ${isSaved[index] ? 'hide' : ''}`}
                                         src="./images/save-instagram.png" alt="unsave icon"/>
                                </div>
                            </div>
                            <div className="liked">
                                <a className="bold" href="#">{post.like_count} likes</a>
                            </div>
                            <div className="post_desc">
                                <p>
                                    <a className="bold" href="#">{post.username}</a> {post.content || ''}
                                </p>
                                <p><a className="gray" href="#">View all {post.comment_count} comments</a></p>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/*modal for share post*/}
            <div className="modal fade" id="send_message_modal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Share</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* Display the actual post link dynamically based on the activePostId */}
                            {activePostId && (
                                <p>{`localhost:3000/posts/${activePostId}`}</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigator.clipboard.writeText(`localhost:3000/posts/${activePostId}`)}
                            >
                                Copy Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="modal fade" id="message_modal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Comments</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="comments">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="comment">
                                        <div className="d-flex">
                                            <div className="img">
                                                <img
                                                    src={comment.user?.image || './images/default-profile.png'}
                                                    alt="User profile"
                                                />
                                            </div>
                                            <div className="content">
                                                <div className="person">
                                                    <h4>{comment.user?.username || 'Unknown User'}</h4>
                                                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p>{comment.content}</p>
                                                <div className="replay">
                                                    <button className="replay"></button>
                                                    <button className="translation"></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="d-flex justify-content-center mt-3">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <form className="w-100" onSubmit={handleAddComment}>
                                <div className='d-flex'>
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={handleCommentChange}
                                        style={{
                                            border: 'none',
                                            outline: 'none',
                                            padding: '10px 15px',
                                            width: '100%',
                                            borderRadius: '25px',
                                            backgroundColor: '#f1f1f1',
                                            fontSize: '14px'
                                        }}

                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '25px',
                                            backgroundColor: '#007bff',
                                            color: '#fff',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Post
                                    </button>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
