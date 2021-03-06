import Cookies from "js-cookie";

/**
 * Persist array consents under in a cookie
 * @param {string} cookieName The name of the cookie
 * @param {string[]} consents Array of consents
 * @param {number} expiryInDays Number of days the cookie is valid for
 * @returns {undefined} Undefined
 */
export const persistConsentsInCookie = (
  cookieName: string,
  consents: string[],
  expiryInDays: number,
): void => {
  Cookies.set(cookieName, JSON.stringify(consents), { expires: expiryInDays });
};

/**
 * Read consents from a cookie
 * @param {string} cookieName The name of the cookie
 * @returns {string[]} Array of consents
 */
export const readConsentsFromCookie = (cookieName: string): string[] => {
  const cookie = Cookies.get(cookieName);

  return cookie ? JSON.parse(cookie) : [];
};
