
export const generatePassword = (
  length: number = 16,
  config = { useAZ: true, useaz: true, use09: true, useSpec: true }
): string => {
  let charset = "";
  if (config.useaz) charset += "abcdefghijklmnopqrstuvwxyz";
  if (config.useAZ) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (config.use09) charset += "0123456789";
  if (config.useSpec) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  
  if (charset === "") charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

export const calculateStrength = (password: string): number => {
  if (!password) return 0;
  let strength = 0;
  if (password.length > 8) strength += 20;
  if (password.length > 12) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;
  return strength;
};

export const getStrengthColor = (strength: number): string => {
  if (strength < 40) return '#EF4444'; // Red
  if (strength < 70) return '#F59E0B'; // Amber
  return '#4CAF50'; // Green
};
