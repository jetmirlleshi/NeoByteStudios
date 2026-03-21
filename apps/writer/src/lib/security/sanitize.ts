/**
 * Utilita' di sanitizzazione input per prevenire XSS e injection.
 */

/**
 * Rimuove tutti i tag HTML dall'input dell'utente.
 * Utile per campi di testo che non devono contenere markup.
 *
 * @param input - Stringa potenzialmente contenente HTML
 * @returns Stringa pulita senza tag HTML
 *
 * @example
 * ```ts
 * sanitizeText("<script>alert('xss')</script>Ciao") // "Ciao"
 * sanitizeText("Testo <b>in grassetto</b>") // "Testo in grassetto"
 * ```
 */
export function sanitizeText(input: string): string {
  // Rimuove tutti i tag HTML/XML
  let sanitized = input.replace(/<[^>]*>/g, "");

  // Decodifica le entity HTML piu' comuni per prevenire double-encoding
  sanitized = sanitized
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");

  // Ri-escapa i caratteri pericolosi per l'output
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

  return sanitized.trim();
}

/**
 * Sanitizza un nome file per il download, rimuovendo caratteri
 * pericolosi e prevenendo path traversal.
 *
 * @param name - Nome file originale
 * @returns Nome file sicuro per il download
 *
 * @example
 * ```ts
 * sanitizeFilename("../../../etc/passwd") // "etcpasswd"
 * sanitizeFilename("il mio <file>.docx") // "il mio file.docx"
 * sanitizeFilename("  ") // "download"
 * ```
 */
export function sanitizeFilename(name: string): string {
  let sanitized = name
    // Rimuove path traversal
    .replace(/\.\./g, "")
    // Rimuove separatori di percorso
    .replace(/[/\\]/g, "")
    // Rimuove caratteri non validi per i nomi file
    .replace(/[<>:"|?*\x00-\x1F]/g, "")
    // Rimuove spazi iniziali e finali, e punti iniziali (file nascosti)
    .trim()
    .replace(/^\.+/, "");

  // Se il nome risulta vuoto dopo la sanitizzazione, usa un default
  if (sanitized.length === 0) {
    return "download";
  }

  // Limita la lunghezza a 255 caratteri (limite filesystem)
  if (sanitized.length > 255) {
    const ext = sanitized.lastIndexOf(".");
    if (ext > 0) {
      const extension = sanitized.slice(ext);
      const baseName = sanitized.slice(0, 255 - extension.length);
      return baseName + extension;
    }
    return sanitized.slice(0, 255);
  }

  return sanitized;
}

/**
 * Valida e sanitizza un URL. Accetta solo protocolli http e https.
 * Restituisce `null` se l'URL non e' valido o usa un protocollo non sicuro.
 *
 * @param url - URL da validare
 * @returns URL sanitizzato o `null` se non valido
 *
 * @example
 * ```ts
 * sanitizeUrl("https://example.com/path") // "https://example.com/path"
 * sanitizeUrl("javascript:alert(1)")      // null
 * sanitizeUrl("not a url")                // null
 * sanitizeUrl("http://example.com")       // "http://example.com"
 * ```
 */
export function sanitizeUrl(url: string): string | null {
  // Rimuove spazi e caratteri di controllo
  const trimmed = url.trim().replace(/[\x00-\x1F\x7F]/g, "");

  if (trimmed.length === 0) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);

    // Accetta solo protocolli sicuri
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }

    // Ricostruisce l'URL per normalizzarlo e rimuovere contenuto iniettato
    return parsed.toString();
  } catch {
    // L'URL non e' valido
    return null;
  }
}
