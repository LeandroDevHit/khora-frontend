import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AVATAR = require("@/assets/images/bot.jpg");

type Message = {
  id: string;
  text: string;
  fromUser?: boolean;
  time?: string;
};

export default function ChatScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width > 720;
  const avatarSize = Math.min(56, Math.round(width * 0.09));

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Olá! Eu sou o assistente Khora. Como posso ajudar?", fromUser: false, time: new Date().toLocaleTimeString() },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    // scroll to bottom when messages change
    setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 80);
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date();
    const userMsg: Message = { id: String(Date.now()), text: input.trim(), fromUser: true, time: now.toLocaleTimeString() };
    setMessages((prev) => [...prev, userMsg]);

    // Simula resposta do bot
    setTimeout(() => {
      const botMsg: Message = {
        id: String(Date.now() + 1),
        text: "Claro — aqui está uma resposta simulada sobre: " + userMsg.text,
        fromUser: false,
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 700);

    setInput("");
  };

  const QuickPill = ({ text }: { text: string }) => (
    <TouchableOpacity style={styles.pill} onPress={() => { setInput(text); }}>
      <Text style={styles.pillText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container, isWide && styles.containerWide]}>
        <View style={styles.headerWrap}>
          <View style={styles.headerInner}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/tabs/home") }>
              <Ionicons name="arrow-back" size={20} color="#222" />
            </TouchableOpacity>
            <Image source={AVATAR} style={[styles.headerAvatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.headerName}>Khora</Text>
              <Text style={styles.headerStatus}>Online</Text>
            </View>
            <TouchableOpacity style={styles.iconBtn}><Ionicons name="volume-medium" size={18} color="#666" /></TouchableOpacity>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, isWide && { paddingHorizontal: 32 }]}
          renderItem={({ item }) => (
            <View style={[styles.messageRow, item.fromUser ? styles.userRow : styles.botRow]}>
              {!item.fromUser && <Image source={AVATAR} style={[styles.msgAvatar, { width: Math.min(40, avatarSize - 12), height: Math.min(40, avatarSize - 12) }]} />}
              <View style={[styles.messageBubble, item.fromUser ? styles.userBubble : styles.botBubble, { maxWidth: isWide ? 520 : '78%' }]}>
                <Text style={item.fromUser ? styles.userText : styles.botText}>{item.text}</Text>
                <Text style={styles.msgTime}>{item.time}</Text>
              </View>
              {item.fromUser && <View style={{ width: Math.min(40, avatarSize - 12) }} />}
            </View>
          )}
        />

        <View style={styles.quickScrollRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickScroll}> 
            <QuickPill text="Estou com ansiedade" />
            <QuickPill text="Quero dicas de sono" />
            <QuickPill text="Preciso de meditação" />
            <QuickPill text="Exercícios respiratórios" />
          </ScrollView>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
          <View style={[styles.inputRow, isWide && { paddingHorizontal: 32 }]}> 
            <View style={[styles.inputPill, isWide && { maxWidth: 720 }]}> 
              <TextInput
                style={styles.inputPillText}
                placeholder="Envie-me uma mensagem!"
                placeholderTextColor="#6B7280"
                value={input}
                onChangeText={setInput}
                multiline={false}
              />
              <TouchableOpacity style={styles.pillSendBtn} onPress={send}>
                <Ionicons name="send" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F8FF' },
  container: { flex: 1, backgroundColor: 'transparent' },
  containerWide: { alignSelf: 'center', width: '100%', maxWidth: 920, flex: 1 },

  headerWrap: { paddingTop: 8, paddingBottom: 6, paddingHorizontal: 12, backgroundColor: 'transparent' },
  headerInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { padding: 8, borderRadius: 10 },
  headerAvatar: { marginRight: 10, backgroundColor: '#fff', borderWidth: 2, borderColor: '#fff' },
  headerName: { fontSize: 16, fontWeight: '800' },
  headerStatus: { fontSize: 12, color: '#20C997' },
  iconBtn: { padding: 8, borderRadius: 10 },

  list: { paddingHorizontal: 16, paddingBottom: 8 },
  messageRow: { marginBottom: 12, flexDirection: 'row', alignItems: 'flex-end' },
  msgAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  userRow: { justifyContent: 'flex-end' },
  botRow: { justifyContent: 'flex-start' },

  messageBubble: {
    padding: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  userBubble: { backgroundColor: '#3A80F9', borderBottomRightRadius: 8, alignSelf: 'flex-end' },
  botBubble: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#EEF1F7', borderBottomLeftRadius: 8 },
  userText: { color: '#fff', fontSize: 15, lineHeight: 20 },
  botText: { color: '#111827', fontSize: 15, lineHeight: 20 },
  msgTime: { fontSize: 11, color: '#9AA6BB', marginTop: 6, alignSelf: 'flex-end' },

  quickScrollRow: { paddingVertical: 8 },
  quickScroll: { paddingHorizontal: 16, alignItems: 'center' },
  pill: { backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#EEF1F7', marginRight: 10 },
  pillText: { color: '#334155', fontSize: 13 },

  inputRow: { flexDirection: 'row', padding: 12, alignItems: 'center', borderTopWidth: 0, backgroundColor: 'transparent' },
  inputPill: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 32, paddingVertical: 10, paddingHorizontal: 12, marginRight: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  inputPillText: { flex: 1, fontSize: 15, color: '#111827', paddingVertical: 4 },
  pillSendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#3A80F9', justifyContent: 'center', alignItems: 'center' },
});
