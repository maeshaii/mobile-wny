import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function PostScreen() {
  const router = useRouter();

  // Dummy user info for demonstration
  const user = {
    name: 'Angel Khyla Marie I. Aboloc',
    avatar: require('../../assets/images/sample_pic.jpg'),
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarButtonLeft} onPress={() => router.back()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>CREATE A POST</Text>
        <TouchableOpacity style={styles.topBarButtonRight}>
          <Text style={styles.postButton}>POST</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />
    
      {/* User Info */}
      <View style ={styles.postContainer}>
      <View style={styles.userRow}>
        <Image source={user.avatar} style={styles.avatar} />
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      {/* Post Input */}
      <TextInput
        style={styles.input}
        placeholder="Start a post..."
        multiline
        numberOfLines={6}
      />
      </View> 

      {/* Add Image Section */}
      <View style={styles.addImageContainer}>
        <View style={styles.addImageRow}>
          <FontAwesome name="image" size={32} color="#4B944D" style={styles.addImageIcon} />
          <Text style={styles.addImageText}>Add Image</Text>
        </View>
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
});
