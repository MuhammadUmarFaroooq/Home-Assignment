export const getTitleFromPathname = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "";

  let lastSegment = segments[segments.length - 1];

  const isPossibleId = /^[a-f0-9]{24}$|^[a-z0-9-]{16,}$/.test(lastSegment);

  if (isPossibleId && segments.length > 1) {
    lastSegment = segments[segments.length - 2];
  }

  const formatted = lastSegment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return formatted;
};