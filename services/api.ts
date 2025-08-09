import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Use API_BASE_URL from environment variables if available
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL || process.env.API_BASE_URL || 'http://192.168.254.135:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });
        await SecureStore.setItemAsync('accessToken', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        await logoutUser();
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (acc_username: string, acc_password: string) => {
  try {
    const response = await api.post('/api/token/', {
      acc_username,
      acc_password,
    });
    const data = response.data;
    if (data.access && data.refresh) {
      await SecureStore.setItemAsync('accessToken', data.access);
      await SecureStore.setItemAsync('refreshToken', data.refresh);
      await SecureStore.setItemAsync('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getAccessToken = async () => {
  return await SecureStore.getItemAsync('accessToken');
};

export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync('refreshToken');
};

export const getUserInfo = async () => {
  const user = await SecureStore.getItemAsync('user');
  return user ? JSON.parse(user) : null;
};

export const logoutUser = async () => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
  await SecureStore.deleteItemAsync('user');
};

// Notifications API
export const getNotifications = async (userId: number) => {
  try {
    const response = await api.get(`/api/notifications/?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const deleteNotifications = async () => {
  try {
    const response = await api.delete('/api/notifications/delete/');
    return response.data;
  } catch (error) {
    console.error('Error deleting notifications:', error);
    throw error;
  }
};

// Tracker Forms API
export const getActiveTrackerForm = async () => {
  try {
    const response = await api.get('/api/tracker/active-form/');
    return response.data;
  } catch (error) {
    console.error('Error fetching active tracker form:', error);
    throw error;
  }
};

export const getTrackerQuestions = async () => {
  try {
    const response = await api.get('/api/tracker/questions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching tracker questions:', error);
    throw error;
  }
};

export const submitTrackerResponse = async (formData: any) => {
  try {
    const response = await api.post('/api/tracker/responses/', formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting tracker response:', error);
    throw error;
  }
};

export const checkUserTrackerStatus = async () => {
  try {
    const response = await api.get('/api/tracker/check-status/');
    return response.data;
  } catch (error) {
    console.error('Error checking tracker status:', error);
    throw error;
  }
};

// Alumni Statistics API
export const getAlumniStatistics = async () => {
  try {
    const response = await api.get('/api/alumni/statistics/');
    return response.data;
  } catch (error) {
    console.error('Error fetching alumni statistics:', error);
    throw error;
  }
};

// Alumni List API
export const getAlumniList = async () => {
  try {
    const response = await api.get('/api/alumni/list/');
    return response.data;
  } catch (error) {
    console.error('Error fetching alumni list:', error);
    throw error;
  }
};

// Send Reminder API
export const sendReminder = async () => {
  try {
    const response = await api.post('/api/send-reminder/');
    return response.data;
  } catch (error) {
    console.error('Error sending reminder:', error);
    throw error;
  }
};

// Posts API
export const getPosts = async () => {
  try {
    const response = await api.get('/api/posts/');
    return response.data.posts || []; 
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const createPost = async (postData: {
  post_title: string;
  post_content: string;
  post_image?: string;
  post_cat_id: number;
  type?: string;
}) => {
  try {
    const response = await api.post('/api/posts/', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const likePost = async (postId: number) => {
  try {
    const response = await api.post(`/api/posts/${postId}/like/`);
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

export const unlikePost = async (postId: number) => {
  try {
    const response = await api.delete(`/api/posts/${postId}/like/`);
    return response.data;
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

export const commentOnPost = async (postId: number, commentContent: string) => {
  try {
    const response = await api.post(`/api/posts/${postId}/comments/`, {
      comment_content: commentContent,
    });
    return response.data;
  } catch (error) {
    console.error('Error commenting on post:', error);
    throw error;
  }
};

export const getPostComments = async (postId: number) => {
  try {
    const response = await api.get(`/api/posts/${postId}/comments/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post comments:', error);
    throw error;
  }
};

export const deletePost = async (postId: number) => {
  try {
    const response = await api.delete(`/api/posts/${postId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Post Categories API
export const getPostCategories = async () => {
  try {
    const response = await api.get('/api/post-categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching post categories:', error);
    throw error;
  }
};

// Repost API
export const repostPost = async (postId: number) => {
  try {
    const response = await api.post(`/api/posts/${postId}/repost/`);
    return response.data;
  } catch (error) {
    console.error('Error reposting post:', error);
    throw error;
  }
};

export const deleteRepost = async (repostId: number) => {
  try {
    const response = await api.delete(`/api/reposts/${repostId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting repost:', error);
    throw error;
  }
};

export const updateProfile = async (bio: string, profile_pic: string) => {
  try {
    const response = await api.put('/api/profile/update/', { bio, profile_pic });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}; 