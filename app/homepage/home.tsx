import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, } from 'react-native';
import NavBar from '../(tabs)/navbar';
import { API_BASE_URL, checkFollowStatus, commentOnPost, followUser, getPostLikes, getPostReposts, getPosts, getSuggestedUsers, getUserInfo, likePost, logoutUser, repostPost, unlikePost } from '../../services/api';

interface Post {
  post_id: number;
  post_title: string;
  post_content: string;
  post_image: string;
  user: {
    f_name: string;
    l_name: string;
    profile_pic: string;
  };
  likes: any[];
  comments: any[];
  reposts: any[];
  reposts_count: number;
  created_at: string;
  type: string;
}

interface UserInfo {
  name?: string;
  f_name?: string;
  l_name?: string;
  profile_pic?: string;
  course?: string;
  year_graduated?: number;
}

function initials(fname?: string, lname?: string) {
  const a = (fname || '').trim();
  const b = (lname || '').trim();
  const i1 = a ? a[0] : '';
  const i2 = b ? b[0] : '';
  return (i1 + i2 || 'U').toUpperCase();
}

const HomeScreen = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({ name: '', course: '', year_graduated: '', profile_pic: '' });
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [likesLoading, setLikesLoading] = useState(false);
  const [likesList, setLikesList] = useState<{ user_id: number; f_name: string; l_name: string; profile_pic?: string }[]>([]);
  const [repostsModalVisible, setRepostsModalVisible] = useState(false);
  const [repostsLoading, setRepostsLoading] = useState(false);
  const [repostsList, setRepostsList] = useState<{ user_id: number; f_name: string; l_name: string; profile_pic?: string }[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [peopleYouMayKnowVisible, setPeopleYouMayKnowVisible] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [followLoading, setFollowLoading] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();

  useEffect(() => {
    loadUserInfo();
    loadPosts();
    // Show "People you may know" popup randomly (80% chance for testing)
    const shouldShowPopup = Math.random() < 0.8;
    if (shouldShowPopup) {
      setTimeout(() => {
        loadSuggestedUsers();
      }, 3000); // Show after 3 seconds
    }
  }, []);

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      const userInfo = await getUserInfo();
      if (userInfo) {
        setUser(userInfo);
        setEditData({
          name: userInfo.name || '',
          course: userInfo.course || '',
          year_graduated: userInfo.year_graduated ? String(userInfo.year_graduated) : '',
          profile_pic: userInfo.profile_pic || '',
        });
      } else {
        router.replace('/login/login');
      }
    } catch (err) {
      setError('Failed to load user information');
      console.error('Error loading user info:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      setPostsLoading(true);
      const postsData = await getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
      // Don't show error alert for posts, just log it
    } finally {
      setPostsLoading(false);
    }
  };

  const loadSuggestedUsers = async () => {
    try {
      const data = await getSuggestedUsers();
      if (data.success && data.users.length > 0) {
        // Filter out users that the current user is already following
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
        if (unfollowedUsers.length > 0) {
          setSuggestedUsers(unfollowedUsers.slice(0, 3)); // Show max 3 users
          setPeopleYouMayKnowVisible(true);
        }
      }
    } catch (error) {
      console.error('Error loading suggested users:', error);
    }
  };

  const handleFollow = async (userId: number) => {
    setFollowLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const result = await followUser(userId);
      if (result.success) {
        // Remove the user from the suggested list
        setSuggestedUsers(prev => prev.filter(u => u.id !== userId));
        if (suggestedUsers.length <= 1) {
          setPeopleYouMayKnowVisible(false);
        }
      }
    } catch (error) {
      console.error('Error following user:', error);
      Alert.alert('Error', 'Failed to follow user. Please try again.');
    } finally {
      setFollowLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleRemove = (userId: number) => {
    // Remove the user from the suggested list without following
    setSuggestedUsers(prev => prev.filter(u => u.id !== userId));
    if (suggestedUsers.length <= 1) {
      setPeopleYouMayKnowVisible(false);
    }
  };

  const handleLikePost = async (postId: number, isLiked: boolean) => {
    try {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
      // Refresh posts to get updated like status
      await loadPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like status');
    }
  };

  const handleRepost = async (postId: number) => {
    try {
      await repostPost(postId);
      Alert.alert('Success', 'Post reposted successfully!');
      // Refresh posts to get updated repost status
      await loadPosts();
    } catch (error) {
      console.error('Error reposting:', error);
      Alert.alert('Error', 'Failed to repost. You may have already reposted this.');
    }
  };

  const handleOpenLikes = async (postId: number) => {
    try {
      setLikesLoading(true);
      setLikesModalVisible(true);
      const data = await getPostLikes(postId);
      const arr = Array.isArray(data?.likes) ? data.likes : [];
      setLikesList(arr);
    } catch (error) {
      console.error('Error loading likes list:', error);
      setLikesList([]);
    } finally {
      setLikesLoading(false);
    }
  };

  const handleOpenReposts = async (postId: number) => {
    try {
      setRepostsLoading(true);
      setRepostsModalVisible(true);
      const data = await getPostReposts(postId);
      const arr = Array.isArray(data?.reposts) ? data.reposts : [];
      setRepostsList(arr);
    } catch (error) {
      console.error('Error loading reposts list:', error);
      setRepostsList([]);
    } finally {
      setRepostsLoading(false);
    }
  };

  const handleComment = (postId: number) => {
    router.push({ pathname: '/posts/comments', params: { postId: String(postId) } });
  };

  const submitComment = async () => {
    if (!selectedPostId || !commentText.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    try {
      await commentOnPost(selectedPostId, commentText.trim());
      setCommentText('');
      setCommentModalVisible(false);
      setSelectedPostId(null);
      Alert.alert('Success', 'Comment added successfully!');
      // Refresh posts to get updated comment count
      await loadPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
              router.replace('/login/login');
            } catch (err) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
              console.error('Logout error:', err);
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    if (user) {
      setUser({ 
        ...user, 
        name: editData.name,
        course: editData.course,
        year_graduated: editData.year_graduated ? parseInt(editData.year_graduated) : undefined,
        profile_pic: editData.profile_pic
      });
    }
    setEditModalVisible(false);
    Alert.alert('Profile updated (not saved to backend)');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1d';
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo`;
    return `${Math.floor(diffDays / 365)}y`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadUserInfo}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavBar />
      {/* Header with logout button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => loadSuggestedUsers()}
        >
          <Text style={styles.testButtonText}>Test Popup</Text>
        </TouchableOpacity>
      </View>


      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      {/* Start a Post */}
      <View style={styles.postCard}>
        <View style={styles.postRow}>
          <Image
              source={user?.profile_pic ? { uri: String(user.profile_pic).startsWith('http') || String(user.profile_pic).startsWith('data:') ? String(user.profile_pic) : `${API_BASE_URL}${user.profile_pic}` } : require('../../assets/images/sample_pic.jpg')}
            style={styles.avatar}
          />
            <TouchableOpacity
              style={styles.startPostInputWrapper}
              onPress={() => router.push('/posts/post')}
              activeOpacity={0.8}
            >
              <Text style={styles.startPostText}>Start a post</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Posts Feed */}
        {postsLoading ? (
          <View style={styles.postsLoadingContainer}>
            <ActivityIndicator size="large" color="#1e3a8a" />
            <Text style={styles.loadingText}>Loading posts...</Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.noPostsContainer}>
            <Text style={styles.noPostsText}>No posts yet. Be the first to share something!</Text>
      </View>
        ) : (
          posts.map((post) => {
            const userName = `${post.user?.f_name || ''} ${post.user?.l_name || ''}`.trim() || 'User';
            const userAvatar = post.user?.profile_pic 
              ? { uri: String(post.user.profile_pic).startsWith('http') || String(post.user.profile_pic).startsWith('data:') ? String(post.user.profile_pic) : `${API_BASE_URL}${post.user.profile_pic}` }
              : require('../../assets/images/sample_pic.jpg');
            const isLiked = typeof (post as any).is_liked === 'boolean' ? (post as any).is_liked : Array.isArray((post as any).likes) && (post as any).likes.length > 0;
            const likeCount = (post as any).likes_count ?? ((post as any).likes ? (post as any).likes.length : 0);
            const commentCount = (post as any).comments_count ?? ((post as any).comments ? (post as any).comments.length : 0);
            const repostCount = (post as any).reposts_count ?? ((post as any).reposts ? (post as any).reposts.length : 0);

            // Detect if current user reposted this post
            let reposterName: string | null = null;
            try {
              // get current user id
              // inline require to avoid circular import
              const current = user as any;
              const currentId = current?.id || current?.user_id;
              if (currentId && Array.isArray((post as any).reposts)) {
                const match = (post as any).reposts.find((r: any) => r?.user?.user_id === currentId);
                if (match) {
                  reposterName = `${match.user?.f_name || ''} ${match.user?.l_name || ''}`.trim();
                }
              }
            } catch {}

            return (
              <View key={post.post_id} style={styles.card}>
            <View style={styles.cardHeader}>
                  <Image source={userAvatar} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{userName}</Text>
                    <Text style={styles.meta}>
                      {formatDate(post.created_at)} • 🌐{reposterName ? `  •  Reposted by ${reposterName}` : ''}
                    </Text>
              </View>
            </View>

                {post.post_title && (
                  <Text style={styles.postTitle}>{post.post_title}</Text>
                )}

                <Text style={styles.content}>{post.post_content}</Text>

                {post.post_image && (
                  <Image 
                    source={{ uri: String(post.post_image).startsWith('http') || String(post.post_image).startsWith('data:') ? String(post.post_image) : `${API_BASE_URL}${post.post_image}` }} 
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                )}

            <View style={styles.actionsCountsRow}>
              <TouchableOpacity onPress={() => handleOpenLikes(post.post_id)}>
                <Text style={styles.countText}>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push({ pathname: '/posts/comments', params: { postId: String(post.post_id) } })}>
                <Text style={styles.countText}>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOpenReposts(post.post_id)}>
                <Text style={styles.countText}>{repostCount} {repostCount === 1 ? 'share' : 'shares'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.actionIcon}
                onPress={() => handleLikePost(post.post_id, isLiked)}
              >
                <FontAwesome 
                  name={isLiked ? 'thumbs-up' : 'thumbs-o-up'} 
                  size={18} 
                  color={isLiked ? '#1e3a8a' : '#555'} 
                />
                <Text style={[styles.actionText, isLiked && styles.likedText]}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionIcon}
                onPress={() => handleComment(post.post_id)}
              >
                <FontAwesome name="comment-o" size={18} color="#555" />
                <Text style={styles.actionText}>Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionIcon}
                onPress={() => handleRepost(post.post_id)}
              >
                <FontAwesome name="retweet" size={18} color="#555" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
            );
          })
        )}

        {/* Comment Modal */}
        <Modal visible={commentModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Comment</Text>
              <TextInput
                style={styles.modalInput}
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Write your comment..."
                multiline
                numberOfLines={4}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#1e3a8a' }]}
                  onPress={submitComment}
                >
                  <Text style={{ color: '#fff' }}>Post Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#eee' }]}
                  onPress={() => {
                    setCommentModalVisible(false);
                    setCommentText('');
                    setSelectedPostId(null);
                  }}
                >
                  <Text style={{ color: '#1e3a8a' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Likes Modal */}
        <Modal visible={likesModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback
          onPress={() => {
            setLikesModalVisible(false);
            setLikesList([]);
          }}
        >
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalCenterWrap} pointerEvents="box-none">
          <View style={styles.likesSheet}>
            {/* header */}
            <View style={styles.likesHeader}>
              <Text style={styles.likesTitle}>Likes</Text>
              <TouchableOpacity
                style={styles.likesCloseBtn}
                onPress={() => {
                  setLikesModalVisible(false);
                  setLikesList([]);
                }}
                accessibilityRole="button"
                accessibilityLabel="Close likes"
              >
                <Text style={styles.likesCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* content */}
            {likesLoading ? (
              <View style={styles.likesLoadingWrap}>
                <ActivityIndicator size="small" color="#1e3a8a" />
                <Text style={styles.likesLoadingText}>Loading…</Text>
              </View>
            ) : likesList.length === 0 ? (
              <View style={styles.likesEmptyWrap}>
                <Text style={styles.likesEmptyText}>No likes yet</Text>
              </View>
            ) : (
              <FlatList
                data={likesList}
                keyExtractor={(item) => String(item.user_id)}
                style={{ alignSelf: 'stretch', maxHeight: 320 }}
                ItemSeparatorComponent={() => <View style={styles.likesSeparator} />}
                renderItem={({ item }) => {
                  const full = `${item.f_name || ''} ${item.l_name || ''}`.trim() || 'User';
                  const src =
                    item.profile_pic &&
                    (String(item.profile_pic).startsWith('http') ||
                      String(item.profile_pic).startsWith('data:'))
                      ? { uri: String(item.profile_pic) }
                      : item.profile_pic
                      ? { uri: `${API_BASE_URL}${item.profile_pic}` }
                      : null;

                  return (
                    <View style={styles.likesRow}>
                      {src ? (
                        <Image source={src} style={styles.likesAvatar} />
                      ) : (
                        <View style={[styles.likesAvatar, styles.likesAvatarFallback]}>
                          <Text style={styles.likesAvatarFallbackText}>
                            {initials(item.f_name, item.l_name)}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.likesName} numberOfLines={1}>
                        {full}
                      </Text>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Reposts Modal */}
      <Modal visible={repostsModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* header */}
            <View style={styles.likesHeader}>
              <Text style={styles.likesTitle}>Reposts</Text>
              <TouchableOpacity
                style={styles.likesCloseBtn}
                onPress={() => setRepostsModalVisible(false)}
              >
                <Text style={styles.likesCloseText}>✕</Text>

      {/* People You May Know Modal */}
      <Modal visible={peopleYouMayKnowVisible} transparent animationType="fade">
        <TouchableWithoutFeedback
          onPress={() => setPeopleYouMayKnowVisible(false)}
        >
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalCenterWrap} pointerEvents="box-none">
          <View style={styles.peopleYouMayKnowSheet}>
            {/* header */}
            <View style={styles.peopleYouMayKnowHeader}>
              <Text style={styles.peopleYouMayKnowTitle}>People you may know</Text>
              <TouchableOpacity
                style={styles.peopleYouMayKnowCloseBtn}
                onPress={() => setPeopleYouMayKnowVisible(false)}
              >
                <Text style={styles.peopleYouMayKnowCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* content */}
            <View style={styles.peopleYouMayKnowContent}>
              {suggestedUsers.map((user) => (
                <View key={user.id} style={styles.suggestedUserCard}>
                  <Image
                    source={{
                      uri: user.profile_pic
                        ? (String(user.profile_pic).startsWith('http') || String(user.profile_pic).startsWith('data:'))
                          ? user.profile_pic
                          : `${API_BASE_URL}${user.profile_pic}`
                        : 'https://via.placeholder.com/60x60?text=U'
                    }}
                    style={styles.suggestedUserAvatar}
                  />
                  <View style={styles.suggestedUserInfo}>
                    <Text style={styles.suggestedUserName}>{user.name}</Text>
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
                  <View style={styles.suggestedUserActions}>
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
              ))}
            </View>
          </View>
        </View>
      </Modal>
              </TouchableOpacity>
            </View>

            {/* content */}
            {repostsLoading ? (
              <View style={styles.likesLoadingWrap}>
                <ActivityIndicator size="small" color="#1e3a8a" />
                <Text style={styles.likesLoadingText}>Loading…</Text>
              </View>
            ) : repostsList.length === 0 ? (
              <View style={styles.likesEmptyWrap}>
                <Text style={styles.likesEmptyText}>No reposts yet</Text>
              </View>
            ) : (
              <FlatList
                data={repostsList}
                keyExtractor={(item) => String(item.user_id)}
                style={{ alignSelf: 'stretch', maxHeight: 320 }}
                ItemSeparatorComponent={() => <View style={styles.likesSeparator} />}
                renderItem={({ item }) => {
                  const full = `${item.f_name || ''} ${item.l_name || ''}`.trim() || 'User';
                  const src =
                    item.profile_pic &&
                    (String(item.profile_pic).startsWith('http') ||
                      String(item.profile_pic).startsWith('data:'))
                      ? { uri: String(item.profile_pic) }
                      : item.profile_pic
                      ? { uri: `${API_BASE_URL}${item.profile_pic}` }
                      : null;

                  return (
                    <View style={styles.likesRow}>
                      {src ? (
                        <Image source={src} style={styles.likesAvatar} />
                      ) : (
                        <View style={[styles.likesAvatar, styles.likesAvatarFallback]}>
                          <Text style={styles.likesAvatarFallbackText}>
                            {initials(item.f_name, item.l_name)}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.likesName} numberOfLines={1}>
                        {full}
                      </Text>
                    </View>
                  );
                }}
              />
            )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    paddingHorizontal: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 10,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    width: '100%',
    alignSelf: 'center',
  },
  postRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startPostInputWrapper: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    justifyContent: 'center',
  },
  startPostText: {
    color: '#777',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    width: '100%',
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  meta: {
    fontSize: 12,
    color: '#666',
  },
  followBtn: {
    backgroundColor: '#E6F0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  followText: {
    color: '#1C4E80',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    fontSize: 14,
    marginTop: 10,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  actionIcon: {
    alignItems: 'center',
    gap: 2,
  },
  actionText: {
    fontSize: 12,
    color: '#555',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  testButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  testButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#174f84',
    fontSize: 14,
    fontWeight: '500',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileCourse: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  profileBatch: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  editProfileBtn: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#E6F0FF',
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  saveBtn: {
    backgroundColor: '#174f84',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '45%',
  },
  cancelBtn: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '45%',
  },
  welcomeContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 18,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#174f84',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postsLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
  },
  noPostsText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#ccc',
  },
  actionsCountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  countText: {
    fontSize: 12,
    color: '#666',
  },
  likedText: {
    color: '#1e3a8a',
    fontWeight: 'bold',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)', // slate-900/45
  },
  modalCenterWrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  likesSheet: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  likesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  likesTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  likesCloseBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  likesCloseText: {
    fontSize: 18,
    color: '#334155',
  },
  likesLoadingWrap: {
    alignSelf: 'stretch',
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  likesLoadingText: {
    marginTop: 8,
    color: '#334155',
    fontSize: 13,
  },
  likesEmptyWrap: {
    alignSelf: 'stretch',
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likesEmptyText: {
    color: '#64748b',
    fontSize: 14,
  },
  likesSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e7eb',
    marginLeft: 56, // align under text, not under avatar
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  likesAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#e5e7eb',
  },
  likesAvatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  likesAvatarFallbackText: {
    color: '#1e293b',
    fontWeight: '700',
  },
  likesName: {
    fontSize: 14,
    color: '#0f172a',
    flex: 1,
  },
  likesFooter: {
    paddingTop: 10,
  },
  likesPrimaryBtn: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  likesPrimaryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  peopleYouMayKnowSheet: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  peopleYouMayKnowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  peopleYouMayKnowTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  peopleYouMayKnowCloseBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  peopleYouMayKnowCloseText: {
    fontSize: 18,
    color: '#334155',
  },
  peopleYouMayKnowContent: {
    paddingTop: 12,
  },
  suggestedUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestedUserAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  suggestedUserInfo: {
    flex: 1,
  },
  suggestedUserName: {
    fontSize: 16,
    fontWeight: '600',
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
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  mutualFriendsText: {
    fontSize: 12,
    color: '#666',
  },
  suggestedUserActions: {
    flexDirection: 'row',
    gap: 8,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  removeButtonText: {
    color: '#666',
    fontSize: 12,
  },
});
