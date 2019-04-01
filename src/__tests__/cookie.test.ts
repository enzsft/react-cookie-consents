import Cookies from "js-cookie";
import { persistConsentsInCookie, readConsentsFromCookie } from "../cookie";

const cookieName = "consentsCookie";
const expires = 365;

beforeEach(() => {
  Cookies.remove(cookieName);
});

describe("persistConsentsInCookie", () => {
  it("should persist consents in the cookie", () => {
    // No consents
    persistConsentsInCookie(cookieName, [], expires);
    expect(JSON.parse(Cookies.get(cookieName))).toEqual([]);

    // Single consent
    const singleConsents = ["one"];
    persistConsentsInCookie(cookieName, singleConsents, expires);
    expect(JSON.parse(Cookies.get(cookieName))).toEqual(singleConsents);

    // Multiple consents
    const multipleConsents = ["two", "three"];
    persistConsentsInCookie(cookieName, multipleConsents, expires);
    expect(JSON.parse(Cookies.get(cookieName))).toEqual(multipleConsents);
  });
});

describe("readConsentsFromCookie", () => {
  it("should read consents from the cookie", () => {
    // No consents
    expect(readConsentsFromCookie(cookieName)).toEqual([]);

    // Single consent
    const singleConsents = ["one"];
    persistConsentsInCookie(cookieName, singleConsents, expires);
    expect(readConsentsFromCookie(cookieName)).toEqual(singleConsents);

    // Multiple consents
    const multipleConsents = ["two", "three"];
    persistConsentsInCookie(cookieName, multipleConsents, expires);
    expect(readConsentsFromCookie(cookieName)).toEqual(multipleConsents);
  });
});
