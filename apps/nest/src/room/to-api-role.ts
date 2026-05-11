export const toApiRole = (role: string): 'host' | 'guest' => {
  return role === 'HOST' ? 'host' : 'guest';
};
