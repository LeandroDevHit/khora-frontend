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
    marginBottom: Spacing.lg,
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

  // Password Requirements
  requirementsContainer: {
    width: "100%",
    backgroundColor: Colors.gray100,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },

  requirementsTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },

  requirementText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    color: Colors.textSecondary,
  },
});
