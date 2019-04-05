<div align="center">
  <h1>@enzsft/react-cookie-consents</h1>
  <h1>😲</h1>
  <h3>Handle cookie consents with ease.</h3>
  <a href='https://travis-ci.org/enzsft/react-cookie-consents'>
    <img src="https://travis-ci.org/enzsft/react-cookie-consents.svg?branch=master" alt="Build Status" />
  </a>
  <a href="https://codecov.io/github/enzsft/react-cookie-consents?branch=master">
    <img src="https://codecov.io/github/enzsft/react-cookie-consents/coverage.svg?branch=master" alt="Coverage via Codecov" />
  </a>
  <a href="https://www.npmjs.com/package/@enzsft/react-cookie-consents">
    <img src="https://badge.fury.io/js/%40enzsft%2Freact-cookie-consents.svg" alt="npm version">
  </a>
  <img alt="undefined" src="https://img.shields.io/github/languages/top/enzsft/react-cookie-consents.svg?style=flat">
</div>
<hr />

Building cookie banners should be easy. We've written **@enzsft/react-cookie-consents** to ensure you can get up and running as quickly as possible. It provides a convenient API to write and read cookie consents.

**@enzsft/react-cookie-consents uses [React Hooks](https://reactjs.org/docs/hooks-overview.html) so requires at least React@16.8.0**

## Motivation 🧐

The React ecosystem was lacking a hooks based cookie consents API when this library was first required.

## Getting started 🏎

### 1. Install the package:

```bash
yarn add @enzsft/react-cookie-consents

# or

npm install @enzsft/react-cookie-consents
```

### 2. Create a cookie banner

The following example renders a cookie banner but only if consent has not already been given.

```jsx
import { React } from "react";
import ReactDOM from "react-dom";
import {
  CookieConsentsProvider,
  useCookieConsents,
} from "@enzsft/react-cookie-consents";

const CookieBanner = () => {
  const cookieConsents = useCookieConsents();

  if (cookieConsents.get().length > 0) {
    return null;
  }

  return (
    <>
      <span>
        We use cookies to help give you the best experience on our site. By
        continuing you agree to our use of cookies.
      </span>
      <button type="button" onClick={() => cookieConsents.add("analytics")}>
        Accept and close
      </button>
    </>
  );
};

const App = () => {
  return (
    <CookieConsentsProvider cookieName="cookieConsents" expiryInDays={365}>
      <CookieBanner />
    </CookieConsentsProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

## API 🌳

### CookieConsentsProvider

Configure the cookie name and when it will expire.

```jsx
<CookieConsentsProvider cookieName="cookieConsents" expiryInDays={365}>
  {children}
</CookieConsentsProvider>
```

### useCookieConsents

React Hook that returns a cookie consent object to read/write cookie consents. Components that use this must be nested within a `CookieConsentsProvider` as it uses React Context.

Cookie consents are stores in a cookie. When you add, remove or clear consents the cookie is updated.

```jsx
const Comp = () => {
  const cookieConsents = useCookieConsents();

  // Get all cookie consents
  const allConsents = cookieConsents.get();

  // Add a new consent, silently ignores duplicates
  cookieConsents.add("consent name");

  // Remove a consent
  cookieConsents.remove("consent name");

  // Remove all consents
  cookieConsents.clear();
};
```

## Built with TypeScript with 💖

[TypeScript](https://www.typescriptlang.org/) type definitions are bundled in with the module. No need to install an additional module for type definitions.
