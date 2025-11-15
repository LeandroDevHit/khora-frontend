import { StyleSheet } from "react-native";
import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from "../../constants/GlobalStyles";

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
    marginBottom: Spacing.lg,
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

  // Email Info
  emailInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary10,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },

  emailInfoText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.primary,
  },

  // Form
  formContainer: {
    width: "100%",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },

  label: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },

  // Timer
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  timerText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.primary,
  },

  timerExpired: {
    color: Colors.error,
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

  linkDisabled: {
    color: Colors.textSecondary,
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
    width: "100%",
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray300,
  },

  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },

  // Alternative Method
  alternativeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },

  alternativeButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },

  // Security Info
  securityInfoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.success + "10",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },

  securityInfoText: {
    flex: 1,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
