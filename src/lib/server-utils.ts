import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// DOMPurify config for Node.js
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export function cleanString(value?: unknown): string {
  return typeof value === "string" ? DOMPurify.sanitize(value.trim(), { ALLOWED_TAGS: [] }) : "";
}
