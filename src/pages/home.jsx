
import React, {useState} from 'react'
import {Storybook} from "./story";
import {AllPost} from "./getpostAll";
export const Home = () =>{


    //dummy post data
    const postsData = [
        ['https://i.ibb.co/3S1hjKR/account1.jpg', 'zineb', 45, 'https://i.ibb.co/Jqh3rHv/img1.jpg', 150, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima accusantium aperiam quod non minus cumque, recusandae hic soluta harum aut nulla...', 2],
        ['https://i.ibb.co/8x4Hqdw/account2.jpg', 'ikram', 15, 'https://i.ibb.co/2ZxBFVp/img2.jpg', 150, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima accusantium aperiam quod non minus cumque, recusandae hic soluta harum aut nulla...', 2],
        ['https://i.ibb.co/CWbynB2/account3-1.jpg', 'amina', 5, 'https://i.ibb.co/5vQt677/img3.jpg', 350, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima accusantium aperiam quod non minus cumque, recusandae hic soluta harum aut nulla...', 2],
        ['https://i.ibb.co/19R19st/account4.jpg', 'amal', 15, 'https://i.ibb.co/FVVxR6x/img.jpg', 150, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima accusantium aperiam quod non minus cumque, recusandae hic soluta harum aut nulla...', 2],
        ['https://i.ibb.co/x68ZFKP/account6.jpg', 'amine', 15, 'https://i.ibb.co/r7xBR56/img5.jpg', 150, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima accusantium aperiam quod non minus cumque, recusandae hic soluta harum aut nulla...', 2],
    ];

    const [isSaved, setIsSaved] =useState(new Array(postsData.length).fill(false))

    const handleSaveToggle = (index) => {
        setIsSaved((prevSavedPosts) => {
            const updatedLikes = [...prevSavedPosts];
            updatedLikes[index] = !updatedLikes[index];
            return updatedLikes;
        });
    };

    const [likedPosts, setLikedPosts] = useState(new Array(postsData.length).fill(false));

    const handleLikeToggle = (index) => {
        setLikedPosts((prevLikedPosts) => {
            const updatedLikes = [...prevLikedPosts];
            updatedLikes[index] = !updatedLikes[index];
            return updatedLikes;
        });
    };
    return(
        <>

            <div className="post_page">
                <div className="nav_menu">
                </div>
                <div className="second_container">
                    <div className="main_section">
                            <div className="posts_container">
                                <Storybook/>
                                <div className="posts">
                                <AllPost/>

                            </div>


                        </div>
                    </div>

                    {/* posts_container end*/}


                </div>


                {/*modal for share post*/}
              {/*  <div className="modal fade" id="send_message_modal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Share</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                 Modal content here
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary">Send</button>
                            </div>
                        </div>
                    </div>
                </div>*/}

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
                                <div className="comment">
                                    <div className="d-flex">
                                        <div className="img">
                                            <img src="./images/profile_img.jpg" alt=""/>
                                        </div>
                                        <div className="content">
                                            <div className="person">
                                                <h4>namePerson</h4>
                                                <span>3j</span>
                                            </div>
                                            <p>Wow amzing shot</p>
                                            <div className="replay">
                                                <button className="replay">replay</button>
                                                <button className="translation">see translation</button>
                                            </div>
                                            <div className="answers">
                                                <button className="see_comment">
                                                    <span className="hide_com">Hide all responses</span>
                                                    <span className="show_c"> <span
                                                        className="line"></span> See the <span> 1
                                                    </span> answers</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="like">
                                        <img className="not_loved" src="./images/love.png" alt=""/>
                                        <img className="loved" src="./images/heart.png" alt=""/>
                                        <p> 55</p>
                                    </div>
                                </div>
                                <div className="responses">
                                    <div className="response comment">
                                        <div className="d-flex">
                                            <div className="img">
                                                <img src="./images/profile_img.jpg" alt=""/>
                                            </div>
                                            <div className="content">
                                                <div className="person">
                                                    <h4>namePerson</h4>
                                                    <span>3j</span>
                                                </div>
                                                <p>Wow amzing shot</p>
                                                <div className="replay">
                                                    <button>replay</button>
                                                    <button>see translation</button>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="like">
                                            <img className="not_loved" src="./images/love.png" alt=""/>
                                            <img className="loved" src="./images/heart.png" alt=""/>
                                            <p> 55</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <form method="post">
                                <div className="input">
                                    <img src="./images/profile_img.jpg" alt=""/>
                                    <input type="text" id="emoji_comment" placeholder="Add a comment..."/>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}
