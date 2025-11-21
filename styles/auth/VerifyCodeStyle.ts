import { StyleSheet } from "react-native";
import { Colors, FontSizes, FontWeights, Spacing } from "../../constants/GlobalStyles";

export const style = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
    justifyContent: "center",
  },

  // Back Button
  backButton: {
    position: "absolute",
    top: Spacing.xl,
    left: Spacing.lg,
    zIndex: 10,
    padding: Spacing.sm,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },

  iconContainer: {
    marginBottom: Spacing.lg,
  },

  title: {
    fontSize: FontSizes.xxl + 4,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },

  subtitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: Spacing.md,
    lineHeight: 22,
  },

  // Form
  formContainer: {
    width: "100%",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },

  label: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },

  // Button
  buttonContainer: {
    width: "100%",
    marginBottom: Spacing.lg,
  },

  // Links
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  linkText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
  },

  link: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },

  // Info
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },

  infoText: {
    flex: 1,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },

  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Spacing.md,
  },
  timerText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  timerExpired: {
    color: Colors.error,
  },
  linkDisabled: {
    color: Colors.textDisabled,
  },
});
