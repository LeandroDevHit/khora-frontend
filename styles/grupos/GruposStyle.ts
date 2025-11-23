import { StyleSheet } from "react-native";

export const gruposStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 32,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    flex: 1,
    textAlign: "center",
  },
  section: {
    marginTop: 12,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F8FA",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  groupIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  groupMembers: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  enterBtn: {
    backgroundColor: "#1E90FF",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  enterBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
    marginHorizontal: 20,
  },
});
