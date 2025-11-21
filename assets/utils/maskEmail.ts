export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");
  const maskedLocalPart = localPart.slice(0, 2) + "***";
  return `${maskedLocalPart}@${domain}`;
};
