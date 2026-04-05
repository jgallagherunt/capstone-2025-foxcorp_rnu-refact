/**
 * ConversationList — the inbox view shared by parent and teacher
 * messaging screens. Wraps a FlatList with pull-to-refresh,
 * loading spinner, error text, and an empty-state message.
 */

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { Conversation } from "../api/messageRepo";
import ConversationItem from "./ConversationItem";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  conversations: Conversation[];
  viewerRole: "parent" | "teacher";
  isLoading: boolean;
  error: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  onRefresh: () => void;
}

export default function ConversationList({
  conversations,
  viewerRole,
  isLoading,
  error,
  onSelectConversation,
  onRefresh,
}: Props) {
  const bgColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");
  const tintColor = useThemeColor({}, "tint");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: bgColor,
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
    },
    emptyText: {
      fontSize: 16,
      color: subtextColor,
      textAlign: "center",
    },
    errorText: {
      fontSize: 16,
      color: "#ec5557",
      textAlign: "center",
    },
    emptyTitle: {
       fontSize: 18,
       fontWeight: "600",
       color: textColor,
       marginBottom: 6,
    },
    emptySubtext: {
       fontSize: 14,
      color: subtextColor,
      textAlign: "center",
      maxWidth: 250,
    },
  });

  if (isLoading && conversations.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={tintColor} />
      </View>
    );
  }

  if (error && conversations.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            viewerRole={viewerRole}
            onPress={() => onSelectConversation(item)}
          />
        )}
        refreshing={isLoading}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.centered}>
          <Ionicons name="chatbubble-ellipses-outline" size={48} color={subtextColor} style={{ marginBottom: 12 }} />
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>
          Start a conversation with a teacher or parent to begin messaging.
            </Text>
          </View>
        }
      />
    </View>
  );
}
