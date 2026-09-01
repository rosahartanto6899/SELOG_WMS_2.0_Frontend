/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
// import { UploadFile } from 'antd';
// import { read, utils } from 'xlsx';
import axios from "axios";
import { NextRouter } from "next/router";
import { PDFDocument } from "pdf-lib";
import sanitizeHtml from "sanitize-html";

import { Address } from "../libraries/types/mapType";
import {
  DataType,
  RolePermissionData,
} from "../libraries/types/role-permission.type";
import FormatUtils from "./format";

const Utils = () => {
  function generateId() {
    const possible = `ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`;
    const lengthOfCode = 20;
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(FormatUtils().createRandomInteger());
    }
    return `${text}${+new Date()}`;
  }

  function generateAddressInGoogleMaps(address: Address[]) {
    let result = "";
    let premise = "";
    let subPremise = "";
    let route = "";
    let streetNumber = "";
    let adm7 = "";
    let adm6 = "";
    let adm5 = "";
    let adm4 = "";
    let adm3 = "";
    let adm2 = "";
    let adm1 = "";
    let country = "";
    let postalCode = "";

    address.forEach((item) => {
      if (item.types.some((type: string) => type === "premise")) {
        premise = `${item.long_name} `;
      } else if (item.types.some((type: string) => type === "subpremise")) {
        subPremise = `${item.long_name} `;
      } else if (item.types.some((type: string) => type === "route")) {
        route = `${item.long_name} `;
      } else if (item.types.some((type: string) => type === "street_number")) {
        streetNumber = `${item.long_name} `;
      } else if (
        item.types.some(
          (type: string) => type === "administrative_area_level_7",
        )
      ) {
        adm7 = `${item.long_name} `;
      } else if (
        item.types.some(
          (type: string) => type === "administrative_area_level_6",
        )
      ) {
        adm6 = `${item.long_name}, `;
      } else if (
        item.types.some(
          (type: string) => type === "administrative_area_level_5",
        )
      ) {
        adm5 = `${item.long_name}, `;
      } else if (
        item.types.some(
          (type: string) => type === "administrative_area_level_4",
        )
      ) {
        adm4 = `${item.long_name}, `;
      } else if (
        item.types.some(
          (type: string) => type === "administrative_area_level_3",
        )
      ) {
        adm3 = `${item.long_name}, `;
      } else if (
        item.types.some(
          (type: string) => type === "administrative_area_level_2",
        )
      ) {
        adm2 = `${item.long_name}, `;
      } else if (
        item.types.some(
          (type: string) => type === "administrative_area_level_1",
        )
      ) {
        adm1 = `${item.long_name} `;
      } else if (item.types.some((type: string) => type === "postal_code")) {
        postalCode = `${item.long_name}, `;
      } else if (item.types.some((type: string) => type === "country")) {
        country = item.long_name;
      }
    });

    result = `${premise}${subPremise}${route}${streetNumber}${adm7}${adm6}${adm5}${adm4}${adm3}${adm2}${adm1}${postalCode}${country}`;

    return result.trim();
  }

  function hasPermission(
    permissions: {
      id: string;
      permission: { enable: boolean; visible: boolean };
    }[],
    id: string,
  ) {
    const permission = permissions.find(
      (_permission) => _permission.id === id,
    )?.permission;
    if (permission) {
      return permission;
    }
    return { enable: false, visible: false };
  }

  function findObject(object: unknown, value: string | number) {
    let result = null;
    if (!object || typeof object !== "object") return;
    Object.values(object).some((v) => {
      if (v === value) {
        result = object;
        return result;
      }
      result = findObject(v, value);
      return result;
    });
    return result;
  }

  function findChildren(
    dataList: RolePermissionData[],
    item: RolePermissionData,
  ) {
    let parent: DataType = { ...item };
    if (item) {
      parent = { ...item, key: item.permissionId };
      const children = dataList
        .filter((x) => x.parentFeatureId === item.permissionId)
        .sort((a, b) => a.permissionId - b.permissionId)
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        .map((y) => generateTree(dataList, y)[0]);

      if (children && children.length > 0) {
        parent.children = children;
      }
    }
    return parent;
  }

  function generateTree(
    dataList: RolePermissionData[],
    item?: DataType | DataType[],
  ) {
    const result: DataType[] = [];
    if (!item) {
      // find only item that has parentFeatureId === 0
      const topParent = dataList.find((_item) => _item.parentFeatureId === 0);
      if (topParent) {
        result.push(findChildren(dataList, topParent));
      }
      item = dataList.filter((_item) => _item.parentFeatureId !== 0);
    }
    if (Array.isArray(item)) {
      item.forEach((i) => {
        const object = findObject(result, i.permissionId);
        if (!object) {
          result.push(findChildren(dataList, i));
        }
      });
    } else {
      result.push(findChildren(dataList, item));
    }
    return result;
  }

  function stringToTitleCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function parsePath(
    locationPathname: string,
    gotoSpecificPath = "",
    destinationPath = "",
  ) {
    let result: string | null = "";
    const splittedPath = locationPathname.split("/");
    const filteredPath = splittedPath.filter((c) => c).map((c) => c);
    const basePath = filteredPath[0];
    const { length } = filteredPath;
    for (let i = 0; i < length; i++) {
      if (gotoSpecificPath.length > 0 && filteredPath[i] === gotoSpecificPath) {
        result = "";
        for (let j = length - 1; j >= 0; j--) {
          if (filteredPath[j] === gotoSpecificPath) {
            result = `${result}${gotoSpecificPath}`;
            break;
          }
          result += "../";
        }
        break;
      } else {
        result += "../";
      }
    }
    result = `${result}${destinationPath}`.trim();
    if (!result) {
      result = "../";
    }
    if (`${destinationPath}`.startsWith(basePath)) {
      result = `${destinationPath}`.replace(basePath, "");
    }
    return result;
  }

  function isValidEmail(str: string) {
    const result =
      /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return (
      result.test(str) && /^[^\s@]+@(?:[^\s@.]+\.)*astra\.co\.id$/.test(str)
    );
  }

  function isSecureUrl(url: string) {
    return url.startsWith("https://");
  }

  function getDomainName(fullUrl: string) {
    return !isSecureUrl(fullUrl)
      ? fullUrl?.split("//")?.[1]?.split(":")?.[0]
      : fullUrl?.split("//")?.[1];
  }

  function convertMsToTime(milliseconds: number): string {
    let strTime = "";
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds %= 60;
    minutes %= 60;

    // 👇️ If you don't want to roll hours over, e.g. 24 to 00
    // 👇️ comment (or remove) the line below
    // commenting next line gets you `24:00:00` instead of `00:00:00`
    // or `36:15:31` instead of `12:15:31`, etc.
    hours %= 24;

    if (hours) {
      strTime += `${hours} ${hours > 1 ? "hours " : "hour "}`;
    }

    if (minutes) {
      strTime += `${minutes} ${minutes > 1 ? "minutes " : "minute "}`;
    }

    if (seconds) {
      strTime += `${seconds}s`;
    }

    return strTime;
  }

  const onGoBack = (router: NextRouter, url: string) => {
    if (window.history && window.history.length > 2) {
      router.back();
    } else {
      router.push(url);
    }
  };

  const intlNumberFormatter = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    minimumIntegerDigits: 1,
    useGrouping: true,
    style: "currency",
    currency: "IDR",
  });

  // const parseXLSXFile = async (file: UploadFile, transformDataSheet: (dataSheet: any) => void) => {
  //   const { originFileObj } = file;

  //   if (!originFileObj) {
  //     return [];
  //   }

  //   const objectBuffer = await originFileObj.arrayBuffer();
  //   const workbook = read(objectBuffer);
  //   const currentSheet = workbook.Sheets[workbook.SheetNames[0]];

  //   if (typeof currentSheet === 'undefined') {
  //     return [];
  //   }

  //   const dataSheet = utils.sheet_to_json(currentSheet, { raw: false });
  //   return transformDataSheet(dataSheet);
  // };

  function titleToKebabCase(title: string): string {
    return title.toLowerCase().split(" ").join("-");
  }

  async function downloadFile(
    fileUrl: string,
    filename: string,
    accessToken: string,
    mimeType: string,
  ): Promise<void> {
    const { status, data } = await axios.get(
      `/api/download?fileUrl=${fileUrl}&filename=${filename}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (status === 200) {
      const blob = new Blob([data], { type: mimeType });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      throw new Error("Cannot download file, please try again.");
    }
  }

  function generateArrayOfYears(): string[] {
    // Create an array of 10 most recent years

    const max = new Date().getFullYear();
    const min = max - 9;
    const years = [];

    for (let i = max; i >= min; i--) {
      years.push(i.toString());
    }
    return years;
  }

  function generateSplittedKey(inputKey: string): {
    key: string;
    keyIV: string;
  } {
    const splitKey = inputKey.split(inputKey.slice(-2));

    let key: string = "";
    let keyIV: string = "";
    splitKey.forEach((item: string) => {
      if (item !== "") {
        if (item.length < 33) keyIV = item;
        else key = item;
      }
    });

    return { key, keyIV };
  }

  function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  }

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function sanitizeInput(input: string): string {
    return sanitizeHtml(input || "", {
      disallowedTagsMode: "discard",
      allowedTags: sanitizeHtml.defaults.allowedTags.filter(
        (tag) => !["iframe", "script", "style"].includes(tag),
      ),
      allowedAttributes: {
        a: ["href"],
      },
      allowedSchemesByTag: {
        a: ["http", "https"],
      },
      transformTags: {
        a: (_, attribs: { [key: string]: string }): any => {
          const href = attribs.href || "";
          const WHITE_LIST = ["trac.astra.co.id", "sera.astra.co.id"];
          const isGoogleDomain =
            WHITE_LIST.find((item) => href.includes(item)) ?? false;
          if (isGoogleDomain) return { tagName: "a", attribs };
          return { tagName: "span", text: attribs.href };
        },
      },
    });
  }

  function convertFileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // When file reading is successful
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as ArrayBuffer);
        } else {
          reject(new Error("Failed to read file as ArrayBuffer."));
        }
      };

      // When there's an error reading the file
      reader.onerror = () => {
        reject(new Error("Error reading file."));
      };

      // Start reading the file as an ArrayBuffer
      reader.readAsArrayBuffer(file);
    });
  }

  async function generatePdfWithWatermark(
    _file: string | File,
  ): Promise<string | Error> {
    try {
      // Fetch watermark image
      const watermarkPng = "/images/logo_transparent.png";
      const pngImageBytes = await fetch(watermarkPng).then((res) =>
        res.arrayBuffer(),
      );

      // Fetch an existing PDF document
      const existingPdfBytes =
        typeof _file === "string"
          ? await fetch(_file).then((res) => res.arrayBuffer())
          : await Utils().convertFileToArrayBuffer(_file);

      // Load a PDFDocument from the existing PDF bytes
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Embed Image
      const pngImage = await pdfDoc.embedPng(pngImageBytes);
      const jpgDims = pngImage.scale(0.5);

      // Get the first page of the document
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        page.drawImage(pngImage, {
          x: page.getWidth() / 2 - jpgDims.width / 2,
          y: page.getHeight() / 2,
          width: jpgDims.width,
          height: jpgDims.height,
        });
      });

      // Serialize the PDFDocument to bytes (a Uint8Array)
      const newPDF: Uint8Array = await pdfDoc.save();
      const arrayBuffer = new Uint8Array(newPDF).buffer;
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });

      return URL.createObjectURL(blob);
    } catch (error) {
      throw new Error("Error");
    }
  }

  const isValidFileType = (type: "doc" | "image", file: File) => {
    let acceptedTypeFile;

    if (type === "doc") {
      acceptedTypeFile = [
        "application/pdf",
        "pdf",
        "jpg",
        "bmp",
        "jpeg",
        "png",
        "image/jpg",
        "image/bmp",
        "image/jpeg",
        "image/png",
      ];
    } else {
      acceptedTypeFile = ["image/jpg", "image/bmp", "image/jpeg", "image/png"];
    }

    if (acceptedTypeFile.includes(file.type)) return true;

    return false;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildQueryParams = (params: Record<string, any>): string => {
    if (!params) return "";

    const query = Object.entries(params)
      .map(([key, value]) => {
        if (value === undefined || value === null) return "";

        if (Array.isArray(value)) {
          return value
            .map((v) => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`)
            .join("&");
        }

        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .filter(Boolean)
      .join("&");

    return query ? `?${query}` : "";
  };

  const withDash = <T extends Record<string, any>>(obj?: T) =>
    Object.fromEntries(
      Object.entries(obj ?? {}).map(([key, value]) => {
        if (typeof value === "number") {
          return [key, value || 0];
        }

        if (typeof value !== "string") {
          return [key, value];
        }

        return [key, value || "-"];
      }),
    );

  const getFileExtensionFromUrl = (path: string) =>
    path.slice(((path.lastIndexOf(".") - 1) >>> 0) + 2);

  return {
    generateId,
    generateAddressInGoogleMaps,
    generateTree,
    findObject,
    findChildren,
    hasPermission,
    stringToTitleCase,
    parsePath,
    isValidEmail,
    isSecureUrl,
    getDomainName,
    convertMsToTime,
    onGoBack,
    intlNumberFormatter,
    // parseXLSXFile,
    titleToKebabCase,
    downloadFile,
    generateArrayOfYears,
    generateSplittedKey,
    base64ToArrayBuffer,
    blobToBase64,
    sanitizeInput,
    convertFileToArrayBuffer,
    generatePdfWithWatermark,
    isValidFileType,
    buildQueryParams,
    withDash,
    getFileExtensionFromUrl,
  };
};

export default Utils;
