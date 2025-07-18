export const getInitials = (name) => {
  if (!name) return "";
  const words = name.trim().split(" ");
  const initials = words.map((word) => word[0].toUpperCase()).slice(0, 2);
  return initials.join("");
};
