import { StyleSheet } from "react-native";

export const programasStyles = StyleSheet.create({
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
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  card: {
    backgroundColor: '#F6F8FA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 10,
    color: '#222',
  },
  rewardCard: {
    backgroundColor: '#F6F8FA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  rewardDesc: {
    fontSize: 12,
    color: '#888',
  },
});
