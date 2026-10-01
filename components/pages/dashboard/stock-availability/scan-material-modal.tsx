/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CameraOutlined,
  CloseOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import MaterialApi from "@sera-libraries/api/material";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { Button, message, Modal, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// reuse gaya scan-screen binning (scan-corner / scan-frame-line)
import styles from "../../plan-incoming/outstanding-incoming/outstanding-incoming.module.scss";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Dipanggil saat barcode ter-resolve jadi materialCode → navigate ke Detail. */
  onResolved: (materialCode: string) => void;
}

/** Upload gambar → decode ZXing multi-strategi (TRY_HARDER + multi-skala +
 *  crop tengah + rotasi) — foto HP besar/miring sering gagal decode sekali jalan.
 *  (parity decodeImageFile Binning) */
const decodeImageFile = async (file: File): Promise<string> => {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();

    const hints = new Map<DecodeHintType, any>([
      [DecodeHintType.TRY_HARDER, true],
      [
        DecodeHintType.POSSIBLE_FORMATS,
        [
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.ITF,
          BarcodeFormat.CODABAR,
          BarcodeFormat.QR_CODE,
          BarcodeFormat.DATA_MATRIX,
        ],
      ],
    ]);
    const reader = new BrowserMultiFormatReader(hints);

    const scaled = (w: number, h: number) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      return c;
    };

    // 1) gambar apa adanya
    try {
      return (await reader.decodeFromImageElement(img)).getText();
    } catch {
      /* coba strategi berikutnya */
    }

    const maxDim = Math.max(img.naturalWidth, img.naturalHeight) || 1;
    // 2) turunkan resolusi — 1D barcode butuh lebar cukup, foto mentah terlalu besar
    for (const dim of [1600, 1100, 750]) {
      const r = Math.min(1, dim / maxDim);
      const c = scaled(
        Math.round(img.naturalWidth * r),
        Math.round(img.naturalHeight * r),
      );
      try {
        return reader.decodeFromCanvas(c).getText();
      } catch {
        /* lanjut */
      }
    }

    // 3) crop tengah 70% (pengguna biasanya memotret barcode di tengah)
    const r = Math.min(1, 1600 / maxDim);
    const cw = Math.round(img.naturalWidth * r);
    const ch = Math.round(img.naturalHeight * r);
    const base = scaled(cw, ch);
    const crop = document.createElement("canvas");
    crop.width = Math.round(cw * 0.7);
    crop.height = Math.round(ch * 0.7);
    crop
      .getContext("2d")!
      .drawImage(
        base,
        Math.round(cw * 0.15),
        Math.round(ch * 0.15),
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height,
      );
    try {
      return reader.decodeFromCanvas(crop).getText();
    } catch {
      /* lanjut */
    }

    // 4) rotasi 90° (EXIF orientasi aneh)
    const rot = document.createElement("canvas");
    rot.width = ch;
    rot.height = cw;
    const rctx = rot.getContext("2d")!;
    rctx.translate(rot.width / 2, rot.height / 2);
    rctx.rotate(Math.PI / 2);
    rctx.drawImage(base, -cw / 2, -ch / 2);
    return reader.decodeFromCanvas(rot).getText();
  } finally {
    URL.revokeObjectURL(url);
  }
};

/** Scan screen fullscreen gaya Binning Incoming (viewfinder + brackets +
 *  garis sapuan + mode upload). Barcode → resolve materialCode via
 *  GET /materials/by-barcode/:barcode → onResolved. */
