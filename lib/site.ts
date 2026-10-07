/** The live demo line, from DEMO_PHONE_NUMBER (E.164, e.g. +18884927464). */
const DEMO_PHONE = (process.env.DEMO_PHONE_NUMBER || "+18884927464").replace(/[^\d+]/g, "");

export const DEMO_PHONE_TEL = `tel:${DEMO_PHONE}`;

/** "+18884927464" → "+1 (888) 492-7464"; anything that isn't a US number is shown as given. */
export const DEMO_PHONE_DISPLAY = (() => {
  const us = DEMO_PHONE.match(/^\+?1?(\d{3})(\d{3})(\d{4})$/);
  return us ? `+1 (${us[1]}) ${us[2]}-${us[3]}` : DEMO_PHONE;
})();

/**
 * Every "Try for Free" button goes to the customer portal's signup wizard
 * (PORTAL_URL). The free trial starts when the wizard is finished — no card
 * is asked for — and its length and limits are set in the backoffice.
 */
export const SIGNUP_URL = `${(process.env.PORTAL_URL || "http://localhost:3000").replace(/\/+$/, "")}/signup`;

/** Footer social links. An unset one is left out of the footer. */
export const LINKEDIN_URL = process.env.LINKEDIN_URL || "";
export const TWITTER_URL = process.env.TWITTER_URL || "";

/**
 * The contact form posts straight to the API (POST /contact). The landing
 * page's origin is already allowed by the API's CORS as ADMIN_ORIGIN.
 */
export const CONTACT_API_URL = `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "")}/contact`;
