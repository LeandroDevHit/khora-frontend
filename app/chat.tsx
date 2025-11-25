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
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Animated,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "@/components/ChatStyles";

// Tipos de resposta esperados da API do chatbot
interface StartChatResponse {
  conversationId?: string;
  id?: string;
  userId?: string;
  message?: string;
}
interface ChatMessageResponse {
  conversationId?: string;
  message?: string;
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
  
  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 80);
  }, [messages]);

  // Scroll automático quando o teclado aparecer
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTimeout(() => listRef.current?.scrollToEnd?.({ animated: true }), 100);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  // Inicializa conversa ao montar (apenas mensagem de boas-vindas)
  useEffect(() => {
    async function initChat() {
      setInitializing(true);
      setErrorMessage(null);
      try {
        // Inicia com uma mensagem de saudação automática
        const initialMessage = "Olá";
        const response = (await startChatBot(
          userId || "",
          userName || "",
          initialMessage
        )) as StartChatResponse;
        const cid = response?.conversationId || response?.id || null;
        const firstMessageText =
          response?.message ||
          "Olá! Eu sou o assistente Khora. Como posso ajudar você hoje? 😊";
        if (cid) setConversationId(cid);
        setMessages([
          {
            id: String(Date.now()),
            text: firstMessageText,
            fromUser: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } catch (err: any) {
        setErrorMessage(
          err?.response?.data?.message ||
            "Não foi possível iniciar o chat. Tente novamente mais tarde."
        );
        setMessages([
          {
            id: String(Date.now()),
            text: "Falha ao conectar ao assistente. Você pode tentar enviar sua mensagem mesmo assim.",
            fromUser: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoadingSend(true);
    setErrorMessage(null);
    
    try {
      let cid = conversationId;
      
      // Se não há conversationId, inicia uma nova conversa
      if (!cid) {
        const initResp = (await startChatBot(
          userId || "",
          userName || "",
          textToSend // Envia a primeira mensagem do usuário para iniciar
        )) as StartChatResponse | undefined | null;
        cid = initResp?.conversationId || initResp?.id || null;
        if (cid) setConversationId(cid);
        
        // Extrai a resposta do bot da inicialização
        const raw =
          initResp?.message ??
          (initResp as any)?.response ??
          (initResp as any)?.data?.message ??
          (typeof initResp === "string" ? initResp : undefined);

        let botText = "(Sem resposta)";
        if (raw !== undefined && raw !== null) {
          botText = typeof raw === "string" ? raw : JSON.stringify(raw);
        }
        
        const botMsg: Message = {
          id: String(Date.now() + 1),
          text: botText,
          fromUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        // Se já existe conversationId, continua a conversa
        const botResp = (await sendChatbotMessage(
          userId || "",
          userName || "",
          textToSend,
          cid // Passa o conversationId para manter a continuidade
        )) as ChatMessageResponse | undefined | null;
        
        // Extrai texto da resposta
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
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        
        // Atualiza conversationId se o backend retornar um novo
        if (botResp?.conversationId && botResp.conversationId !== cid) {
          setConversationId(botResp.conversationId);
        }
      }
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          "Erro ao enviar mensagem. Verifique sua conexão."
      );
      const failMsg: Message = {
        id: String(Date.now() + 2),
        text: "Não foi possível obter resposta do assistente.",
        fromUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, failMsg]);
    } finally {
      setLoadingSend(false);
    }
  };

  const QuickPill = ({ text, icon }: { text: string; icon?: string }) => {
    const iconSize = isWide ? 18 : width < 375 ? 14 : 16;
    return (
      <TouchableOpacity
        style={styles.pill}
        onPress={() => {
          setInput(text);
        }}
        activeOpacity={0.7}
      >
        {icon && (
          <Ionicons name={icon as any} size={iconSize} color="#6366F1" style={{ marginRight: 6 }} />
        )}
        <Text style={styles.pillText}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#F0F4FF', '#F6F8FF', '#FFFFFF']}
        style={styles.gradientBg}
      >
        <View style={[styles.container, isWide && styles.containerWide]}>
          {/* Header aprimorado */}
          <Animated.View 
            style={[
              styles.headerWrap,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.headerInner}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => router.push("/tabs/home")}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={isWide ? 24 : width < 375 ? 18 : 22} color="#1F2937" />
              </TouchableOpacity>
              
              <View style={styles.avatarContainer}>
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
                <View style={styles.onlineIndicator} />
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={styles.headerName}>Khora Assistant</Text>
                <View style={styles.statusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.headerStatus}>Online agora</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                <Ionicons name="ellipsis-horizontal" size={isWide ? 22 : 20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Lista de mensagens */}
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
                  <View style={styles.botAvatarContainer}>
                    <Image
                      source={AVATAR}
                      style={[
                        styles.msgAvatar,
                        {
                          width: Math.min(36, avatarSize - 12),
                          height: Math.min(36, avatarSize - 12),
                        },
                      ]}
                    />
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    item.fromUser ? styles.userBubble : styles.botBubble,
                    { maxWidth: isWide ? 600 : width < 375 ? "80%" : "76%" },
                  ]}
                >
                  {item.fromUser ? (
                    <LinearGradient
                      colors={['#6366F1', '#4F46E5']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.userBubbleGradient}
                    >
                      <Text style={styles.userText}>{item.text}</Text>
                      <Text style={styles.msgTimeUser}>{item.time}</Text>
                    </LinearGradient>
                  ) : (
                    <>
                      <Text style={styles.botText}>{item.text}</Text>
                      <Text style={styles.msgTime}>{item.time}</Text>
                    </>
                  )}
                </View>
                {item.fromUser && (
                  <View style={{ width: Math.min(36, avatarSize - 12) }} />
                )}
              </View>
            )}
          />

          {/* Mensagem de erro */}
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={isWide ? 18 : 16} color="#DC2626" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Quick pills aprimorados */}
          <View style={styles.quickScrollRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickScroll}
            >
              <QuickPill text="Estou com ansiedade" icon="heart-outline" />
              <QuickPill text="Dicas de sono" icon="moon-outline" />
              <QuickPill text="Meditação guiada" icon="flower-outline" />
              <QuickPill text="Exercícios" icon="fitness-outline" />
            </ScrollView>
          </View>

          {/* Input aprimorado */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            style={{ flex: 0 }}
          >
            <View style={[styles.inputRow, isWide && { paddingHorizontal: 32 }]}>
              <View style={[styles.inputPill, isWide && { maxWidth: 720 }]}>
                <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
                  <Ionicons name="add-circle" size={isWide ? 26 : width < 375 ? 22 : 24} color="#9CA3AF" />
                </TouchableOpacity>
                
                <TextInput
                  style={styles.inputPillText}
                  placeholder="Escreva sua mensagem..."
                  placeholderTextColor="#9CA3AF"
                  value={input}
                  onChangeText={setInput}
                  multiline={false}
                />
                
                <TouchableOpacity
                  style={[styles.pillSendBtn, loadingSend && { opacity: 0.6 }]}
                  onPress={send}
                  disabled={loadingSend || initializing}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#6366F1', '#4F46E5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sendBtnGradient}
                  >
                    <Ionicons
                      name={loadingSend ? "hourglass-outline" : "send"}
                      size={isWide ? 20 : width < 375 ? 16 : 18}
                      color="#fff"
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}