import React, { ReactElement, SFC } from "react";
import { render, fireEvent } from "react-testing-library";
import Cookies from "js-cookie";
import {
  CookieConsentsProvider,
  useCookieConsents,
} from "../cookie-consents-provider";
import { persistConsentsInCookie, readConsentsFromCookie } from "../cookie";

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
  const cookieConsent = useCookieConsents();

  const consents = cookieConsent.get();

  const addConsent = (): void => {
    cookieConsent.add(consentToAdd);
  };

  const clearConsents = (): void => {
    cookieConsent.clear();
  };

  const removeConsent = (): void => {
    cookieConsent.remove(consentToRemove);
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

describe("CookieConsentsProvider", () => {
  const cookieName = "cookie-consent";
  const expiryInDays = 365;
  const consentA = "consentA";
  const consentB = "consentB";
  const consentToAdd = "consentToAdd";
  const consentToRemove = "consentToRemove";
  const addConsentButtonTestId = "addConsentButtonTestId";
  const clearConsentsButtonTestId = "clearConsentsButtonTestId";
  const removeConsentButtonTestId = "removeConsentButtonTestId";
  const providerProps = {
    cookieName,
    expiryInDays,
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
      <CookieConsentsProvider {...providerProps}>
        <div data-testid="test" />
      </CookieConsentsProvider>,
    );

    getByTestId("test");
  });

  it("should load consents from existing cookie", () => {
    // Create a cookie before the provider
    const existingConsents = [consentA, consentB];
    persistConsentsInCookie(cookieName, existingConsents, expiryInDays);

    const { getByText } = render(
      <CookieConsentsProvider {...providerProps}>
        <TestHarness {...testHarnessProps} />
      </CookieConsentsProvider>,
    );

    // All consents should be printed out in test harness
    for (const consent of existingConsents) {
      getByText(consent);
    }
  });

  it("should add a new consent and update the cookie", () => {
    const { getByText, getByTestId } = render(
      <CookieConsentsProvider {...providerProps}>
        <TestHarness {...testHarnessProps} />
      </CookieConsentsProvider>,
    );

    // Harness provides a button to add a new consent
    fireEvent.click(getByTestId(addConsentButtonTestId));

    // Should have updated and render the new consent
    getByText(consentToAdd);

    // Should have written the cookie
    const consents = readConsentsFromCookie(cookieName);

    expect(consents).toEqual([consentToAdd]);
  });

  it("should remove consent and update the cookie", () => {
    // Create a cookie before the provider
    const existingConsents = [consentA, consentB, consentToRemove];
    persistConsentsInCookie(cookieName, existingConsents, expiryInDays);

    const { getByTestId, getByText, queryByText } = render(
      <CookieConsentsProvider {...providerProps}>
        <TestHarness {...testHarnessProps} />
      </CookieConsentsProvider>,
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
    persistConsentsInCookie(cookieName, existingConsents, expiryInDays);

    const { getByTestId, queryByText } = render(
      <CookieConsentsProvider {...providerProps}>
        <TestHarness {...testHarnessProps} />
      </CookieConsentsProvider>,
    );

    // Harness provides a button to remove a consent
    fireEvent.click(getByTestId(clearConsentsButtonTestId));

    // All the consents should be gone
    for (const consent of existingConsents) {
      expect(queryByText(consent)).not.toBeInTheDocument();
    }
  });
});
