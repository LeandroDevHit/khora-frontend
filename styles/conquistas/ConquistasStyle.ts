import { StyleSheet } from "react-native";

export const conquistasStyles = StyleSheet.create({
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  card: {
    width: '48%',
    backgroundColor: '#F6F8FA',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },
  desc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3A80F9',
    borderRadius: 3,
  },
});
