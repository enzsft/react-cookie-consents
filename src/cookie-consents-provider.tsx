import React, {
  Context,
  createContext,
  ReactNode,
  SFC,
  useContext,
  useState,
  ReactElement,
} from "react";
import { persistConsentsInCookie, readConsentsFromCookie } from "./cookie";

/**
 * Consents collection. Manage consents via this API.
 */
export interface Consents {
  /**
   * Get consents
   * @returns {string[]} Consents
   */
  get: () => string[];
  /**
   * Add consents and persist changes in the cookie. Duplicates are prevented.
   * @param {...string[]} consents Consents to add
   * @returns {undefined} Undefined
   */
  add: (...consents: string[]) => void;
  /**
   * Clear all consents and persist changes in the cookie.
   * @returns {undefined} Undefined
   */
  clear: () => void;
  /**
   * Remove consents and persist changes in the cookie.
   * @param {...string[]} consents Consents to remove
   * @returns {undefined} Undefined
   */
  remove: (...consents: string[]) => void;
}

/**
 * CookieConsentsProvider props
 */
export interface CookieConsentsProviderProps {
  /**
   * React children
   */
  children: ReactNode;
  /**
   * Name of the cookie to persist cookie consents in
   */
  cookieName: string;
  /**
   * Number of days the cookie is valid for
   */
  expires: number;
}

/**
 * Cookie consents context
 */
export const CookieConsentsContext: Context<Consents | null> = createContext<Consents | null>(
  null,
);

/**
 * Provider to provide cookie consent controls via the `useCookieConsents()` hooks
 * @param {*} props Component props
 * @returns {*} React component
 */
export const CookieConsentsProvider: SFC<CookieConsentsProviderProps> = ({
  children,
  cookieName,
  expires,
}): ReactElement => {
  const [currentConsents, setCurrentConsents]: [
    string[],
    (c: string[]) => void
  ] = useState(readConsentsFromCookie(cookieName));

  const updateConsents = (newConsents: string[]): void => {
    persistConsentsInCookie(cookieName, newConsents, expires);
    setCurrentConsents(newConsents);
  };

  const consents: Consents = {
    add: (...consentsToAdd: string[]): void => {
      updateConsents(
        Array.from(new Set([...currentConsents, ...consentsToAdd])),
      );
    },
    clear: (): void => {
      updateConsents([]);
    },
    get: (): string[] => currentConsents,
    remove: (...consentsToRemove: string[]): void => {
      updateConsents(
        currentConsents.filter(c => !consentsToRemove.includes(c)),
      );
    },
  };

  return (
    <CookieConsentsContext.Provider value={consents}>
      {children}
    </CookieConsentsContext.Provider>
  );
};

/**
 * React hook to provide a `Consents` object used to update cookie consents
 * @returns {*} `Consents` object
 */
export const useCookieConsents = (): Consents | null => {
  return useContext(CookieConsentsContext);
};
