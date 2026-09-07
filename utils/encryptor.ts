/* eslint-disable @typescript-eslint/no-explicit-any */
import { AES, enc } from "crypto-js";

function hexToArrayBuffer(hexString: string) {
  const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBufferLike) {
  const bytes = new Uint8Array(buffer);
  let binaryString = "";
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binaryString);
}

export const encryptData = (data: any, key?: string, keyIV?: any): string => {
  const input = typeof data !== "string" ? JSON.stringify(data) : data;

  if (!process.env.SECRET_KEY || !data) return "";
  if (keyIV !== undefined) {
    return AES.encrypt(input, enc.Hex.parse(key!), {
      iv: enc.Hex.parse(keyIV),
      keySize: 256,
    }).toString();
  }

  return AES.encrypt(
    JSON.stringify(data),
    key ?? process.env.SECRET_KEY,
  ).toString();
};

export const decryptData = (
  encryptedData: string | undefined,
  key?: string,
  keyIV?: any,
): any => {
  if (!process.env.SECRET_KEY || !encryptedData) return "";
  try {
    if (key !== undefined && keyIV !== undefined) {
      const bytes = AES.decrypt(encryptedData, enc.Hex.parse(key!), {
        iv: enc.Hex.parse(keyIV),
        keySize: 256,
      });

      return bytes.toString(enc.Utf8);
    }

    const bytes = AES.decrypt(encryptedData, process.env.SECRET_KEY);
    return JSON.parse(bytes.toString(enc.Utf8));
  } catch {
    // Ciphertext tidak cocok dengan SECRET_KEY saat ini (mis. key baru saja
    // berganti, atau data localStorage sudah usang) — perlakukan sebagai
    // "tidak ada data" agar pemanggil bisa fallback fetch/re-encrypt ulang,
    // bukan crash dengan unhandled "Malformed UTF-8 data".
    return "";
  }
  const bytes = AES.decrypt(encryptedData, process.env.SECRET_KEY);
  const text = bytes.toString(enc.Utf8);
  // .env dev kadang diisi plaintext — pakai langsung; ciphertext crypto-js selalu
  // berawalan "U2FsdGVkX1" (OpenSSL salted), nilai lain dianggap plaintext
  if (!text) return encryptedData.startsWith("U2FsdGVkX1") ? "" : encryptedData;
  return JSON.parse(text);
};

export const encryptDataGCM = async (
  data: string,
  key: string,
  keyIV: any,
): Promise<string> => {
  const _key = hexToArrayBuffer(key);
  const iv = hexToArrayBuffer(keyIV);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    _key,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );

  const encoder = new TextEncoder();
  const encodedText = encoder.encode(data);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    cryptoKey,
    encodedText,
  );

  const encryptedArray = new Uint8Array(encrypted);
  const cipherText = encryptedArray.slice(0, encryptedArray.byteLength - 16);
  const authTag = encryptedArray.slice(encryptedArray.byteLength - 16);

  // Append the auth tag to the encrypted text
  const cipherTextWithTag = new Uint8Array(cipherText.length + authTag.length);
  cipherTextWithTag.set(cipherText);
  cipherTextWithTag.set(authTag, cipherText.length);

  return arrayBufferToBase64(cipherTextWithTag.buffer);
};

export const decryptDataGCM = async (
  encryptedData: string,
  key: string,
  keyIV: any,
): Promise<string> => {
  const _key = hexToArrayBuffer(key);
  const iv = hexToArrayBuffer(keyIV);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    _key,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );

  const combined = new Uint8Array(
    atob(encryptedData)
      .split("")
      .map((char) => char.charCodeAt(0)),
  );

  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    combined,
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
};