const ScanMaterialModal = ({ open, onClose, onResolved }: Props) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "dashboard.stockAvailability.table.scan",
  });

  const [scanMode, setScanMode] = useState<"camera" | "upload">("camera");
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const busyRef = useRef(false);

  const closeScan = () => {
    setScanMode("camera");
    setUploadUrl(null);
    setCamError(null);
    onClose();
  };

  // hasil scan (kamera/upload) → resolve barcode → materialCode
  const resolve = async (value: string) => {
    const barcode = value.trim();
    if (!barcode || busyRef.current) return;
    busyRef.current = true;
    setResolving(true);
    try {
      const resp = await MaterialApi().retrieveMaterialByBarcode({ barcode });
      const material = (resp as any)?.data?.data;
      if (!material?.code) {
        message.warning(t("notFound", { barcode }));
        return;
      }
      onResolved(material.code);
    } catch {
      // error toast sudah ditampilkan global interceptor — jangan double
    } finally {
      busyRef.current = false;
      setResolving(false);
    }
  };

  const onUploadImage = async (file: File) => {
    setUploadUrl(URL.createObjectURL(file)); // preview terpisah — url decode di-revoke sendiri
    setCamError(null);
    setDetecting(true);
    try {
      const value = await decodeImageFile(file);
      await resolve(value);
    } catch {
      setCamError(t("noBarcodeInImage"));
    } finally {
      setDetecting(false);
    }
  };

  useEffect(() => {
    if (!open || scanMode !== "camera") return;
    let stopped = false;
    let controls: { stop: () => void } | null = null;
    let stream: MediaStream | null = null;
    let videoEl: HTMLVideoElement | null = null;
    (async () => {
      try {
        // getUserMedia hanya ada di secure context (HTTPS / localhost)
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("cameraInsecure");
        }
        // modal animasi → tunggu element video siap (maks ~1s), jangan gagal diam-diam
        videoEl = videoRef.current;
        for (let i = 0; !videoEl && i < 20; i++) {
          await new Promise((r) => setTimeout(r, 50));
          videoEl = videoRef.current;
        }
        if (!videoEl) throw new Error("video not ready");
        const streamObj = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        stream = streamObj;
        if (stopped) {
          streamObj.getTracks().forEach((tr) => tr.stop());
          return;
        }
        const el: HTMLVideoElement = videoEl;
        el.srcObject = stream; // preview langsung tampil
        await el.play();
        const reader = new BrowserMultiFormatReader();
        controls = await reader.decodeFromStream(stream, el, (result) => {
          if (stopped || !result) return;
          const value = result.getText();
          stopped = true;
          controls?.stop();
          resolve(value);
        });
      } catch (e: any) {
        if (stopped) return;
        // sebut penyebabnya — tampil DI DALAM modal, jangan cuma toast
        const cause =
          e?.message === "cameraInsecure"
            ? t("cameraInsecure")
            : e?.name === "NotAllowedError"
              ? t("cameraDenied")
              : e?.name === "NotFoundError"
                ? t("cameraNotFound")
                : e?.name === "NotReadableError"
                  ? t("cameraBusy")
                  : (e?.name ?? e?.message ?? "?");
        setCamError(String(cause));
        console.error("[stock-availability-camera]", e);
      }
    })();
    return () => {
      stopped = true;
      controls?.stop(); // stop loop decode zxing
      // jaga-jaga modal ditutup sebelum decode siap: stop stream langsung
      stream?.getTracks().forEach((tr) => tr.stop());
      if (videoEl) videoEl.srcObject = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, scanMode]);

  return (
    <>
      {/* Scan screen fullscreen — gaya Binning: viewfinder + brackets + garis sapuan */}
      <Modal
        open={open}
        footer={null}
        closable={false}
        width="100vw"
        style={{ top: 0, maxWidth: "100vw", margin: 0, padding: 0 }}
        styles={{
          header: { display: "none" },
          content: { background: "#000", borderRadius: 0, padding: 0 },
          body: { padding: 0 },
        }}
        onCancel={closeScan}
      >
        <div
          style={{
            position: "relative",
            width: "100vw",
            height: "100dvh",
            background: "#000",
            overflow: "hidden",
          }}
        >
          {/* preview: kamera live / gambar upload */}
          {scanMode === "camera" ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : uploadUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={uploadUrl}
              alt="upload"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                background: "#000",
              }}
            />
          ) : null}

          {/* overlay + viewfinder */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              className={styles["scan-frame"]}
              style={{
                position: "relative",
                width: "82%",
                maxWidth: 430,
                aspectRatio: "4 / 3",
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.55)",
              }}
            >
              {(
                [
                  {
                    top: 0,
                    left: 0,
                    borderTop: "3px solid #38bdf8",
                    borderLeft: "3px solid #38bdf8",
                    borderRadius: "16px 0 0 0",
                  },
                  {
                    top: 0,
                    right: 0,
                    borderTop: "3px solid #38bdf8",
                    borderRight: "3px solid #38bdf8",
                    borderRadius: "0 16px 0 0",
                  },
                  {
                    bottom: 0,
                    left: 0,
                    borderBottom: "3px solid #38bdf8",
                    borderLeft: "3px solid #38bdf8",
                    borderRadius: "0 0 0 16px",
                  },
                  {
                    bottom: 0,
                    right: 0,
                    borderBottom: "3px solid #38bdf8",
                    borderRight: "3px solid #38bdf8",
                    borderRadius: "0 0 16px 0",
                  },
                ] as React.CSSProperties[]
              ).map((c, i) => (
                <span key={i} className={styles["scan-corner"]} style={c} />
              ))}
              {scanMode === "camera" && (
                <span className={styles["scan-frame-line"]} />
              )}
            </div>
            <p
              style={{
                color: camError ? "#fca5a5" : "#fff",
                marginTop: 28,
                marginBottom: 0,
                fontSize: 15,
                fontWeight: 500,
                textAlign: "center",
                padding: "0 24px",
                textShadow: "0 1px 4px rgba(0,0,0,.8)",
              }}
            >
              {camError ?? t("cameraHint")}
            </p>
          </div>

          {/* top bar: X + judul */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "calc(env(safe-area-inset-top, 0px) + 14px) 18px 14px",
              background: "linear-gradient(rgba(0,0,0,.65), transparent)",
            }}
          >
            <Button
              type="text"
              shape="circle"
              icon={<CloseOutlined style={{ color: "#fff", fontSize: 18 }} />}
              onClick={closeScan}
              style={{ background: "rgba(255,255,255,.16)" }}
            />
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
              {t("title")}
            </div>
            <div style={{ width: 32 }} />
          </div>

          {/* bottom bar: upload / kembali ke kamera */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 12,
              padding:
                "18px 24px calc(env(safe-area-inset-bottom, 0px) + 22px)",
              background: "linear-gradient(transparent, rgba(0,0,0,.65))",
            }}
          >
            {scanMode === "upload" && (
              <Button
                size="large"
                icon={<CameraOutlined />}
                onClick={() => {
                  setScanMode("camera");
                  setUploadUrl(null);
                  setCamError(null);
                }}
                style={{ borderRadius: 999, minWidth: 170 }}
              >
                {t("cameraMode")}
              </Button>
            )}
            <Button
              type="primary"
              size="large"
              icon={<PictureOutlined />}
              onClick={() =>
                document
                  .getElementById("stock-availability-scan-upload")
                  ?.click()
              }
              style={{ borderRadius: 999, minWidth: 190 }}
            >
              {t("uploadMode")}
            </Button>
          </div>

          {(detecting || resolving) && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.55)",
                color: "#fff",
                fontSize: 15,
              }}
            >
              <Spin />
              <span style={{ marginLeft: 10 }}>
                {resolving ? t("resolving") : t("detecting")}
              </span>
            </div>
          )}

          <input
            id="stock-availability-scan-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) onUploadImage(file);
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default ScanMaterialModal;
