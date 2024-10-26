import React, { useState, useEffect, useRef } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { createUserStory, fetchStories } from "../Services/api";

export const Storybook = () => {
    const [files, setFiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [storiesData, setStoriesData] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);
    const [isUploadMode, setIsUploadMode] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        const loadStories = async () => {
            try {
                const { stories } = await fetchStories();
                setStoriesData(stories);
            } catch (error) {
                console.error("Error loading stories:", error);
            }
        };
        loadStories();
    }, []);

    useEffect(() => {
        // Automatically move to the next story every 30 seconds
        intervalRef.current = setInterval(() => {
            handleNextStory();
        }, 30000);

        // Clear interval on component unmount
        return () => clearInterval(intervalRef.current);
    }, [currentIndex, storiesData]);

    const handleNextStory = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % storiesData.length);
    };

    const handlePreviousStory = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? storiesData.length - 1 : prevIndex - 1
        );
    };

    const handleFileUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

        if (selectedFiles.length > 0) {
            setPreviewUrl(URL.createObjectURL(selectedFiles[0]));
            setIsUploadMode(true);
            setShowModal(true);
        }
    };

    const createStory = async () => {
        if (files.length === 0) {
            Swal.fire('Error', 'Please upload at least one file.', 'error');
            return;
        }

        const uploadedStories = [];
        for (let file of files) {
            const storyFormData = new FormData();
            storyFormData.append('image_url', file);

            try {
                const response = await createUserStory(storyFormData);
                uploadedStories.push(response.story); // Assuming API returns the created story data
            } catch (error) {
                Swal.fire('Error', 'Failed to add story.', 'error');
            }
        }

        if (uploadedStories.length > 0) {
            Swal.fire('Success', 'Stories added successfully!', 'success');
            setStoriesData([...storiesData, ...uploadedStories]);
            setShowModal(false);
            setFiles([]);
            setPreviewUrl(null);
            setIsUploadMode(false);
        }
    };

    const openStoryModal = (story, index) => {
        setSelectedStory(story);
        setCurrentIndex(index);
        setIsUploadMode(false);
        setShowModal(true);
    };

    return (
        <>
            <section className="check">
                <div className="arrow-btn left-icon" onClick={handlePreviousStory}>
                    <FaAngleLeft />
                </div>
                <div className="arrow-btn right-icon" onClick={handleNextStory}>
                    <FaAngleRight />
                </div>
                <div className="carousel-body">
                    <div className="stories">
                        <div className="owl-carousel items owl-loaded owl-drag">
                            <div className="owl-stage-outer">
                                <div className="owl-stage">
                                    <div className="owl-item active" style={{ width: '62.857px', marginRight: '5px' }}>
                                        <div className="item_s" onClick={() => document.getElementById('file-input').click()}>
                                            <img src="./images/story.png" alt="Create Story" style={{ objectFit: 'cover' }} />
                                            <p>Create Story</p>
                                        </div>
                                    </div>
                                    {storiesData.map((story, index) => (
                                        <div
                                            key={index}
                                            className="owl-item active"
                                            style={{ width: '62.857px', marginRight: '5px' }}
                                            onClick={() => openStoryModal(story, index)}
                                        >
                                            <div className="item_s">
                                                <img src={story.image_url[0]} alt={story.username} style={{ objectFit: 'cover' }} />
                                                <p>{story.username}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <input
                    type="file"
                    id="file-input"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />

                {showModal && (
                    <div
                        className="modal"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 1000,
                        }}
                    >
                        <div
                            className="modal-mobile-content"
                            style={{
                                width: '90%',
                                maxWidth: '400px',
                                backgroundColor: 'white',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div className="modal-header" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '15px',
                                borderBottom: '1px solid #ddd',
                            }}>
                                <h1 className="modal-title w-100 fs-5" style={{ margin: 0 }}>
                                    {isUploadMode ? 'Create new post' : selectedStory?.username}
                                </h1>
                                {isUploadMode && (
                                    <button onClick={createStory} className="btn btn-primary">
                                        Upload
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body" style={{ padding: '10px' }}>
                                {isUploadMode ? (
                                    <div id="image-container">
                                        {previewUrl && (
                                            <img
                                                src={previewUrl}
                                                alt="Selected"
                                                style={{ width: '100%', objectFit: 'cover' }}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <img
                                        src={selectedStory?.image_url[0]}
                                        alt="Story"
                                        style={{ width: '100%', objectFit: 'cover' }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
};


