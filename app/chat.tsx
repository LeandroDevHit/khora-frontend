import { useUserContext } from "@/contexts/UserContext";
import { sendChatbotMessage, startChatBot } from "@/services/chatbotService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

// Tipos de resposta esperados da API do chatbot (assumidos; ajustar se necessário)
interface StartChatResponse {
  conversationId?: string; // identificador principal da conversa
  id?: string; // alguns backends podem retornar 'id'
  userId?: string; // identificação do usuário
  message?: string; // primeira mensagem automática do bot
}
interface ChatMessageResponse {
  conversationId?: string;
  message?: string;
  // alguns backends podem retornar o texto em 'response' ou envolver em 'data'
  response?: string;
  data?: { message?: string; response?: string };
}

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

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loadingSend, setLoadingSend] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);
  const { userId, userName } = useUserContext();

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 80);
  }, [messages]);

  // Inicializa conversa ao montar
  useEffect(() => {
    async function initChat() {
      setInitializing(true);
      setErrorMessage(null);
      try {
        // Envia uma mensagem inicial não vazia para evitar 400 do backend
        const initialMessage = "Iniciar conversa";
        const response = (await startChatBot(
          userId || "",
          userName || "",
          initialMessage
        )) as StartChatResponse;
        const cid = response?.conversationId || response?.id || null;
        const firstMessageText =
          response?.message ||
          "Olá! Eu sou o assistente Khora. Como posso ajudar?";
        if (cid) setConversationId(cid);
        setMessages([
          {
            id: String(Date.now()),
            text: firstMessageText,
            fromUser: false,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      } catch (err: any) {
        setErrorMessage(
          err?.response?.data?.message ||
            "Não foi possível iniciar o chat. Tente novamente mais tarde."
        );
        // Mensagem fallback
        setMessages([
          {
            id: String(Date.now()),
            text: "Falha ao conectar ao assistente. Você pode tentar enviar mesmo assim.",
            fromUser: false,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      } finally {
        setInitializing(false);
      }
    }
    initChat();
  }, []);

  const send = async () => {
    if (!input.trim() || loadingSend) return;
    const textToSend = input.trim();
    setInput("");
    const now = new Date();
    const userMsg: Message = {
      id: String(Date.now()),
      text: textToSend,
      fromUser: true,
      time: now.toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoadingSend(true);
    setErrorMessage(null);
    try {
      // Se a conversa não iniciou corretamente, tenta iniciar agora
      let cid = conversationId;
      if (!cid) {
        const initResp = (await startChatBot(
          userId || "",
          userName || "",
          ""
        )) as StartChatResponse | undefined | null;
        cid = initResp?.conversationId || initResp?.id || null;
        if (cid) setConversationId(cid);
      }
      // Envia mensagem (API atual exige userId, userName, message)
      const botResp = (await sendChatbotMessage(
        userId || "",
        userName || "",
        textToSend
      )) as ChatMessageResponse | undefined | null;
      // Extrai texto da resposta usando vários campos possíveis que o backend pode retornar
      const raw =
        botResp?.message ??
        botResp?.response ??
        (botResp as any)?.data?.message ??
        (botResp as any)?.data?.response ??
        (typeof botResp === "string" ? botResp : undefined);

      let botText = "(Sem resposta)";
      if (raw !== undefined && raw !== null) {
        botText = typeof raw === "string" ? raw : JSON.stringify(raw);
      }
      const botMsg: Message = {
        id: String(Date.now() + 1),
        text: botText,
        fromUser: false,
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      // Atualiza conversationId se backend retornar outro campo
      if (!cid && botResp?.conversationId)
        setConversationId(botResp.conversationId);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          "Erro ao enviar mensagem. Verifique sua conexão."
      );
      const failMsg: Message = {
        id: String(Date.now() + 2),
        text: "Não foi possível obter resposta do assistente.",
        fromUser: false,
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, failMsg]);
    } finally {
      setLoadingSend(false);
    }
  };

  const QuickPill = ({ text }: { text: string }) => (
    <TouchableOpacity
      style={styles.pill}
      onPress={() => {
        setInput(text);
      }}
    >
      <Text style={styles.pillText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container, isWide && styles.containerWide]}>
        <View style={styles.headerWrap}>
          <View style={styles.headerInner}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.push("/tabs/home")}
            >
              <Ionicons name="arrow-back" size={20} color="#222" />
            </TouchableOpacity>
            <Image
              source={AVATAR}
              style={[
                styles.headerAvatar,
                {
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: avatarSize / 2,
                },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.headerName}>Khora</Text>
              <Text style={styles.headerStatus}>Online</Text>
            </View>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="volume-medium" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.list,
            isWide && { paddingHorizontal: 32 },
          ]}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageRow,
                item.fromUser ? styles.userRow : styles.botRow,
              ]}
            >
              {!item.fromUser && (
                <Image
                  source={AVATAR}
                  style={[
                    styles.msgAvatar,
                    {
                      width: Math.min(40, avatarSize - 12),
                      height: Math.min(40, avatarSize - 12),
                    },
                  ]}
                />
              )}
              <View
                style={[
                  styles.messageBubble,
                  item.fromUser ? styles.userBubble : styles.botBubble,
                  { maxWidth: isWide ? 520 : "78%" },
                ]}
              >
                <Text style={item.fromUser ? styles.userText : styles.botText}>
                  {item.text}
                </Text>
                <Text style={styles.msgTime}>{item.time}</Text>
              </View>
              {item.fromUser && (
                <View style={{ width: Math.min(40, avatarSize - 12) }} />
              )}
            </View>
          )}
        />

        {errorMessage && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            <Text style={{ color: "#DC2626", fontSize: 12 }}>
              {errorMessage}
            </Text>
          </View>
        )}

        <View style={styles.quickScrollRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickScroll}
          >
            <QuickPill text="Estou com ansiedade" />
            <QuickPill text="Quero dicas de sono" />
            <QuickPill text="Preciso de meditação" />
            <QuickPill text="Exercícios respiratórios" />
          </ScrollView>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={90}
        >
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
              <TouchableOpacity
                style={[styles.pillSendBtn, loadingSend && { opacity: 0.6 }]}
                onPress={send}
                disabled={loadingSend || initializing}
              >
                <Ionicons
                  name={loadingSend ? "time" : "send"}
                  size={16}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F8FF" },
  container: { flex: 1, backgroundColor: "transparent" },
  containerWide: { alignSelf: "center", width: "100%", maxWidth: 920, flex: 1 },

  headerWrap: {
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 12,
    backgroundColor: "transparent",
  },
  headerInner: { flexDirection: "row", alignItems: "center", gap: 10 },
  backBtn: { padding: 8, borderRadius: 10 },
  headerAvatar: {
    marginRight: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#fff",
  },
  headerName: { fontSize: 16, fontWeight: "800" },
  headerStatus: { fontSize: 12, color: "#20C997" },
  iconBtn: { padding: 8, borderRadius: 10 },

  list: { paddingHorizontal: 16, paddingBottom: 8 },
  messageRow: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  msgAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  userRow: { justifyContent: "flex-end" },
  botRow: { justifyContent: "flex-start" },

  messageBubble: {
    padding: 12,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#3A80F9",
    borderBottomRightRadius: 8,
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#EEF1F7",
    borderBottomLeftRadius: 8,
  },
  userText: { color: "#fff", fontSize: 15, lineHeight: 20 },
  botText: { color: "#111827", fontSize: 15, lineHeight: 20 },
  msgTime: {
    fontSize: 11,
    color: "#9AA6BB",
    marginTop: 6,
    alignSelf: "flex-end",
  },

  quickScrollRow: { paddingVertical: 8 },
  quickScroll: { paddingHorizontal: 16, alignItems: "center" },
  pill: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEF1F7",
    marginRight: 10,
  },
  pillText: { color: "#334155", fontSize: 13 },

  inputRow: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    borderTopWidth: 0,
    backgroundColor: "transparent",
  },
  inputPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 32,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  inputPillText: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    paddingVertical: 4,
  },
  pillSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#3A80F9",
    justifyContent: "center",
    alignItems: "center",
  },
});
