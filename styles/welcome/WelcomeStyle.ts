import { StyleSheet } from "react-native";
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
} from "../../constants/GlobalStyles";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: Spacing.xxl + 12,
    paddingHorizontal: Spacing.lg,
  },

  // --- Logo Container ---
  logoContainer: {
    alignItems: "center",
    gap: Spacing.xs,
  },

  logo: {
    width: 150,
    height: 150,
  },

  logoText: {
    color: Colors.primary,
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.bold,
    letterSpacing: 2,
  },

  // --- Text Container ---
  textContainer: {
    width: "100%",
    alignItems: "center",
    gap: Spacing.md,
  },

  subtitle: {
    width: "100%",
    color: Colors.textPrimary,
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    textAlign: "center",
  },

  description: {
    width: "100%",
    color: Colors.textPrimary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.7,
  },

  // --- Buttons Container ---
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    gap: Spacing.md + 4,
  },

  buttonPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: 18,
    width: "80%",
  },

  buttonPrimaryText: {
    color: Colors.textWhite,
    textAlign: "center",
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },

  buttonSecondary: {
    backgroundColor: "transparent",
    borderRadius: BorderRadius.lg,
    paddingVertical: 18,
    width: "80%",
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  buttonSecondaryText: {
    color: Colors.primary,
    textAlign: "center",
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },

  privacyContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    gap: Spacing.xs,
  },

  privacyText: {
    color: Colors.textLight,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    textAlign: "center",
  },
});
