// const SessionKey = 'Meh-store-session';

export const getSession = (SessionKey: string) => {
  return window.localStorage.getItem(SessionKey);
};
export const setSession = (SessionKey: string, value: string) => {
  return window.localStorage.setItem(SessionKey, value);
};
export const delSession = (SessionKey: string) => {
  return window.localStorage.removeItem(SessionKey);
};
