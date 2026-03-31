/**
 * Teacher conversation thread — displays the message history and
 * lets the teacher send messages.
 */

import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
import { useMessages } from "@/src/features/messaging/logic/useMessages";
import MessageBubble from "@/src/features/messaging/ui/MessageBubble";
import MessageInput from "@/src/features/messaging/ui/MessageInput";

export default function TeacherConversationScreen() {
  const { userTeacher } = useTeacherLoginContext();
  const { conversationId } = useLocalSearchParams<{
    conversationId: string;
    conversationTitle?: string;
  }>();

  const { messages, isLoading, isSending, error, sendMessage } = useMessages({
    conversationId: conversationId ?? "",
    senderId: userTeacher.userId,
    senderType: "TEACHER",
    senderName: userTeacher.name,
  });

  const flatListRef = useRef<FlatList>(null);

  // auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const bgColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const errorColor = "#ec5557";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: bgColor,
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    errorText: {
      fontSize: 16,
      color: errorColor,
      textAlign: "center",
      padding: 20,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={tintColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            currentUserId={userTeacher.userId}
          />
        )}
        contentContainerStyle={{
        paddingVertical: 12,
        paddingBottom: 20,
        }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />
      <MessageInput onSend={sendMessage} isSending={isSending} />
    </KeyboardAvoidingView>
  );
}
