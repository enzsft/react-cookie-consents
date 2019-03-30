import React, { ReactElement, SFC } from "react";
import { render, fireEvent } from "react-testing-library";
import Cookies from "js-cookie";
import {
  CookieConsentProvider,
  useCookieConsent,
} from "../cookie-consent-provider";

interface TestHarnessProps {
  addConsentButtonTestId: string;
  clearConsentsButtonTestId: string;
  consentToAdd: string;
  consentToRemove: string;
  removeConsentButtonTestId: string;
}

const TestHarness: SFC<TestHarnessProps> = ({
  addConsentButtonTestId,
  clearConsentsButtonTestId,
  consentToAdd,
  consentToRemove,
  removeConsentButtonTestId,
}): ReactElement => {
  const cookieConsent = useCookieConsent();

  const consents = cookieConsent.getConsents();

  const addConsent = (): void => {
    cookieConsent.addConsent(consentToAdd);
  };

  const clearConsents = (): void => {
    cookieConsent.clearConsents();
  };

  const removeConsent = (): void => {
    cookieConsent.removeConsent(consentToRemove);
  };

  // Render out list of current consents to query in tests
  return (
    <>
      <button data-testid={addConsentButtonTestId} onClick={addConsent} />
      <button data-testid={clearConsentsButtonTestId} onClick={clearConsents} />
      <button data-testid={removeConsentButtonTestId} onClick={removeConsent} />

      <ul>
        {consents.map(c => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </>
  );
};

describe("CookieConsentProvider", () => {
  const cookieName = "cookie-consent";
  const expires = 365;
  const consentA = "consentA";
  const consentB = "consentB";
  const consentToAdd = "consentToAdd";
  const consentToRemove = "consentToRemove";
  const addConsentButtonTestId = "addConsentButtonTestId";
  const clearConsentsButtonTestId = "clearConsentsButtonTestId";
  const removeConsentButtonTestId = "removeConsentButtonTestId";
  const providerProps = {
    cookieName,
    expires,
  };
  const testHarnessProps = {
    consentToAdd,
    consentToRemove,
    addConsentButtonTestId,
    clearConsentsButtonTestId,
    removeConsentButtonTestId,
  };

  beforeEach(() => {
    // Clear consent cookie before each test
    Cookies.remove(cookieName);
  });

  it("should render children", () => {
    const { getByTestId } = render(
      <CookieConsentProvider {...providerProps}>
        <div data-testid="test" />
      </CookieConsentProvider>,
    );

    getByTestId("test");
  });

  it("should load consents from existing cookie", () => {
    // Create a cookie before the provider
    const existingConsents = [consentA, consentB];
    Cookies.set(cookieName, JSON.stringify(existingConsents), {
      expires: 365,
    });

    const { getByText } = render(
      <CookieConsentProvider {...providerProps}>
        <TestHarness {...testHarnessProps} />
      </CookieConsentProvider>,
    );

    // All consents should be printed out in test harness
    for (const consent of existingConsents) {
      getByText(consent);
    }
  });

  it("should add a new consent and update the cookie", () => {
    const { getByText, getByTestId } = render(
      <CookieConsentProvider {...providerProps}>
        <TestHarness {...testHarnessProps} />
      </CookieConsentProvider>,
    );

    // Harness provides a button to add a new consent
    fireEvent.click(getByTestId(addConsentButtonTestId));

    // Should have updated and render the new consent
    getByText(consentToAdd);

    // Should have written the cookie
    //Cookies.set(cookieName, JSON.stringify([consentToAdd]));
    const consents = Cookies.getJSON(cookieName);

    expect(consents).toEqual([consentToAdd]);
  });

  it("should remove consent and update the cookie", () => {
    // Create a cookie before the provider
    const existingConsents = [consentA, consentB, consentToRemove];
    Cookies.set(cookieName, JSON.stringify(existingConsents), {
      expires: 365,
    });

    const { getByTestId, getByText, queryByText } = render(
      <CookieConsentProvider {...providerProps}>
        <TestHarness {...testHarnessProps} />
      </CookieConsentProvider>,
    );

    // Harness provides a button to remove a consent
    fireEvent.click(getByTestId(removeConsentButtonTestId));

    // These 2 consents should still be in place
    getByText(consentA);
    getByText(consentB);

    // This consent should be gone
    expect(queryByText(consentToRemove)).not.toBeInTheDocument();
  });

  it("should clear all consents and update the cookie", () => {
    // Create a cookie before the provider
    const existingConsents = [consentA, consentB];
    Cookies.set(cookieName, JSON.stringify(existingConsents), {
      expires: 365,
    });

    const { getByTestId, queryByText } = render(
      <CookieConsentProvider {...providerProps}>
        <TestHarness {...testHarnessProps} />
      </CookieConsentProvider>,
    );

    // Harness provides a button to remove a consent
    fireEvent.click(getByTestId(clearConsentsButtonTestId));

    // All the consents should be gone
    for (const consent of existingConsents) {
      expect(queryByText(consent)).not.toBeInTheDocument();
    }
  });
});
