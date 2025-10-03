// function to strip HTML tags from a string

export function stripHtml(html: string): string {
  // Detects whether the code is running on the server or in the browser
  if (typeof window === "undefined") {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
  }

  // En el cliente
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}
