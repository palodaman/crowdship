import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';

type RootStackParamList = {
  ChatScreen: {
    orderId: string;
    senderId: string;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'ChatScreen'>;

const ChatScreen = () => {
  const router = useRouter();
  const { orderId, senderId } = useLocalSearchParams();


  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const flatListRef = useRef<any>(null);
  const [senderUsername, setSenderUsername] = useState<string | null>(null);
  const [senderAvatar, setSenderAvatar] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
    setupSubscription();
    fetchSenderUsername();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  const setupSubscription = () => {
    const subscription = supabase
      .channel('chat-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert([
        {
          order_id: orderId,
          sender_id: supabase.auth.user()?.id,
          content: newMessage.trim(),
        },
      ]);

    if (!error) {
      setNewMessage('');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const fetchSenderUsername = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('userid', senderId)
      .single();

    if (data) {
      setSenderUsername(data.username);
      setSenderAvatar(data.avatar_url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          {senderAvatar ? (
            <Image 
              source={{ uri: senderAvatar }} 
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="user" size={24} color="#999" />
            </View>
          )}
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Chat with</Text>
            <Text style={styles.senderName}>{senderUsername || 'Loading...'}</Text>
          </View>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.message_id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.sender_id === supabase.auth.user()?.id 
              ? styles.sentMessage 
              : styles.receivedMessage
          ]}>
            <Text style={[
              styles.messageText,
              item.sender_id === supabase.auth.user()?.id 
                ? styles.sentMessageText 
                : styles.receivedMessageText
            ]}>
              {item.content}
            </Text>
          </View>
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={sendMessage}
          >
            <Icon name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginLeft: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 12,
    borderRadius: 20,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084ff',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e9ecef',
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#0084ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerText: {
    marginLeft: 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;