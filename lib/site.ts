export const DEMO_PHONE_DISPLAY = "+1 (888) 492-7464";
export const DEMO_PHONE_TEL = "tel:+18884927464";

/**
 * Every "Start for Free" button goes to the customer app's signup wizard.
 * The free trial starts when the wizard is finished — no card is asked
 * for — and its length and limits are set in the backoffice.
 */
export const SIGNUP_URL = `${(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/+$/, "")}/signup`;
