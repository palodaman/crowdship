import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import { supabase } from "../lib/supabase";
import { AntDesign, Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { useSession } from "../hooks/useSession";
import chatService from '../lib/chat.service';
import { useNavigation } from "expo-router";
type RootStackParamList = {
  ChatScreen: {
    orderId: string;
    senderId: string;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, "ChatScreen">;

const ChatScreen = () => {
  const navigation = useNavigation(); 
  const router = useRouter();
  const { orderId, senderId } = useLocalSearchParams();
  const session = useSession();
  const currentUserId = session?.user?.id;
  const [name, setName] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const flatListRef = useRef<any>(null);
  const [username, setUsername] = useState<string | null>(
    null
  );
  const [Avatar, setAvatar] = useState<string | null>(null);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUserId && senderId) {
      initializeChat();
    }
  }, [currentUserId, senderId]);

  const initializeChat = async () => {
    try {
      setUsername("");
      setName("");
      setMessages([]);
      setAvatar("");
      const session = await chatService.createOrGetChatSession(currentUserId!, senderId);
      await fetchInfo();
      setChatSessionId(session.id);
      await fetchMessages(session.id);
      
    } catch (error) {
      console.error("Error initializing chat:", error);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      const messages = await chatService.getChatMessages(sessionId);
      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !chatSessionId) return;
    
    try {
      await chatService.sendMessage(currentUserId, chatSessionId, newMessage.trim());
      setNewMessage("");
      fetchMessages(chatSessionId)
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleBack = () => {
    // router.back();
    navigation.navigate("deliverydashboard");
  };

  const fetchInfo = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("first_name,username, avatar_url")
      .eq("userid", senderId)
      .single();

    if (data) {
      setUsername(data.username);
      setAvatar(data.avatar_url);
      setName(data.first_name);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <AntDesign name="arrowleft" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          {Avatar ? (
            <Image
              source={{ uri: Avatar }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <AntDesign name="user" size={24} color="#999" />
            </View>
          )}
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Chat with {name || "Shipper"}</Text>
            <Text style={styles.senderName}>
              {username || "Loading..."}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender_id === currentUserId
                ? styles.sentMessage
                : styles.receivedMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.sender_id === currentUserId
                  ? styles.sentMessageText
                  : styles.receivedMessageText,
              ]}
            >
              {item.message_text}
            </Text>
          </View>
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Feather name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    // marginLeft: 10,
  },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 12,
    borderRadius: 20,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0084ff",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e9ecef",
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: "#fff",
  },
  receivedMessageText: {
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#47BF7E",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;

/*This code was developed without the assistance of ChatGPT and Copilot*/