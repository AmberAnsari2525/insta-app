
import axiosinstance from "./AxiosInstance";
import {setToken} from "./Auth";


//Regsiteration user

export const registerUser = async (userData) => {
    try {
        const response = await axiosinstance.post('auth/register', userData)
        if (response.data.token) {
            setToken(response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error(" Registartion Error", error);
        throw error;
    }
};
//Login Api
export const LoginUser = async (userData) => {
    try {
        console.log("Sending data:", userData);
        const response = await axiosinstance.post("auth/login", userData);

        if (response.data.token) {
            setToken(response.data.token);
        }
        return response.data;

    } catch (error) {
        console.error(" Login Error", error);
        throw error;
    }
};

//user profile


export const fetchUserData = async () => {
    try {
        const response = await axiosinstance.get("auth/profile");
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};


//update profile


export const updateProfile = async (formData) => { // Accept FormData
    try {
        const response = await axiosinstance.put('auth/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Important for file uploads
            },
        });
        return response.data; // Return updated profile data
    } catch (error) {
        console.error('Error updating profile:', error.response ? error.response.data : error.message);
        throw error; // Rethrow error to handle it in the UI if needed
    }
};

//update
export const updateUserData = async (data) => {
    try {
        const response = await axiosinstance.post("user/update", data);
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

//user follow profile
export const followUser = async (userId) => {
    try {
        const response = await axiosinstance.put(`/follow/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error following user:", error);
        throw error;
    }
};

//user unfollow
export const unfollowUser = async (userId) => {
    try {
        const response = await axiosinstance.put(`/unfollow/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error unfollowing user:", error);
        throw error;
    }
};

// create post
export const createPost = async (postData) => {
    try {
        const response = await axiosinstance.post('posts', postData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Ensure correct Content-Type for file uploads
            },
        });
        console.log('API call successful:', response); // Additional log
        return response;
    } catch (error) {
        console.error('Error post create:', error);
        throw error;
    }
};

// get all posts
export const getAllPosts = async (postData) => {
    try {
        const response = await axiosinstance.get(`/posts`, postData);
        const { currentPage, totalPages, totalPosts, posts } = response.data;
        return { currentPage, totalPages, totalPosts, posts };
    } catch (error) {
        console.error('Error fetching posts:', error.message || error);
        throw error;
    }
};


// Edit post
export const updatePostData = async (postId, updatedData) => {
    try {
        const response = await axiosinstance.put(`posts/${postId}`, updatedData);
        console.log('Post edited:', response);
        return response;
    } catch (error) {
        console.error('Error editing post:', error);
        throw error;
    }
};
// Function to get a post by its ID
export const getPostById = async (postId) => {
    try {
        const response = await axiosinstance.get(`/posts/${postId}`);

        console.log('Post retrieved:', response.data);
        return response.data; // Return the retrieved post data
    } catch (error) {
        console.error('Error retrieving post:', error);
        throw error; // Propagate the error
    }
};

//delete post
export const deletePost = async (id) => {
    try {
        const response = await axiosinstance.delete(`posts/${id}`);
        console.log('Post deleted:', response);
        return response;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};



//gettingPost API
export const gettingPost = async (page = 1, limit = 3) => {
    try {
        const response = await axiosinstance.get(`posts?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all posts:", error);
        throw error;
    }
};

//get message
export const getMessages = async (senderId, receiverId) => {
    try {
        const response = await axiosinstance.get(`${senderId}/${receiverId}`);
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw error; // Rethrow the error for further handling
    }
};
//get post by id
export const userGetPost = async (id) => {
    try {
        const response = await axiosinstance.get(`user/${id}/posts`); // Use the user ID in the URL
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error fetching user posts by ID:", error);
        throw error;
    }
};

//single post
export const fetchSinglePost = async (post_id) => {
    try {
        const response = await axiosinstance.get(`/posts/${post_id}`);
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error fetching post:", error);
    }
};

//get user by id
export const fetchUserId = async (id) => {
    try {
        const response = await axiosinstance.get(`auth/users/${id}/profile`); // Use the user ID in the URL
        return response.data;
    } catch (error) {
        console.error("Error fetching user data by ID:", error);
        throw error;
    }
};

// delete post




// API call to share the post
export const sharePosts = async (postId, userId) => {
    try {
        // Construct the full endpoint path, replacing `postId` in the URL
        const response = await axiosinstance.post(`/posts/${postId}/shares`, { user_id: userId });
        return response.data;  // Backend should return share details
    } catch (error) {
        // Improved error handling
        const errorMessage = error.response && error.response.data ? error.response.data : error.message;
        throw new Error(errorMessage);
    }
};




//get comment post by id
export const getCommentsById = async (post_id) => {
    try {
        const response = await axiosinstance.get(`posts/${post_id}/comments`);
        return response.data; // Ensure this is an array of comments
    } catch (error) {
        throw error.response ? error.response.data : new Error(error.message);
    }
};


export const addComment = async (post_id, content) => {
    try {
        const response = await axiosinstance.post(`/posts/${post_id}/comments`, {
            comment: content, // Change this from 'content' to 'comment'
            parent_id: null // Include parent_id if needed, set to null by default
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error(error.message);
    }
};



// Like post API
export const likePost = async (postId) => {
    try {
        console.log(`Liking post with ID: ${postId}`);  // Debug log
        const response = await axiosinstance.post(`/posts/${postId}/likes`);
        console.log('Response from likePost:', response.data);  // Debug log
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error(`Post with ID: ${postId} not found`);
            throw new Error("Post not found");
        }
        console.error('Error in likePost API:', error);
        throw error.response ? error.response.data : new Error(error.message);
    }
};


export const deleteLike = async (id) => {
    try {
        console.log(`Deleting like with ID: ${id}`); // Debug log
        const response = await axiosinstance.delete(`/likes/${id}`);
        console.log('Response from deleteLike:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('Error in deleteLike API:', error);
        throw error.response ? error.response.data : new Error(error.message);
    }
};


export const getUser = async () => {
    try {
        const response = await axiosinstance.get("auth/users");
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

//get notification
export const getNotifications = async () => {
    try {
        const response = await axiosinstance.get('notifications');
        return response.data;  // Adjust based on API response
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const changePassword = async (userData) => {
    try {
        const response = await axiosinstance.post("auth/change-password", userData);
        return response.data; // Assuming API returns a message or token
    } catch (error) {
        console.error("Change password Error", error);
        throw error;
    }
};

export const createUserStory = async (userData) => {
    try {
        const token = "your_bearer_token_here"; // Replace with your actual token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`, // Ensure correct Authorization header
                'Content-Type': 'multipart/form-data', // Specify multipart form data
            }
        };

        const response = await axiosinstance.post('upload', userData, config);
        return response.data; // Return the response from the server
    } catch (error) {
        console.error('Error uploading story:', error);
        throw error; // Re-throw the error to handle it in the calling function
    }
};

export const fetchStories = async () => {
    try {
        const response = await axiosinstance.get(`stories`); // Ensure this is the correct endpoint
        console.log('API Response:', response); // Log the entire response
        return response.data; // Return the data as before
    } catch (error) {
        console.error('Error fetching stories:', error);
        throw error; // Re-throw the error for handling
    }
};


//account setting

export const accountSettings = async (privacyStatus, userId) => {
    try {
        // Corrected URL without the redundant "api/"
        const response = await axiosinstance.put(`auth/users/${userId}/setAccountPrivacy`, {
            privacy: privacyStatus,
        });

        console.log('API Response:', response);
        return response.data;
    } catch (error) {
        if (error.response?.status === 403) {
            console.error('Forbidden: Check user permissions or endpoint restrictions');
        } else {
            console.error('Error updating account privacy:', error.response?.data?.message || error.message);
        }
        throw error;
    }
};


export const sendMessage = async (data) => {


    try {
        const response = await axiosinstance.post('send', data);
        console.log('API Response:', response); // Log the entire response
        return response.data; // Return the data as before
    } catch (error) {
        console.error('error send message:', error);
        throw error; // Re-throw the error for handling
    }
}
export const fetchMessages = async (sender_id, receiver_id) => {

    try {
        const response = await axiosinstance.get(`/${sender_id}/${receiver_id}`);
        console.log('API Response:', response); // Log the entire response
        return response.data; // Return the data as before
    } catch (error) {
        console.error('error received message message:', error);
        throw error; // Re-throw the error for handling
    }
}


