export const buildDirectCallRoom = (userIdA: string, userIdB: string): string => {
  const [a, b] = [userIdA, userIdB].sort();
  return `skillswap-direct-${a}-${b}`;
};