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

/** 11+ digit → barcode 12 digit. Parity BarcodeStandard UPCA: checksum
 *  SELALU dihitung ulang dari 11 digit pertama (digit ke-12 salah diganti). */
export function toUpcA(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length < 11) return null;
  const eleven = digits.slice(0, 11);
  return eleven + String(upcChecksum(eleven));
}

/** Barcode valid utk print (parity legacy: >= 11 digit & numerik) */
export function isValidBarcode(v?: string | null): boolean {
  return !!v && /^\d{11,}$/.test(v);
}

/** SVG inline — pixel-parity BarcodeStandard (barcodelib) UpcA:
 *  kanvas 290×150, iBarWidth = floor(W/95) = 3, alignment CENTER →
 *  shift = (W − 95×3)/2 = 2, tiap bar = garis vertikal stroke 3px dari
 *  y=0..H (tinggi seragam, tanpa quiet zone) — persis Encode(UpcA, 290, 150). */
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

  const W = 290;
  const H = 150;
  const BW = Math.floor(W / bits.length); // 3 — integer division parity lib
  const SHIFT = Math.floor((W - bits.length * BW) / 2); // 2 — alignment CENTER
  const HALF = Math.floor(BW * 0.5); // 1
  let bars = "";
  bits.split("").forEach((b, pos) => {
    if (b !== "1") return;
    // garis stroke BW px di x-center pos*BW+SHIFT+HALF → rect x = center − BW/2
    bars += `<rect x="${(pos * BW + SHIFT + HALF - BW / 2).toFixed(2)}" y="0" width="${BW}" height="${H}" fill="#000"/>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/>${bars}</svg>`;
}
