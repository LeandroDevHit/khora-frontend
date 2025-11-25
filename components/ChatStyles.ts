import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Breakpoints responsivos
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
const isTablet = SCREEN_WIDTH >= 768 && SCREEN_WIDTH < 1024;
const isDesktop = SCREEN_WIDTH >= 1024;

// Funções helper para valores responsivos
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#F0F4FF" 
  },
  
  gradientBg: { 
    flex: 1 
  },
  
  container: { 
    flex: 1, 
    backgroundColor: "transparent" 
  },
  
  containerWide: { 
    alignSelf: "center", 
    width: "100%", 
    maxWidth: isDesktop ? 1200 : isTablet ? 920 : "100%", 
    flex: 1 
  },

  // Header Styles
  headerWrap: {
    paddingTop: isSmallDevice ? 8 : isTablet ? 16 : 12,
    paddingBottom: isSmallDevice ? 12 : isTablet ? 20 : 16,
    paddingHorizontal: isTablet ? 24 : 16,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(229, 231, 235, 0.5)",
    backdropFilter: "blur(10px)",
  },
  
  headerInner: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: isTablet ? 16 : 12 
  },
  
  backBtn: { 
    padding: isSmallDevice ? 8 : 10, 
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  
  avatarContainer: {
    position: "relative",
  },
  
  headerAvatar: {
    backgroundColor: "#fff",
    borderWidth: isTablet ? 4 : 3,
    borderColor: "#fff",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
  onlineIndicator: {
    position: "absolute",
    bottom: isTablet ? 3 : 2,
    right: isTablet ? 3 : 2,
    width: isTablet ? 16 : 14,
    height: isTablet ? 16 : 14,
    borderRadius: isTablet ? 8 : 7,
    backgroundColor: "#10B981",
    borderWidth: isTablet ? 4 : 3,
    borderColor: "#fff",
  },
  
  headerName: { 
    fontSize: isSmallDevice ? 15 : isTablet ? 19 : 17, 
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  
  statusDot: {
    width: isTablet ? 7 : 6,
    height: isTablet ? 7 : 6,
    borderRadius: isTablet ? 3.5 : 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  
  headerStatus: { 
    fontSize: isSmallDevice ? 12 : isTablet ? 14 : 13, 
    color: "#6B7280",
    fontWeight: "500",
  },
  
  iconBtn: { 
    padding: isSmallDevice ? 8 : 10, 
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },

  // Messages List Styles
  list: { 
    paddingHorizontal: isTablet ? 32 : 16, 
    paddingTop: isTablet ? 24 : 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
  
  messageRow: {
    marginBottom: isTablet ? 20 : 16,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  
  botAvatarContainer: {
    marginRight: isTablet ? 12 : 10,
    marginBottom: 4,
  },
  
  msgAvatar: { 
    width: isTablet ? 40 : isSmallDevice ? 32 : 36, 
    height: isTablet ? 40 : isSmallDevice ? 32 : 36, 
    borderRadius: isTablet ? 20 : isSmallDevice ? 16 : 18,
    borderWidth: 2,
    borderColor: "#F3F4F6",
  },
  
  userRow: { 
    justifyContent: "flex-end" 
  },
  
  botRow: { 
    justifyContent: "flex-start" 
  },

  // Message Bubble Styles
  messageBubble: {
    borderRadius: isTablet ? 24 : 20,
  },
  
  userBubble: {
    alignSelf: "flex-end",
    overflow: "hidden",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  
  userBubbleGradient: {
    padding: isSmallDevice ? 12 : isTablet ? 16 : 14,
    borderRadius: isTablet ? 24 : 20,
  },
  
  botBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: isSmallDevice ? 12 : isTablet ? 16 : 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  
  userText: { 
    color: "#fff", 
    fontSize: isSmallDevice ? 14 : isTablet ? 16 : 15, 
    lineHeight: isSmallDevice ? 20 : isTablet ? 24 : 22,
    fontWeight: "500",
  },
  
  botText: { 
    color: "#1F2937", 
    fontSize: isSmallDevice ? 14 : isTablet ? 16 : 15, 
    lineHeight: isSmallDevice ? 20 : isTablet ? 24 : 22,
    fontWeight: "500",
  },
  
  msgTime: {
    fontSize: isSmallDevice ? 10 : isTablet ? 12 : 11,
    color: "#9CA3AF",
    marginTop: 6,
    alignSelf: "flex-end",
    fontWeight: "500",
  },
  
  msgTimeUser: {
    fontSize: isSmallDevice ? 10 : isTablet ? 12 : 11,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 6,
    alignSelf: "flex-end",
    fontWeight: "500",
  },

  // Error Message Styles
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: isTablet ? 24 : 20,
    paddingVertical: isTablet ? 12 : 10,
    marginHorizontal: isTablet ? 32 : 16,
    marginBottom: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#DC2626",
    gap: 8,
  },
  
  errorText: {
    color: "#DC2626",
    fontSize: isSmallDevice ? 12 : isTablet ? 14 : 13,
    fontWeight: "500",
    flex: 1,
  },

  // Quick Pills Styles
  quickScrollRow: { 
    paddingVertical: isTablet ? 16 : 12,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  
  quickScroll: { 
    paddingHorizontal: isTablet ? 32 : 16, 
    alignItems: "center",
    gap: isTablet ? 12 : 8,
  },
  
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: isSmallDevice ? 8 : isTablet ? 12 : 10,
    paddingHorizontal: isSmallDevice ? 12 : isTablet ? 20 : 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: isTablet ? 12 : 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  
  pillText: { 
    color: "#374151", 
    fontSize: isSmallDevice ? 12 : isTablet ? 15 : 14,
    fontWeight: "600",
  },

  // Input Area Styles
  inputRow: {
    flexDirection: "row",
    padding: isTablet ? 20 : 16,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderTopWidth: 1,
    borderTopColor: "rgba(229, 231, 235, 0.5)",
  },
  
  inputPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: isTablet ? 32 : 28,
    paddingVertical: isTablet ? 10 : 8,
    paddingHorizontal: isTablet ? 20 : 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    maxWidth: isDesktop ? 800 : isTablet ? 720 : "100%",
  },
  
  attachBtn: {
    marginRight: isTablet ? 12 : 8,
  },
  
  inputPillText: {
    flex: 1,
    fontSize: isSmallDevice ? 14 : isTablet ? 16 : 15,
    color: "#1F2937",
    paddingVertical: isTablet ? 10 : 8,
    fontWeight: "500",
    maxHeight: 100,
    minHeight: isTablet ? 44 : 40,
  },
  
  pillSendBtn: {
    width: isTablet ? 48 : isSmallDevice ? 40 : 44,
    height: isTablet ? 48 : isSmallDevice ? 40 : 44,
    borderRadius: isTablet ? 24 : isSmallDevice ? 20 : 22,
    overflow: "hidden",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  
  sendBtnGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});