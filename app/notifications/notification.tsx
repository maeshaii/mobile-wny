import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import NavBar from '../(tabs)/navbar';
import { useRouter } from 'expo-router';

interface NotificationItem {
    name: string;
    message: string;
    date: string;
    avatarImage?: any;
    read?: boolean;
}

const samplePic = require('../../assets/images/sample_pic.jpg');

const notificationsData: NotificationItem[] = [
    {
        name: 'TRACKER',
        message: 'Lorem ipsum dolor sit amet. Quo asperiores enim ut veniamrepudiandae eum quisquam voluptatem',
        date: '2/20/25',
        avatarImage: samplePic,
    },
    {
        name: 'Ma-asin, Shaira Mae',
        message: 'Lorem ipsum dolor sit amet. Quo asperiores enim ut veniamrepudiandae eum quisquam voluptatem',
        date: '2/20/25',
        avatarImage: samplePic,
    },
    {
        name: 'Vaflor, Paul Vincent',
        message: 'Lorem ipsum dolor sit amet. Quo asperiores enim ut veniamrepudiandae eum quisquam voluptatem',
        date: '2/20/25',
        avatarImage: samplePic,
    },
    {
        name: 'Aboloc, Angel Khyla',
        message: 'Lorem ipsum dolor sit amet. Quo asperiores enim ut veniamrepudiandae eum quisquam voluptatem',
        date: '2/20/25',
        avatarImage: samplePic,
    },
    {
        name: 'Paquibot, Alvin',
        message: 'Lorem ipsum dolor sit amet. Quo asperiores enim ut veniamrepudiandae eum quisquam voluptatem',
        date: '2/20/25',
        avatarImage: samplePic,
    },
];

const NotificationScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState<'All' | 'Unread'>('All');
    const router = useRouter();

    return (
        <View style={styles.container}>
            <NavBar />
            {/* Notifications Header */}
            <View style={styles.notificationsHeader}>
                <Text style={styles.notificationsTitle}>Notifications</Text>
                
            </View>
            {/* Earlier Section */}
            <Text style={styles.earlier}>Earlier</Text>
            {/* Notifications List */}
            <FlatList
                data={notificationsData}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.notification}
                        onPress={() => {
                            if (item.name === 'TRACKER') router.push('/forms/forms');
                        }}
                    >
                        <Image source={item.avatarImage} style={styles.avatar} />
                        <View style={styles.messageBox}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.message}>{item.message}</Text>
                        </View>
                        <Text style={styles.date}>{item.date}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    topNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#1C4E80',
        paddingVertical: 15,
        marginTop: 30,
    },
    notificationsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingLeft: 5,
    },
    notificationsTitle: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#222',
        paddingLeft: 5,
    },
    earlier: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
        marginTop: 10,
        paddingHorizontal: 20,
        color: '#444',
        paddingLeft: 10,
    },
    notification: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 10,
        marginVertical: 8,
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 15,
        backgroundColor: '#eee',
    },
    messageBox: {
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    message: {
        fontSize: 13,
        color: '#333',
    },
    date: {
        fontSize: 13,
        color: '#888',
        marginLeft: 10,
        alignSelf: 'flex-start',
    },
});

export default NotificationScreen; 