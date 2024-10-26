import React, { useState, useEffect } from 'react';
import { getAllPosts } from "../Services/api"; // Import the API function for fetching posts

export const Explore = () => {
    const [postsData, setPostsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { posts } = await getAllPosts();
                setPostsData(posts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };
        fetchPosts();
    }, []);

    return (
        <>
            <div className="post_page">
                <div className="nav_menu">
                    {/* Navigation menu content if needed */}
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="explore_container">
                        <div className="items_4">
                            {postsData.map((post, index) => (
                                <div key={post.id} className="item">
                                    <img className="img-fluid" src={post.media_links[0] || "https://via.placeholder.com/150"} alt="post"/>
                                    <div className="bg">
                                        <div className="likes">
                                            <img src="./images/heart_white.png" alt="likes icon"/>
                                            <span>{post.like_count || 0}</span>
                                        </div>
                                        <div className="comments">
                                            <img src="./images/message.png" alt="comments icon"/>
                                            <span>{post.comment_count || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
