import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { API_BASE_URL, checkFollowStatus, followUser, getSuggestedUsers } from '../../services/api';

interface SuggestedUser {
  id: number;
  name: string;
  profile_pic: string;
  batch?: string | number;
}

export default function PeopleYouMayKnowScreen() {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();

  useEffect(() => {
    loadSuggestedUsers();
  }, []);

  const loadSuggestedUsers = async () => {
    try {
      setLoading(true);
      const data = await getSuggestedUsers();
      if (data.success) {
        const usersWithFollowStatus = await Promise.all(
          data.users.map(async (user: any) => {
            try {
              const followStatus = await checkFollowStatus(user.id);
              return { ...user, isFollowing: followStatus.is_following };
            } catch {
              return { ...user, isFollowing: false };
            }
          })
        );
        const unfollowedUsers = usersWithFollowStatus.filter((user: any) => !user.isFollowing);
        setSuggestedUsers(unfollowedUsers);
      }
    } catch (error) {
      console.error('Error loading suggested users:', error);
      Alert.alert('Error', 'Failed to load suggested users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: number) => {
    setFollowLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const result = await followUser(userId);
      if (result.success) {
        setSuggestedUsers(prev => prev.filter(u => u.id !== userId));
        Alert.alert('Success', 'You are now following this user!');
      }
    } catch (error) {
      console.error('Error following user:', error);
      Alert.alert('Error', 'Failed to follow user. Please try again.');
    } finally {
      setFollowLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleRemove = (userId: number) => {
    setSuggestedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleUserPress = (userId: number) => {
    router.push(`/profile/profilepage?viewUserId=${userId}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>People you may know</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <FontAwesome name="ellipsis-h" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <FontAwesome name="times" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {suggestedUsers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users to display</Text>
          </View>
        ) : (
          suggestedUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <TouchableOpacity 
                style={styles.userInfo} 
                onPress={() => handleUserPress(user.id)}
              >
                <Image
                  source={{
                    uri: user.profile_pic
                      ? (String(user.profile_pic).startsWith('http') || String(user.profile_pic).startsWith('data:'))
                        ? user.profile_pic
                        : `${API_BASE_URL}${user.profile_pic}`
                      : 'https://via.placeholder.com/60x60?text=U'
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <View style={styles.mutualFriendsRow}>
                    <View style={styles.mutualFriendsAvatars}>
                      <View style={styles.mutualAvatar}>
                        <FontAwesome name="user" size={12} color="#666" />
                      </View>
                      <View style={styles.mutualAvatar}>
                        <FontAwesome name="user" size={12} color="#666" />
                      </View>
                    </View>
                    <Text style={styles.mutualFriendsText}>5 mutual friends</Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.followButton}
                  onPress={() => handleFollow(user.id)}
                  disabled={followLoading[user.id]}
                >
                  <FontAwesome name="user-plus" size={14} color="#fff" />
                  <Text style={styles.followButtonText}>
                    {followLoading[user.id] ? '...' : 'Follow'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(user.id)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e3a8a',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  mutualFriendsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mutualFriendsAvatars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  mutualAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  mutualFriendsText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  followButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3a8a',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  removeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#666',
    fontSize: 14,
  },
});
