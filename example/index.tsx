import React, { SFC, ReactElement } from "react";
import ReactDOM from "react-dom";
import {
  CookieConsentProvider,
  useCookieConsent,
} from "../src/cookie-consent-provider";

const CookieBanner: SFC<any> = (): ReactElement => {
  const cookieConsent = useCookieConsent();
  return (
    <>
      <h2>Add cookie consents:</h2>
      <button
        type="button"
        onClick={() => cookieConsent.addConsent("analytics")}
      >
        Analytics
      </button>
      <button
        type="button"
        onClick={() => cookieConsent.addConsent("advertising")}
      >
        Advertising
      </button>
      <button
        type="button"
        onClick={() => cookieConsent.addConsent("third-party")}
      >
        3rd Party
      </button>
      <h2>Remove cookie consents:</h2>
      <button
        type="button"
        onClick={() => cookieConsent.removeConsent("analytics")}
      >
        Analytics
      </button>
      <button
        type="button"
        onClick={() => cookieConsent.removeConsent("advertising")}
      >
        Advertising
      </button>
      <button
        type="button"
        onClick={() => cookieConsent.removeConsent("third-party")}
      >
        3rd Party
      </button>
      <h2>Clear cookie consents:</h2>
      <button type="button" onClick={() => cookieConsent.clearConsents()}>
        Clear
      </button>
      <h2>You have consented to the following cookies:</h2>
      <ul>
        {cookieConsent.getConsents().map(c => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </>
  );
};

const App: SFC<any> = (): ReactElement => {
  return (
    <>
      <h1>@enzsft/react-cookie-content</h1>
      <CookieConsentProvider cookieName="cookieConsent" expires={365}>
        <CookieBanner />
      </CookieConsentProvider>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
