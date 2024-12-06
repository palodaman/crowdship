import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { supabase } from '../lib/supabase';
import { useSession } from '../hooks/useSession';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const ChatsScreen = () => {
  const [chats, setChats] = useState([]);
  const session = useSession();
  const router = useRouter();
  const currentUserId = session?.user?.id;

  useEffect(() => {
    fetchChats();
    setupSubscription();
  }, []);

  const fetchChats = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        profiles:sender_id(username, first_name, avatar_url)
      `)
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .order('created_at', { ascending: false });

    if (data) {
      // Group messages by chat partner and get latest message
      const chatsByUser = data.reduce((acc, message) => {
        const partnerId = message.sender_id === currentUserId ? message.receiver_id : message.sender_id;
        if (!acc[partnerId] || message.created_at > acc[partnerId].created_at) {
          acc[partnerId] = message;
        }
        return acc;
      }, {});

      setChats(Object.values(chatsByUser));
    }
  };

  const setupSubscription = () => {
    const subscription = supabase
      .channel('chats-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        () => {
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const navigateToChat = (partnerId) => {
    router.push({
      pathname: '/chatscreen',
      params: { partnerId, orderId,
        senderId: partnerId }
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.message_id}
        renderItem={({ item }) => {
          const partner = item.profiles;
          return (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => navigateToChat(item.sender_id === currentUserId ? item.receiver_id : item.sender_id)}
            >
              {partner?.avatar_url ? (
                <Image source={{ uri: partner.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <AntDesign name="user" size={24} color="#999" />
                </View>
              )}
              <View style={styles.chatInfo}>
                <Text style={styles.name}>{partner?.first_name || 'User'}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.content}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatInfo: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default ChatsScreen;