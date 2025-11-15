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

  // Header
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
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
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg + 4,
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

  // Form
  formContainer: {
    width: "100%",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  label: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },

  // Register Button
  buttonContainer: {
    width: "100%",
    height: 'auto',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },

  // Sign In
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  signInText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
  },

  signInLink: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },

  // Terms
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },

  termsText: {
    flex: 1,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});
