/**
 * ConversationItem — a single row in the conversation inbox list.
 * Shows an avatar icon, the other party's name, student/class context,
 * message preview, and a relative timestamp.
 */

import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { Conversation } from "../api/messageRepo";

interface Props {
  conversation: Conversation;
  viewerRole: "parent" | "teacher";
  onPress: () => void;
}

/** Turn an ISO date string into a short relative label */
function relativeTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString();
}

export default function ConversationItem({
  conversation,
  viewerRole,
  onPress,
}: Props) {
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");
  const bgColor = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "listBorderTranslucent");

  const isGroup = conversation.type === "GROUP";

  // show the other party's name as the title
  const title = isGroup
    ? conversation.className ?? "Group"
    : viewerRole === "parent"
    ? conversation.teacherName ?? "Teacher"
    : conversation.parentName ?? "Parent";

  // subtitle gives context: which student, or "Class broadcast"
  const subtitle = isGroup
    ? "Class broadcast"
    : conversation.studentName
    ? `Re: ${conversation.studentName}`
    : null;

  const unreadCount = (conversation as any).unreadCount ?? 0;

  const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: bgColor,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: borderColor,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    content: {
      flex: 1,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: textColor,
      flexShrink: 1,
    },
    time: {
      fontSize: 13,
      color: subtextColor,
      marginLeft: 8,
    },
    subtitle: {
      fontSize: 13,
      color: subtextColor,
      marginTop: 2,
    },
    preview: {
      fontSize: 14,
      color: subtextColor,
      marginTop: 4,
      numberOfLines: 1,
    },
    
    badge: {
     minWidth: 20,
     height: 20,
     borderRadius: 10,
     backgroundColor: "#ec5557",
     alignItems: "center",
     justifyContent: "center",
     marginLeft: 8,
     paddingHorizontal: 6,
    },
    
    badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    },

  });

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.avatar}>
        <Ionicons
          name={isGroup ? "people" : "person"}
          size={22}
          color={textColor}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.time}>
            {relativeTime(conversation.lastMessageAt)}
          </Text>
        </View>

        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}

        {conversation.lastMessageText && (
          <Text style={styles.preview} numberOfLines={1}>
            {conversation.lastMessageText}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
