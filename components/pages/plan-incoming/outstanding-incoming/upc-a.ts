/**
 * UPC-A barcode → inline SVG. Parity WMS_CoreApp GenerateBarcodePrint:
 * input 11 digit + checksum dihitung (C# CalculateUPCAChecksum), render
 * hitam-putih tanpa label teks (IncludeLabel = false).
 */

const LEFT = [
  "0001101",
  "0011001",
  "0010011",
  "0111101",
  "0100011",
  "0110001",
  "0101111",
  "0111011",
  "0110111",
  "0001011",
];

/** Checksum UPC-A: (sumDigitGanjil × 3 + sumDigitGenap) → (10 − sisa) % 10 */
export function upcChecksum(eleven: string): number {
  let odd = 0;
  let even = 0;
  for (let i = 0; i < eleven.length; i++) {
    const d = Number(eleven[i]);
    if (i % 2 === 0) odd += d;
    else even += d;
  }
  return (10 - ((odd * 3 + even) % 10)) % 10;
}

/** 11 digit (atau 12 dgn checksum) → barcode penuh 12 digit */
export function toUpcA(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 11) return digits + String(upcChecksum(digits));
  if (digits.length === 12) return digits;
  return null;
}

/** Barcode valid utk print (parity legacy: >= 11 digit & numerik) */
export function isValidBarcode(v?: string | null): boolean {
  return !!v && /^\d{11,}$/.test(v);
}

/** SVG inline 95 module (guard bars lebih tinggi), tinggi mengikuti rasio 290×150 legacy */
export function upcaSvg(input: string): string {
  const code = toUpcA(input);
  if (!code) return "";
  const bits =
    "101" +
    code
      .slice(0, 6)
      .split("")
      .map((d) => LEFT[Number(d)])
      .join("") +
    "01010" +
    code
      .slice(6)
      .split("")
      .map((d) =>
        LEFT[Number(d)]
          .split("")
          .map((b) => (b === "1" ? "0" : "1"))
          .join(""),
      )
      .join("") +
    "101";

  const H = 100;
  const HD = 90; // digit bars
  let bars = "";
  bits.split("").forEach((b, i) => {
    if (b !== "1") return;
    const guard = i < 3 || (i >= 45 && i < 50) || i >= 92;
    const h = guard ? H : HD;
    bars += `<rect x="${i}" y="${H - h}" width="1" height="${h}" fill="#000"/>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 100" width="100%" preserveAspectRatio="none"><rect width="95" height="${H}" fill="#fff"/>${bars}</svg>`;
}
