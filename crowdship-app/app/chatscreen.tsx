import React, { useState, useEffect, useRef } from 'react';
import {  View,Text,TextInput,FlatList,TouchableOpacity, StyleSheet,KeyboardAvoidingView, Platform,SafeAreaView,Image, Button} from 'react-native';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { useSession } from '../hooks/useSession';

type RootStackParamList = {
  ChatScreen: {
    orderId: string;
    senderId: string;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'ChatScreen'>;

interface ChatMessage {
  id: string;
  chat_session_id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  sent_at: string;
}

const ChatScreen = () => {
  const router = useRouter();
  const { orderId, senderId } = useLocalSearchParams();
  const session = useSession();
  const currentUserId = session?.user?.id;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const flatListRef = useRef<any>(null);
  const [requesterUsername, setRequesterUsername] = useState<string | null>(null);
  const [requesterAvatar, setRequesterAvatar] = useState<string | null>(null);
  const [isDriver, setIsDriver] = useState<boolean>(false);

  useEffect(() => {
    initializeChat();
    checkUserRole();
  }, []);

  const initializeChat = async () => {
    if (!currentUserId || !senderId) return;
    
    //first check if a chat session exists
    const { data: existingSession } = await supabase
      .from('chat_sessions')
      .select('id')
      .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
      .or(`user1_id.eq.${senderId},user2_id.eq.${senderId}`)
      .single();

    if (existingSession) {
      setChatSessionId(existingSession.id);

    } else {
      // Create new chat session
      const { data: newSession, error } = await supabase
        .from('chat_sessions')
        .insert([{
          user1_id: currentUserId,
          user2_id: senderId,
        }])
        .select()
        .single();

      if (newSession) {
        setChatSessionId(newSession.id);
      }
    }
    
    fetchMessages();
    setupSubscription();
    fetchRequesterInfo();
  };

  const fetchMessages = async () => {
    if (!chatSessionId) return;

    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_session_id', chatSessionId)
      .order('sent_at', { ascending: true });

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
          filter: `chat_session_id=eq.${chatSessionId}`,
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
    if (!newMessage.trim() || !currentUserId || !chatSessionId || !senderId) return;
    console.log("hetting in here");
    const { error } = await supabase
      .from('chat_messages')
      .insert([{
        chat_session_id: chatSessionId,
        sender_id: currentUserId,
        receiver_id: senderId,
        message_text: newMessage.trim(),
      }]);

    if (!error) {
      setNewMessage('');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const fetchRequesterInfo = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('userid', senderId)
      .single();

    if (data) {
      setRequesterUsername(data.username);
      console.log(data.username);
      setRequesterAvatar(data.avatar_url);
    }
  };

  const checkUserRole = async () => {
    if (!currentUserId || !orderId) return;
    
    // Check if current user is the driver by querying orders table
    const { data: orderData } = await supabase
      .from('orders')
      .select('delivererid')
      .eq('orderid', orderId)
      .single();

    if (orderData) {
      setIsDriver(orderData.delivererid === currentUserId);
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
          {requesterAvatar ? (
            <Image 
              source={{ uri: requesterAvatar }} 
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="user" size={24} color="#999" />
            </View>
          )}
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              Chat with {isDriver ? 'Delivery Requester' : 'Driver'}
            </Text>
            <Text style={styles.headerText}>
              {requesterUsername || 'Loading...'}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.sender_id === currentUserId
              ? styles.sentMessage 
              : styles.receivedMessage
          ]}>
            <Text style={[
              styles.messageText,
              item.sender_id === currentUserId
                ? styles.sentMessageText 
                : styles.receivedMessageText
            ]}>
              {item.message_text}
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