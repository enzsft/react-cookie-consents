import React, {
  Context,
  createContext,
  ReactNode,
  SFC,
  useContext,
  useState,
  ReactElement,
} from "react";
import Cookies from "js-cookie";

export interface CookieConsent {
  getConsents: () => string[];
  addConsent: (consentToAdd: string) => void;
  clearConsents: () => void;
  removeConsent: (consentToRemove: string) => void;
  setConsents: (consentsToAdd: string[]) => void;
}

export const CookieConsentContext: Context<CookieConsent | null> = createContext<CookieConsent | null>(
  null,
);

export interface CookieConsentProviderProps {
  children: ReactNode;
  cookieName: string;
  expires: number;
}

export const CookieConsentProvider: SFC<CookieConsentProviderProps> = ({
  children,
  cookieName,
  expires,
}): ReactElement => {
  const [currentConsents, setCurrentConsents]: [
    string[],
    (c: string[]) => void
  ] = useState(Cookies.getJSON(cookieName) || []);

  const getConsents = (): string[] => {
    return currentConsents;
  };

  const setConsents = (consentsToAdd: string[]): void => {
    // Set the cookie in the browser
    Cookies.set(cookieName, consentsToAdd, { expires });

    // Set the current consents to trigger state updates downstream
    setCurrentConsents(consentsToAdd);
  };

  const addConsent = (consentToAdd: string): void => {
    // Use Set to ensure no duplicate consents
    setConsents(Array.from(new Set([...currentConsents, consentToAdd])));
  };

  const removeConsent = (consentToRemove: string): void => {
    // Use Set to ensure no duplicate consents
    setConsents(currentConsents.filter(c => c !== consentToRemove));
  };

  const clearConsents = (): void => {
    setConsents([]);
  };

  // Public API delivered via context value
  const contextValue = {
    addConsent,
    clearConsents,
    getConsents,
    removeConsent,
    setConsents,
  };

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = (): CookieConsent | null => {
  return useContext(CookieConsentContext);
};
