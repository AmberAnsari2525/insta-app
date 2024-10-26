import React, { useEffect, useRef, useState } from 'react';
import {deleteLike, getAllPosts, likePost} from "../Services/api";
import { useNavigate } from "react-router-dom";

export const Reels = () => {
    const [activeVideo, setActiveVideo] = useState(0);
    const videoRefs = useRef([]);
    const [postsData, setPostsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState([]);
    const [isSaved, setIsSaved] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { posts } = await getAllPosts();
                // Filter only posts with type "video"
                const videoPosts = posts.filter(post => post.post_type === "video");
                setPostsData(videoPosts);
                setLikedPosts(new Array(videoPosts.length).fill(false));
                setIsSaved(new Array(videoPosts.length).fill(false));
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        let debounceTimer;

        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight;
            clearTimeout(debounceTimer);

            debounceTimer = setTimeout(() => {
                videoRefs.current.forEach((video, index) => {
                    const videoPosition = video.getBoundingClientRect().top + video.offsetHeight / 2;

                    if (scrollPosition > videoPosition && videoPosition > 0 && videoPosition <= video.offsetHeight) {
                        if (video.paused) {
                            video.play();
                            setActiveVideo(index);
                        }
                    } else {
                        if (!video.paused) {
                            video.pause();
                        }
                    }
                });
            }, 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const togglePlayPause = (index) => {
        const video = videoRefs.current[index];
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    const toggleMute = (video) => {
        video.muted = !video.muted;
    };

    const toggleFollow = (e) => {
        const button = e.currentTarget;
        button.classList.toggle('following');
        button.innerHTML = button.classList.contains('following') ? 'Following' : 'Follow';
    };

    const handleSaveToggle = (index) => {
        setIsSaved(prevSaved => {
            const updatedSaved = [...prevSaved];
            updatedSaved[index] = !updatedSaved[index];
            return updatedSaved;
        });
    };



    const handleLikeToggle = async (postId, index) => {
        try {
            let updatedLikeCount;

            if (likedPosts[index]) {
                const response = await deleteLike(postsData[index].like_id);
                updatedLikeCount = response.updated_like_count;
            } else {
                const response = await likePost(postId);
                updatedLikeCount = response.updated_like_count;
                postsData[index].like_id = response.like.id;
            }

            setPostsData(prevPosts => {
                const updatedPosts = [...prevPosts];
                updatedPosts[index] = {
                    ...updatedPosts[index],
                    like_count: updatedLikeCount,
                };
                return updatedPosts;
            });

            setLikedPosts(prevLikedPosts => {
                const updatedLikes = [...prevLikedPosts];
                updatedLikes[index] = !updatedLikes[index];
                return updatedLikes;
            });
        } catch (error) {
            console.error("Error toggling like:", error.message);
        }
    };
    const hideShowComment = ()=>{

    }
    return (
        <div className="post_page">
            <div className="nav_menu">
                {/* Your navigation menu can go here */}
            </div>
            <div className="reels">
                {loading ? (
                    <p>Loading...</p>
                ) : postsData.length === 0 ? (
                    <p>No video posts available</p>
                ) : (
                    postsData.map((post, index) => (
                        <div className="reel" key={index}>
                            <div className="video">
                                <video
                                    ref={(el) => videoRefs.current[index] = el}
                                    src={post.media_links[0]} // Displaying the first video link
                                    loop
                                    muted
                                    onClick={() => togglePlayPause(index)}
                                />
                                <div className="content">
                                    <div className="sound">
                                        <img
                                            className="volume-up"
                                            src="./images/volume-up.png"
                                            onClick={() => toggleMute(videoRefs.current[index])}
                                        />
                                        <img
                                            className="volume-mute"
                                            src="./images/volume-mute.png"
                                            onClick={() => toggleMute(videoRefs.current[index])}
                                        />
                                    </div>
                                    <div className="info">
                                        <div className="profile">
                                            <h4>
                                                <a href="#">
                                                    <img src="./images/profile_img.jpg" alt="profile"/>
                                                    {post.username}
                                                </a> - .
                                            </h4>
                                            <button className="follow_text" onClick={toggleFollow}>Follow</button>
                                        </div>
                                        <div className="desc">
                                            <p>{post.content}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="likes">
                                <div className="like" onClick={() => handleLikeToggle(post.id, index)}>
                                    <img className="not_loved"
                                         src={likedPosts[index] ? './images/heart.png' : './images/love.png'}
                                         alt="like icon"/>
                                </div>
                                <div className="save" onClick={() => handleSaveToggle(index)}>
                                    <img className={`saved ${isSaved[index] ? '' : 'hide'}`}
                                         src="./images/save_black.png"/>
                                    <img className={`not_saved ${isSaved[index] ? 'hide' : ''}`}
                                         src="./images/save-instagram.png"/>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
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
                            {/* Modal content here */}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary">Send</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for add messages*/}
            <div class="modal fade" id="message_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Comments</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="comments">
                                <div class="comment">
                                    <div class="d-flex">
                                        <div class="img">
                                            <img src="./images/profile_img.jpg" alt=""/>
                                        </div>
                                        <div class="content">
                                            <div class="person">
                                                <h4>namePerson</h4>
                                                <span>3j</span>
                                            </div>
                                            <p>Wow amzing shot</p>
                                            <div class="replay">
                                                <button class="replay">replay</button>
                                                <button class="translation">see translation</button>
                                            </div>
                                            <div class="answers">
                                                <button class="see_comment">
                                                    <span class="hide_com">Hide all responses</span>
                                                    <span class="show_c"> <span class="line"></span> See the <span> 1
                                                    </span> answers</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="like">
                                        <img class="not_loved" src="./images/love.png" alt=""/>
                                        <img class="loved" src="./images/heart.png" alt=""/>
                                        <p> 55</p>
                                    </div>
                                </div>
                                <div class="responses">
                                    <div class="response comment">
                                        <div class="d-flex">
                                            <div class="img">
                                                <img src="./images/profile_img.jpg" alt=""/>
                                            </div>
                                            <div class="content">
                                                <div class="person">
                                                    <h4>namePerson</h4>
                                                    <span>3j</span>
                                                </div>
                                                <p>Wow amzing shot</p>
                                                <div class="replay">
                                                    <button>replay</button>
                                                    <button>see translation</button>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="like">
                                            <img class="not_loved" src="./images/love.png" alt=""/>
                                            <img class="loved" src="./images/heart.png" alt=""/>
                                            <p> 55</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <form method="post">
                                <div class="input">
                                    <img src="./images/profile_img.jpg" alt=""/>
                                    <input type="text" id="emoji_comment" placeholder="Add a comment..." />
                                </div>
                                <div class="emogi">
                                    <img src="./images/emogi.png" alt=""/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};