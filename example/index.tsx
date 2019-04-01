import React, { SFC, ReactElement } from "react";
import ReactDOM from "react-dom";
import {
  CookieConsentsProvider,
  useCookieConsents,
} from "../src/cookie-consents-provider";

const CookieBanner: SFC<any> = (): ReactElement => {
  const cookieConsents = useCookieConsents();
  return (
    <>
      <h2>Add cookie consents:</h2>
      <button type="button" onClick={() => cookieConsents.add("analytics")}>
        Analytics
      </button>
      <button type="button" onClick={() => cookieConsents.add("advertising")}>
        Advertising
      </button>
      <button type="button" onClick={() => cookieConsents.add("third-party")}>
        3rd Party
      </button>
      <h2>Remove cookie consents:</h2>
      <button type="button" onClick={() => cookieConsents.remove("analytics")}>
        Analytics
      </button>
      <button
        type="button"
        onClick={() => cookieConsents.remove("advertising")}
      >
        Advertising
      </button>
      <button
        type="button"
        onClick={() => cookieConsents.remove("third-party")}
      >
        3rd Party
      </button>
      <h2>Clear cookie consents:</h2>
      <button type="button" onClick={() => cookieConsents.clear()}>
        Clear
      </button>
      <h2>You have consented to the following cookies:</h2>
      <ul>
        {cookieConsents.get().map(c => (
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
      <CookieConsentsProvider cookieName="cookieConsents" expires={365}>
        <CookieBanner />
      </CookieConsentsProvider>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
