import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const recentUsers = [
  {
    id: '1',
    name: 'Paquibot, Alvin',
    avatar: require('../../assets/images/sample_pic.jpg'),
    time: '4 nov',
  },
  {
    id: '2',
    name: 'Ma-asin, Shaira Mae',
    avatar: require('../../assets/images/sample_pic.jpg'),
    time: '4 nov',
  },
  {
    id: '3',
    name: 'Vaflor, Paul Vincent',
    avatar: require('../../assets/images/sample_pic.jpg'),
    time: '4 nov',
  },
  {
    id: '4',
    name: 'Aboloc, Angel Khyla',
    avatar: require('../../assets/images/sample_pic.jpg'),
    time: '4 nov',
  },
];

export default function SearchPage() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filteredUsers = search
    ? recentUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
    : recentUsers;

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      {/* Search Bar */}
      <View style={styles.searchBarWrapper}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#174f84"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {/* Recent Section */}
      <View style={styles.recentHeaderRow}>
        <Text style={styles.recentHeader}>Recent</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      {/* Recent Users List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <Image source={item.avatar} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userTime}>{item.time}</Text>
            </View>
            <TouchableOpacity style={styles.menuBtn}>
              <FontAwesome name="ellipsis-v" size={20} color="#174f84" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    paddingHorizontal: 0,
  },
  searchBarWrapper: {
    backgroundColor: '#174f84',
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 40,
  },
  searchBar: {
    backgroundColor: '#e3ecf7',
    borderRadius: 20,
    paddingHorizontal: 18,
    height: 40,
    fontSize: 16,
    color: '#174f84',
    marginLeft: 50,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  recentHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  seeAll: {
    color: '#174f84',
    fontWeight: 'bold',
    fontSize: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  userTime: {
    fontSize: 12,
    color: '#888',
  },
  menuBtn: {
    padding: 8,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    backgroundColor: 'transparent',
    padding: 5,
    borderRadius: 10,
  },
});
