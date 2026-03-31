/**
 * MessageInput — multiline text field + send button.
 * Disables the send button when the field is empty or a send
 * is already in progress. Adds bottom padding on iOS for the
 * home indicator / safe area.
 */

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";

interface Props {
  onSend: (text: string) => void;
  isSending: boolean;
  placeholder?: string;
}

export default function MessageInput({
  onSend,
  isSending,
  placeholder = "Type a message...",
}: Props) {
  const [text, setText] = useState("");

  const bgColor = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor({}, "placeholderText");
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "listBorderTranslucent");

  const canSend = text.trim().length > 0 && !isSending;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text);
    setText("");
  };

  const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 10,
    backgroundColor: bgColor,
    borderTopWidth: 1,
    borderTopColor: borderColor,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    backgroundColor: cardBg,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    color: textColor,

    // subtle border
    borderWidth: 1,
    borderColor: borderColor,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,

    // filled button when active
    backgroundColor: canSend ? tintColor : "transparent",
  },
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        multiline
        textAlignVertical="center"
      />
      <Pressable
        style={styles.sendButton}
        onPress={handleSend}
        disabled={!canSend}
      >
        <Ionicons
        name="send"
        size={20}
        color={canSend ? "#fff" : placeholderColor}
       />
      </Pressable>
    </View>
  );
}
