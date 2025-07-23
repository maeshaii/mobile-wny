import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // ✅ Use useRouter from expo-router

const NavBar = () => {
  const router = useRouter(); // ✅ This replaces useNavigation()

  return (
    <View style={styles.navBarContainer}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={16} color="black" style={styles.searchIcon} />
        <TextInput placeholder="Search..." style={styles.searchInput} />
      </View>

      {/* Navigation Icons */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.push('/homepage/home')}>
          <FontAwesome name="home" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/notifications/notification')}>
          <FontAwesome name="bell" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/messages')}>
          <MaterialIcons name="email" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Feather name="user" size={24} color="white" />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBarContainer: {
    backgroundColor: '#1C4E80',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 35,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'white',
  },
});

export default NavBar;