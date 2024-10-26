import React, {useContext} from 'react';
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {createPost, fetchUserData, getNotifications} from "../Services/api";
import AuthContext from "../Context/Authcontext";
import { FaUser } from 'react-icons/fa';

export const Navbar = () => {
    const {logout} = useContext(AuthContext);

    const [showVisble, setShowVisible]=useState(false)
    const handleSerachToggle =()=>{
        setShowVisible(!showVisble)
    }

    const [notVisible, setNotVisible] = useState(false);
    const [notifications, setNotifications] = useState([]); // State to hold the fetched notifications
    const [loading, setLoading] = useState(false);  // Loading state
    const [error, setError] = useState(null); // Error state

    const handleNotifiactionToggle = () => {
        setNotVisible(!notVisible);  // Toggle the notification visibility
        if (!notVisible) {  // Only fetch notifications when opening the dropdown
            setLoading(true);
            getNotifications()
                .then((notificationsData) => {
                    setNotifications(notificationsData);  // Set the fetched notifications
                    setLoading(false);
                })
                .catch((err) => {
                    setError('Failed to load notifications');
                    setLoading(false);
                });
        }
    };


    const [step, setStep] = useState(1); // Step to track "Next", "Share", or post submission
    const [selectedImage, setSelectedImage] = useState(null); // Store selected image
    const [description, setDescription] = useState(""); // Store description text
    const [isPostPublished, setIsPostPublished] = useState(false); // Track if post is published
    const [isPostFailed, setIsPostFailed] = useState(false);
    const [userData, setUserData] = useState(null);


// Set up two state variables
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);


    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImageUrl(URL.createObjectURL(file)); // Set the URL for preview
            setSelectedImageFile(file); // Set the file for uploading
        }
    };

    const handleNext = async () => {
        if (step === 1 && selectedImageFile) {
            setStep(2); // Move to step 2 (Write Description)
        } else if (step === 2) {
            try {
                const formData = new FormData();
                formData.append('content', description); // Append the description

                let postType = 'text'; // Default post type
                if (selectedImageFile) {
                    const mediaType = selectedImageFile.type.startsWith('image') ? 'image' : 'video'; // Check the media type
                    postType = mediaType; // Determine the media type
                    formData.append('media_link', selectedImageFile); // Append the selected file for uploading
                }
                formData.append('post_type', postType); // Append the post type

                // API call to create post
                await createPost(formData);

                // Mark the post as published
                setIsPostPublished(true);
                setIsPostFailed(false);

                setTimeout(() => {
                    // Reset the modal after showing the success message
                    setStep(1);
                    setSelectedImageUrl(null);
                    setSelectedImageFile(null);
                    setDescription("");
                    setIsPostPublished(false);
                }, 3000); // Hide the success message after 3 seconds

            } catch (error) {
                console.error("Failed to create post:", error); // Log the entire error object for detailed debugging

                // Extract the error message, if available
                const errorMessage = error.response?.data?.message || "Failed to create post. Please try again.";
                console.log("Error message:", errorMessage); // Log the specific error message

                setIsPostFailed(true);
            }
        }
    };



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



    return (
        <>
            <div>
                {/*nav menu start */}
                <div className="nav_menu">
                    <div className="fix_top">
                        {/*nav for big->medium screen*/}
                        <div className="nav" style={{padding: '20px'}}>
                            <div className="logo">
                                <Link to="/home">
                                    <img className="d-block d-lg-none small-logo" src="./images/instagram.png"
                                         alt="logo"/>
                                    <img className="d-none d-lg-block" src="./images/logo_menu.png" alt="logo"/>
                                </Link>
                            </div>
                            <div className="menu">
                                <ul>
                                    <li>
                                        <Link className="active" to="/home">
                                            <img src="./images/accueil.png" alt="Home"/>
                                            <span className="d-none d-lg-block">Home</span>
                                        </Link>
                                    </li>
                                    {/*   <li id="search_icon" onClick={handleSerachToggle}>
                                        <Link to="#">
                                            <img src="./images/search.png" alt="Search"/>
                                            <span className="d-none d-lg-block search">Search</span>
                                        </Link>
                                    </li>*/}
                                    <li>
                                        <Link to="/all-user">
                                            <FaUser  color="black" />
                                            
                                            <span className="d-none d-lg-block">user</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/explore">
                                            <img src="./images/compass.png" alt="Explore"/>
                                            <span className="d-none d-lg-block">Explore</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/reels">
                                            <img src="./images/video.png" alt="Reels"/>
                                            <span className="d-none d-lg-block">Reels</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/messages">
                                            <img src="./images/send.png" alt="Messages"/>
                                            <span className="d-none d-lg-block">Messages</span>
                                        </Link>
                                    </li>
                                    <li className="notification_icon" onClick={handleNotifiactionToggle}>
                                        <Link to="#">
                                            <img src="./images/love.png" alt="Notifications"/>
                                            <span className="d-none d-lg-block">Notifications</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" data-bs-toggle="modal" data-bs-target="#create_modal">
                                            <img src="./images/tab.png" alt="Create"/>
                                            <span className="d-none d-lg-block">Create</span>
                                        </Link>
                                    </li>
                                    <li>

                                        <Link to="/profile">
                                            <img
                                                className="circle story"
                                                src={userData?.image || './images/profile_img.jpg'}
                                                alt="User Profile"
                                            />
                                            <span className="d-none d-lg-block">Profile</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="more">
                                <div className="btn-group dropup">
                                    <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown"
                                            aria-expanded="false">
                                        <img src="./images/menu.png" alt="Menu"/>
                                        <span className="d-none d-lg-block">More</span>
                                    </button>
                                    <ul className="dropdown-menu">


                                        <li><Link className="dropdown-item" to="/password">
                                            <span>Change Password</span>
                                            {/*<img src="./images/problem.png" alt="Problem"/>*/}
                                        </Link></li>

                                        <li><Link className="dropdown-item" to="/edit-user">
                                            <span>Edit Profile</span>
                                            {/*<img src="./images/problem.png" alt="Problem"/>*/}
                                        </Link></li>
                                        <li><Link className="dropdown-item" to="/account-privacy">
                                            <span>Account Privacy</span>
                                            {/*<img src="./images/problem.png" alt="Problem"/>*/}
                                        </Link></li>

                                        <li><a className="dropdown-item" href="/log-in" onClick={logout}>
                                            <span>Log out</span>
                                        </a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/*nav for small screen*/}
                        <div className="nav_sm">
                            <div className="content">
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle" type="button"
                                            data-bs-toggle="dropdown" aria-expanded="false">
                                        <img className="logo" src="./images/logo_menu.png" alt="Menu Logo"/>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#">
                                            <span>Following</span>
                                            <img src="./images/add-friend.png" alt="Add Friend"/>
                                        </a></li>
                                        <li><a className="dropdown-item" href="#">
                                            <span>Favorites</span>
                                            <img src="./images/star.png" alt="Favorites"/>
                                        </a></li>

                                    </ul>
                                </div>
                                <div className="left">
                                    <div className="search_bar">
                                        <div className="input-group">
                                            <div className="form-outline">
                                                <div>
                                                    <img src="./images/search.png" alt="Search"/>
                                                </div>
                                                <input type="search" id="form1" className="form-control"
                                                       placeholder="Search"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="notifications notification_icon">
                                        <Link to="/notification">
                                            <img src="./images/love.png" alt="Notifications"/>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*nav for ex-small screen */}
                        <div className="nav_xm">
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                    <img className="logo" src="./images/logo_menu.png"/>
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">
                                        <span>Following</span>
                                        <img src="./images/add-friend.png"/>
                                    </a></li>
                                    <li><a className="dropdown-item" href="#">
                                        <span>Favorites</span>
                                        <img src="./images/star.png"/>
                                    </a></li>
                                </ul>
                            </div>
                            <div className="left">
                                <img src="./images/send.png"/>
                                <Link to="/notification">
                                    <img className="notification_icon" src="./images/love.png"/>
                                </Link>

                            </div>
                        </div>

                    </div>
                </div>
                {/* menu in the bottom for small screen */}
                <div className="nav_bottom">
                    <Link to="/home"><img src="./images/accueil.png" alt="Home"/></Link>
                    <Link to="/explore"><img src="./images/compass.png" alt="Explore"/></Link>
                    <Link to="/reels"><img src="./images/video.png" alt="Reels"/></Link>
                    <Link to="#" data-bs-toggle="modal" data-bs-target="#create_modal"><img src="./images/tab.png"
                                                                                            alt="Create"/></Link>
                    <Link to="/profile">
                        <img
                            className="circle story"
                            src={userData?.image || './images/profile_img.jpg'}
                            alt="User Profile"
                        />
                    </Link>

                    <div className="more">
                        <div className="btn-group dropup">
                            <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                <img src="./images/menu.png" alt="Menu"/>

                            </button>
                            <ul className="dropdown-menu">


                                <li><Link className="dropdown-item" to="/password">
                                    <span>Change Password</span>
                                    {/*<img src="./images/problem.png" alt="Problem"/>*/}
                                </Link></li>

                                <li><Link className="dropdown-item" to="/edit-profile">
                                    <span>Edit Profile</span>
                                    {/*<img src="./images/problem.png" alt="Problem"/>*/}
                                </Link></li>

                                <li><a className="dropdown-item" href="/log-in" onClick={logout}>
                                    <span>Log out</span>
                                </a></li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
            {/* search start */}
            <div id="search" className={`search_section ${showVisble ? 'show' : ''}`}>
                <h2>Search</h2>
                <form method="post">
                    <input type="text" placeholder="Search"/>
                </form>
                <div className="find">
                    <div className="desc">
                        <h4>Recent</h4>
                        <p><a href="#">Clear all</a></p>
                    </div>
                    <div className="account">
                        <div className="cart">
                            <div>
                                <div className="img">
                                    <img src="./images/profile_img.jpg" alt=""/>
                                </div>
                                <div className="info">
                                    <p className="name">Zineb_essoussi</p>
                                    <p className="second_name">Zim Ess</p>
                                </div>
                            </div>
                            <div>
                                <a href="#">
                                    <img src="/images/cross.png" alt="Remove"/>
                                </a>
                            </div>
                        </div>
                        <div className="cart">
                            <div>
                                <div className="img">
                                    <img src="./images/profile_img.jpg" alt=""/>
                                </div>
                                <div className="info">
                                    <p className="name">Zineb_essoussi</p>
                                    <p className="second_name">Zim Ess</p>
                                </div>
                            </div>
                            <div>
                                <a href="#">
                                    <img src="./images/cross.png" alt="Remove"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* search start end */}
            {/* notification  start*/}

            <div id="notification" className={`notification_section ${notVisible ? "show" : ""}`}>
                <h2>Notifications</h2>
                <div className="notifications">
                    {loading ? (
                        <p>Loading notifications...</p>
                    ) : (
                        notifications
                            .filter((notif) => notif.message.includes("followed")) // Only show "follow" notifications
                            .map((notif) => (
                                <div key={notif.id} className="notif follow_notif">
                                    <div className="cart">
                                        <div>
                                            <div className="img">
                                                <img src={notif.sender.image} alt={notif.sender.username}/>
                                            </div>
                                            <div className="info">
                                                <p className="name">
                                                    {notif.sender.username}
                                                    <span className="desc">{notif.message}</span>
                                                    <span className="time">
                          {new Date(notif.createdAt).toLocaleTimeString()} {/* Display relative time */}
                        </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="follow_you">
                                            <button className="follow_text">Follow</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>
            {/* Create model*/}
            <div className="modal fade" id="create_modal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title w-100 fs-5 d-flex align-items-end justify-content-between"
                                id="exampleModalLabel">
                            <span className="title_create">
                                {isPostPublished
                                    ? "Post Published"
                                    : isPostFailed
                                        ? "Post Creation Failed"
                                        : step === 1
                                            ? "Create new post"
                                            : "Share"}
                            </span>
                                {!isPostPublished && !isPostFailed && selectedImageFile && (
                                    <button className="next_btn_post btn_link" onClick={handleNext}>
                                        {step === 1 ? "Next" : "Share"}
                                    </button>
                                )}
                            </h1>
                            {!isPostPublished && !isPostFailed && (
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            )}
                        </div>
                        <div className="modal-body">
                            {isPostPublished ? (
                                <div className="post_published">
                                    <img src="./images/uploaded_post.gif" alt="Post Published"/>
                                    <p>Post created successfully!</p>
                                </div>
                            ) : isPostFailed ? (
                                <div className="post_failed">
                                    <p>Failed to create post. Please try again.</p>
                                </div>
                            ) : !selectedImageFile ? (
                                <>
                                    <img className="up_load" src="./images/upload.png" alt="upload"/>
                                    <p>Drag photos and videos here</p>
                                    <button className="btn btn-primary btn_upload">
                                        Select from your computer
                                        <form id="upload-form">
                                            <input
                                                className="input_select"
                                                type="file"
                                                id="image-upload"
                                                name="image-upload"
                                                onChange={handleImageSelect}
                                            />
                                        </form>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div id="image-container">
                                        <img
                                            src={selectedImageUrl}
                                            alt="Selected"
                                            style={{width: "100%", objectFit: "cover"}} // Image styling
                                        />
                                    </div>
                                    {step === 2 && (
                                        <div id="image_description">
                                            <div className="img_p"></div>
                                            <div className="description">
                                                <div className="cart">
                                                    <div>
                                                        <div className="img">
                                                            <img src="./images/profile_img.jpg" alt="profile"/>
                                                        </div>
                                                        <div className="info">
                                                            <p className="name">Zineb_essoussi</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <form>
                                                <textarea
                                                    type="text"
                                                    id="emoji_create"
                                                    placeholder="Write your description here"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                />
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};