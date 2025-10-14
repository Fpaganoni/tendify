// convert html to text
import { convert } from "html-to-text";
// function to strip HTML tags from a string

export function stripHtml(html: string): string {
  // Detects whether the code is running on the server or in the browser
  return convert(html, {
    wordwrap: false,
    preserveNewlines: false,
  }).trim();
}
