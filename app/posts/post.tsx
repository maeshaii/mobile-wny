import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { createPost, getUserInfo, getPostCategories } from '../../services/api';
// @ts-ignore
import * as ImagePicker from 'expo-image-picker';

interface UserInfo {
  name?: string;
  f_name?: string;
  l_name?: string;
  profile_pic?: string;
}

interface PostCategory {
  post_cat_id: number;
  events: boolean;
  announcements: boolean;
  donation: boolean;
  personal: boolean;
}

export default function PostScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user info and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userInfo, categoriesResponse] = await Promise.all([
          getUserInfo(),
          getPostCategories()
        ]);
        
        setUser(userInfo);
        // Extract categories from the response
        const categoriesData = categoriesResponse.categories || [];
        setCategories(categoriesData);
        
        // Set default category to personal (assuming personal has post_cat_id = 4)
        const personalCategory = categoriesData.find((cat: PostCategory) => cat.personal);
        if (personalCategory) {
          setSelectedCategory(personalCategory.post_cat_id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async () => {
    if (!postContent.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    try {
      setSubmitting(true);
      
      const postData = {
        post_title: postTitle.trim() || 'Untitled Post',
        post_content: postContent.trim(),
        post_image: selectedImage || '',
        post_cat_id: selectedCategory,
        type: 'personal', // You can make this dynamic based on category
      };

      await createPost(postData);
      
      Alert.alert('Success', 'Post created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const userName = user ? `${user.f_name || ''} ${user.l_name || ''}`.trim() || 'User' : 'User';
  const userAvatar = user?.profile_pic ? { uri: user.profile_pic } : require('../../assets/images/sample_pic.jpg');

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.topBarButtonLeft} 
          onPress={() => router.back()}
          disabled={submitting}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>CREATE A POST</Text>
        <TouchableOpacity 
          style={[styles.topBarButtonRight, submitting && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#222" />
          ) : (
            <Text style={styles.postButton}>POST</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />
    
      {/* User Info */}
      <View style={styles.postContainer}>
        <View style={styles.userRow}>
          <Image source={userAvatar} style={styles.avatar} />
          <Text style={styles.userName}>{userName}</Text>
        </View>

        {/* Category Selection */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryLabel}>Category:</Text>
          <View style={styles.categoryButtons}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.post_cat_id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.post_cat_id && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(category.post_cat_id)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category.post_cat_id && styles.selectedCategoryText
                ]}>
                  {category.personal ? 'Personal' : 
                   category.events ? 'Events' : 
                   category.announcements ? 'Announcements' : 
                   category.donation ? 'Donation' : 'Other'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Post Title */}
        <TextInput
          style={styles.titleInput}
          placeholder="Post title (optional)..."
          value={postTitle}
          onChangeText={setPostTitle}
          maxLength={255}
        />

        {/* Post Input */}
        <TextInput
          style={styles.input}
          placeholder="Start a post..."
          multiline
          numberOfLines={6}
          value={postContent}
          onChangeText={setPostContent}
          maxLength={1000}
        />

        {/* Character Count */}
        <Text style={styles.charCount}>{postContent.length}/1000</Text>
      </View> 

      {/* Add Image Section */}
      <View style={styles.addImageContainer}>
        <TouchableOpacity style={styles.addImageRow} onPress={pickImage}>
          <FontAwesome name="image" size={32} color="#4B944D" style={styles.addImageIcon} />
          <Text style={styles.addImageText}>
            {selectedImage ? 'Image Selected' : 'Add Image'}
          </Text>
        </TouchableOpacity>
        {selectedImage && (
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}
            >
              <Text style={styles.removeImageText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 16 ,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 35,
    position: 'relative',
    height: 40,
},
topBarButtonLeft: {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  justifyContent: 'center',
  paddingHorizontal: 10,
},
topBarButtonRight: {
  position: 'absolute',
  right: 0,
  top: 0,
  bottom: 0,
  justifyContent: 'center',
  paddingHorizontal: 10,
},
  closeIcon: { 
    fontSize: 24, 
    color: '#333' 
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
    flex: 1,
},
  postButton: { 
    color: '#222', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  userRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12,
    marginTop: 10,
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginRight: 10 
  },
  userName: { 
    fontWeight: 'bold', 
    fontSize: 15, 
    color: '#222' 
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  addImageContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    // iOS shadow (top only)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    // Android shadow
    elevation: 4,
    // Optional: add a thin border at the top
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
    marginTop: 30,
  },
  addImageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addImageIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  addImageText: {
    color: '#4B944D',
    fontWeight: 'bold',
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginBottom: 10,
  },
  postContainer: {
    marginTop: 1,
    borderTopColor: '#1C4E80',
  },
  categoryContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginVertical: 5,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCategory: {
    backgroundColor: '#4B944D',
    borderColor: '#4B944D',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  titleInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  charCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: -10,
    marginBottom: 10,
  },
  selectedImageContainer: {
    position: 'relative',
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  disabledButton: {
    opacity: 0.7,
  },
});
