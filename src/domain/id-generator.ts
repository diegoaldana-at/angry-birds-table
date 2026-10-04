/**
 * Generador de UUID v4 compatible con contextos seguros y no seguros (HTTP LAN con --host).
 * Cumple con la especificación RFC 4122.
 */
export function generateId(): string {
  // 1. Contexto seguro nativo (HTTPS o localhost)
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // 2. Contexto no seguro con Web Crypto API (disponible en HTTP en la mayoría de navegadores móviles)
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // Configurar variante RFC 4122 y versión 4
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  // 3. Fallback de alta entropía (timestamp + random) para entornos restringidos
  let d = Date.now();
  let d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0;

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else if (d2 > 0) {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    } else {
      r = r | 0;
    }
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
