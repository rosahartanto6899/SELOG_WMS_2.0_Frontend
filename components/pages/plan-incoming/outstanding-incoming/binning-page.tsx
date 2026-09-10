/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AimOutlined,
  BarcodeOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CheckSquareOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  PrinterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import OutstandingIncomingApi from "@sera-libraries/api/outstanding-incoming";
import { OutstandingIncomingDetail } from "@sera-types/outstanding-incoming.type";
import { ROUTE } from "@sera-utils/constants/routes";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import {
  Alert,
  Button,
  Col,
  Input,
  InputRef,
  message,
  Modal,
  Popover,
  Row,
  Space,
  Spin,
} from "antd";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import BinningSlipForm from "./binning-slip-form";
import styles from "./outstanding-incoming.module.scss";

/**
 * B2 — Binning parity legacy, sebagai HALAMAN (bukan popup):
 * card-grid per material (partialQty ≠ 0), step Material→Location→Selesai.
 * Flow scan per-card parity WMS CoreApp (OutstandingPlanIncoming.js):
 * scan barcode material (Enter; "0" = bypass) → input terkunci hijau + fokus ke
 * barcode lokasi → scan lokasi valid = auto-submit binning + fokus card berikutnya.
 * Tombol Complete = bypass scan (setara klik step Completed legacy).
 * Route: /plan-incoming/outstanding-incoming/binning?id={headerId}
 */
const BinningPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation(undefined, {
    keyPrefix: "planIncoming.outstandingIncoming.binning",
  });

  const [details, setDetails] = useState<OutstandingIncomingDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [slipOpen, setSlipOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [allLoading, setAllLoading] = useState(false);
  // Flow scan per-card (parity legacy): material tervalidasi → matOk; nilai input per card
  const [matOkIds, setMatOkIds] = useState<Set<string>>(new Set());
  const [matErrIds, setMatErrIds] = useState<Set<string>>(new Set());
  const [locErrIds, setLocErrIds] = useState<Set<string>>(new Set());
  const [matVal, setMatVal] = useState<Record<string, string>>({});
  const [locVal, setLocVal] = useState<Record<string, string>>({});
  const materialRefs = useRef<Record<string, InputRef | null>>({});
  const locationRefs = useRef<Record<string, InputRef | null>>({});

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const header = await OutstandingIncomingApi().retrieveDetailTyped(
        String(id),
      );
      setDetails(header.details ?? []);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // isDone/doneIds saat data pertama datang masih kosong → cek murni dari data
  // Bisa diproses = masih ada sisa qty (binningQty < poQty). partialQty ≠ 0
  // diperlukan utk submit — user isi via Quality Inspection. Jangan pakai binningDate:
  // binning parsial (20/50) membuat binningDate terisi tapi belum selesai.
  const scannableStatic = (d: OutstandingIncomingDetail) =>
    (d.binningQty ?? 0) < (d.poQty ?? 0);

  // Semua sudah ter-binning (tak ada sisa qty) → konfirmasi: tetap di
  // binning (lihat kartu hijau) atau kembali ke daftar Outstanding Incoming
  useEffect(() => {
    if (!loading && details.length > 0 && !details.some(scannableStatic)) {
      Modal.confirm({
        title: t("doneAsk"),
        okText: t("doneBack"),
        cancelText: t("doneStay"),
        onOk: () => router.push(ROUTE.PLAN_INCOMING.OUTSTANDING_INCOMING),
      });
    }
  }, [details, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Card tetap tampil setelah binning sukses (partialQty di-reset 0 backend,
  // binningDate terisi) — kartu selesai tampil hijau (styles.completed),
  // hanya material yang tak pernah diproses (partialQty 0 & belum binning) yang tidak jadi card
  const rows = useMemo(
    () =>
      details.filter(
        (d) => (d.partialQty ?? 0) !== 0 || (d.binningQty ?? 0) > 0,
      ),
    [details],
  );

  // Selesai = semua qty ter-binning (parity ready-check backend poQty=binningQty),
  // bukan sekadar pernah binning (binning parsial masih proses lanjutan)
  const isDone = (d: OutstandingIncomingDetail) =>
    (d.binningQty ?? 0) >= (d.poQty ?? 0) || doneIds.has(d.id);

  const scannable = (d: OutstandingIncomingDetail) =>
    !isDone(d) && (d.partialQty ?? 0) > 0;

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (d) =>
        d.materialCode?.toLowerCase().includes(q) ||
        d.materialName?.toLowerCase().includes(q),
    );
  }, [rows, filter]);

  const doneCount = filtered.filter(isDone).length;

  // Parity legacy: setelah selesai, fokus ke input material card berikutnya
  const focusNextMaterial = (currentId: string) => {
    const idx = filtered.findIndex((d) => d.id === currentId);
    const next =
      filtered.slice(idx + 1).find(scannable) ?? filtered.find(scannable);
    if (next) materialRefs.current[next.id]?.focus();
  };

  // Langkah 1 — scan/validasi barcode material ("0" = bypass, parity legacy callApi).
  // code eksplisit dipakai saat berasal dari tombol search / kamera.
  const onMaterialScan = (d: OutstandingIncomingDetail) => (code?: string) => {
    // Kartu biru "partial nyangkut": partialQty 0 & belum selesai → blokir scan,
    // harus Adjust Qty dulu (parity validasi noPartial halaman list)
    if (!isDone(d) && (d.partialQty ?? 0) <= 0) {
      message.error(t("noPartial"));
      materialRefs.current[d.id]?.focus();
      return;
    }
    const c = (code ?? matVal[d.id] ?? "").trim();
    if (!c) {
      // parity legacy btnSearchMaterialBarcode: kosong → warning + focus
      message.warning(t("fillMaterialBarcode"));
      materialRefs.current[d.id]?.focus();
      return;
    }
    if (c === "0" || c === d.materialBarcode) {
      setMatOkIds((prev) => new Set(prev).add(d.id));
      setMatErrIds((prev) => {
        const next = new Set(prev);
        next.delete(d.id);
        return next;
      });
      // tunggu input lokasi ter-enable oleh re-render sebelum focus
      setTimeout(() => locationRefs.current[d.id]?.focus(), 0);
    } else {
      message.error(t("invalidMaterialBarcode"));
      // parity legacy is-invalid: merah lembut + clear + focus
      setMatErrIds((prev) => new Set(prev).add(d.id));
      setMatVal((prev) => ({ ...prev, [d.id]: "" }));
      materialRefs.current[d.id]?.focus();
    }
  };

  // Langkah 2 — scan/validasi barcode lokasi: valid = auto-submit binning (parity legacy)
  const onLocationScan =
    (d: OutstandingIncomingDetail) => async (code?: string) => {
      // anti double-submit: saat submit card ini berjalan, abaikan scan/klik baru
      if (busyId) return;
      const c = (code ?? locVal[d.id] ?? "").trim();
      if (!c) {
        // parity legacy btnSearchLocationBarcode: kosong → warning + focus
        message.warning(t("fillLocationBarcode"));
        locationRefs.current[d.id]?.focus();
        return;
      }
      if (c !== "0" && c !== (d.materialLocationBarcode ?? "")) {
        message.error(t("invalidLocationBarcode"));
        // parity legacy is-invalid: merah lembut + clear + focus
        setLocErrIds((prev) => new Set(prev).add(d.id));
        setLocVal((prev) => ({ ...prev, [d.id]: "" }));
        locationRefs.current[d.id]?.focus();
        return;
      }
      try {
        setBusyId(d.id); // loading: input/tombol card terkunci selama submit
        await OutstandingIncomingApi().binning(d.id, d.partialQty ?? 0);
        setDoneIds((prev) => new Set(prev).add(d.id));
        message.success(`${d.materialCode}: ${t("success")}`);
        focusNextMaterial(d.id);
      } catch (e: any) {
        message.error(e?.response?.data?.message ?? t("failed"));
      } finally {
        setBusyId(null);
        load();
      }
    };

  // --- Kamera scanner (ZXing client-side — parity zxing CoreApp, jalan di semua browser) ---
  const [camTarget, setCamTarget] = useState<{
    type: "material" | "location";
    d: OutstandingIncomingDetail;
  } | null>(null);
  const [scanMode, setScanMode] = useState<"camera" | "upload">("camera");
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // hasil scan (kamera/upload) → sama rutenya: validasi material/lokasi card
  const applyScanValue = (
    target: { type: "material" | "location"; d: OutstandingIncomingDetail },
    value: string,
  ) => {
    setCamTarget(null);
    if (target.type === "material") {
      setMatVal((prev) => ({ ...prev, [target.d.id]: value }));
      onMaterialScan(target.d)(value);
    } else {
      setLocVal((prev) => ({ ...prev, [target.d.id]: value }));
      onLocationScan(target.d)(value);
    }
  };

  // Upload gambar → decode ZXing di browser (parity btnUploadScan legacy)
  const closeScan = () => {
    setCamTarget(null);
    setUploadUrl(null);
    setScanMode("camera");
    setCamError(null);
  };
  // Upload gambar → decode ZXing multi-strategi (TRY_HARDER + multi-skala +
  // crop tengah + rotasi) — foto HP besar/miring sering gagal decode sekali jalan
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

  const onUploadImage = async (file: File) => {
    setUploadUrl(URL.createObjectURL(file)); // preview terpisah — url decode di-revoke sendiri
    setCamError(null);
    setDetecting(true);
    try {
      const value = await decodeImageFile(file);
      if (camTarget) applyScanValue(camTarget, value);
    } catch {
      setCamError(t("noBarcodeInImage"));
    } finally {
      setDetecting(false);
    }
  };

  useEffect(() => {
    if (!camTarget || scanMode !== "camera") return;
    let stopped = false;
    let controls: { stop: () => void } | null = null;
    let stream: MediaStream | null = null;
    (async () => {
      try {
        // getUserMedia hanya ada di secure context (HTTPS / localhost)
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("cameraInsecure");
        }
        // modal animasi → tunggu element video siap (maks ~1s), jangan gagal diam-diam
        let video = videoRef.current;
        for (let i = 0; !video && i < 20; i++) {
          await new Promise((r) => setTimeout(r, 50));
          video = videoRef.current;
        }
        if (!video) throw new Error("video not ready");
        const streamObj = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        stream = streamObj;
        if (stopped) {
          streamObj.getTracks().forEach((tr) => tr.stop());
          return;
        }
        video.srcObject = stream; // preview langsung tampil
        await video.play();
        const reader = new BrowserMultiFormatReader();
        controls = await reader.decodeFromStream(stream, video, (result) => {
          if (stopped || !result) return;
          const value = result.getText();
          stopped = true;
          controls?.stop();
          if (camTarget) applyScanValue(camTarget, value);
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
                  ? "kamera sedang dipakai proses lain"
                  : (e?.name ?? e?.message ?? "?");
        setCamError(String(cause));
        console.error("[binning-camera]", e);
      }
    })();
    return () => {
      stopped = true;
      controls?.stop(); // stop loop decode zxing
      // jaga-jaga modal ditutup sebelum decode siap: stop stream langsung
      stream?.getTracks().forEach((tr) => tr.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [camTarget, scanMode]);

  const complete = async (d: OutstandingIncomingDetail) => {
    setBusyId(d.id);
    try {
      await OutstandingIncomingApi().binning(d.id, d.partialQty ?? 0);
      setDoneIds((prev) => new Set(prev).add(d.id));
      message.success(`${d.materialCode}: ${t("success")}`);
      load(); // refresh binningDate dr server
    } catch (e: any) {
      message.error(e?.response?.data?.message ?? t("failed"));
    } finally {
      setBusyId(null);
    }
  };

  const binningAll = async () => {
    const items = rows.filter((d) => (d.partialQty ?? 0) > 0 && !isDone(d));
    if (items.length === 0) {
      message.info(t("allNothing"));
      return;
    }
    setAllLoading(true);
    const key = "binning-all";
    let ok = 0;
    // FR-007: sekuensial + laporan kegagalan per material (beserta alasan)
    const failed: string[] = [];
    for (const d of items) {
      message.open({
        key,
        type: "loading",
        content: `${t("processing")} ${ok + 1}/${items.length}: ${d.materialCode}`,
      });
      try {
        await OutstandingIncomingApi().binning(d.id, d.partialQty ?? 0);
        setDoneIds((prev) => new Set(prev).add(d.id));
        ok++;
      } catch (e: any) {
        failed.push(
          `${d.materialCode}: ${e?.response?.data?.message ?? t("failed")}`,
        );
      }
    }
    message.open({
      key,
      type: failed.length ? "warning" : "success",
      content: failed.length
        ? `${t("allDone", { count: ok })}. ${t("allFailed")}: ${failed.join("; ")}`
        : t("allDone", { count: ok }),
      duration: failed.length ? 10 : 3,
    });
    setAllLoading(false);
    load();
  };

  /* Step bar ala legacy: Material → Location → Selesai (selesai = semua aktif) */
  const BinningStep = ({
    active,
    icon,
    label,
  }: {
    active: boolean;
    icon: React.ReactNode;
    label: string;
  }) => (
    <div className={`${styles.step} ${active ? styles.active : ""}`.trim()}>
      <div className={styles.circle}>{icon}</div>
      <div className={styles["step-label"]}>{label}</div>
    </div>
  );

  return (
    <>
      {/* Toolbar parity legacy: aksi kiri + search pill besar DI TENGAH ala CoreApp */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          margin: "28px 0 20px",
        }}
      >
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => setSlipOpen(true)}
        >
          {t("printSlip")}
        </Button>
        <Button
          icon={<CheckSquareOutlined />}
          loading={allLoading}
          onClick={binningAll}
        >
          {t("binningAll")}
        </Button>

        <div
          className={styles["binning-search"]}
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            minWidth: 260,
          }}
        >
          <Space.Compact style={{ width: "100%", maxWidth: 560 }}>
            <Input
              size="large"
              prefix={<SearchOutlined style={{ color: "#9aa4b2" }} />}
              suffix={
                filter ? (
                  <Button
                    type="text"
                    size="small"
                    shape="circle"
                    icon={
                      <CloseCircleOutlined
                        style={{ color: "#faad14", fontSize: 18 }}
                      />
                    }
                    onClick={() => {
                      setFilter("");
                      setSearchVal("");
                    }}
                  />
                ) : undefined
              }
              placeholder={t("filterPlaceholder")}
              value={searchVal}
              disabled={!!filter}
              onChange={(e) => setSearchVal(e.target.value)}
              onPressEnter={() => {
                if (searchVal.trim().length > 3) setFilter(searchVal);
              }}
            />
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              disabled={!!filter || searchVal.trim().length < 4}
              onClick={() => setFilter(searchVal)}
            />
          </Space.Compact>
        </div>

        {/* Progress real (turunan state, parity picking): operator lihat sisa kerja */}
        {filtered.length > 0 && (
          <div className={styles["pick-progress"]}>
            <span className={styles["pick-progress-count"]}>
              {t("binnedCount", { done: doneCount, total: filtered.length })}
            </span>
            <span className={styles["pick-progress-track"]}>
              <span
                className={styles["pick-progress-fill"]}
                style={{
                  transform: `scaleX(${doneCount / filtered.length})`,
                }}
              />
            </span>
          </div>
        )}
      </div>

      <Spin spinning={loading}>
        {rows.length === 0 && !loading ? (
          <Alert type="error" showIcon message={t("noPartial")} />
        ) : filtered.length === 0 ? (
          <Alert type="info" showIcon message={t("filteredEmpty")} />
        ) : (
          <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
            {filtered.map((d) => {
              const done = isDone(d);
              const matOk = matOkIds.has(d.id);
              // Partial "nyangkut": sudah pernah di-binning (belum full) tapi
              // tidak ada qty ter-stage (partialQty = 0) → varian biru, perlu
              // Adjust Qty dulu. partialQty > 0 = siap dikerjakan → putih.
              const partial =
                !done && (d.partialQty ?? 0) === 0 && (d.binningQty ?? 0) > 0;
              return (
                <Col xs={24} sm={12} xl={6} key={d.id}>
                  <div
                    className={`${styles["binning-card"]} ${done ? styles.completed : partial ? styles.partial : ""}`.trim()}
                  >
                    {/* Ornamen scan-arc — echo motif viewfinder kamera (parity
                        picking): dekoratif, di bawah konten. */}
                    <svg
                      className={styles["card-ornament"]}
                      viewBox="0 0 140 140"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <circle
                        cx="140"
                        cy="0"
                        r="36"
                        stroke="currentColor"
                        strokeOpacity="0.16"
                        strokeWidth="1"
                      />
                      <circle
                        cx="140"
                        cy="0"
                        r="60"
                        stroke="currentColor"
                        strokeOpacity="0.12"
                        strokeWidth="1"
                      />
                      <circle
                        cx="140"
                        cy="0"
                        r="84"
                        stroke="currentColor"
                        strokeOpacity="0.08"
                        strokeWidth="1"
                      />
                      <circle
                        cx="140"
                        cy="0"
                        r="108"
                        stroke="currentColor"
                        strokeOpacity="0.06"
                        strokeWidth="1"
                      />
                      <circle
                        cx="129.6"
                        cy="59.1"
                        r="2"
                        fill="currentColor"
                        fillOpacity="0.2"
                      />
                      <circle
                        cx="105.6"
                        cy="49.1"
                        r="2"
                        fill="currentColor"
                        fillOpacity="0.2"
                      />
                      <circle
                        cx="88"
                        cy="30"
                        r="2"
                        fill="currentColor"
                        fillOpacity="0.2"
                      />
                      <circle
                        cx="75.7"
                        cy="54"
                        r="2.5"
                        fill="currentColor"
                        fillOpacity="0.25"
                      />
                    </svg>
                    {/* Klaster cermin kiri-bawah — keseimbangan diagonal */}
                    <svg
                      className={styles["card-ornament-bl"]}
                      viewBox="0 0 120 120"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <circle
                        cx="0"
                        cy="120"
                        r="44"
                        stroke="currentColor"
                        strokeOpacity="0.08"
                        strokeWidth="1"
                      />
                      <circle
                        cx="0"
                        cy="120"
                        r="72"
                        stroke="currentColor"
                        strokeOpacity="0.06"
                        strokeWidth="1"
                      />
                      <circle
                        cx="31.1"
                        cy="88.9"
                        r="1.8"
                        fill="currentColor"
                        fillOpacity="0.16"
                      />
                      <circle
                        cx="42.5"
                        cy="108.6"
                        r="1.8"
                        fill="currentColor"
                        fillOpacity="0.16"
                      />
                      <circle
                        cx="22"
                        cy="81.9"
                        r="1.8"
                        fill="currentColor"
                        fillOpacity="0.16"
                      />
                    </svg>
                    <div className={styles["step-bar"]}>
                      {/* Material: menyala sejak awal & TETAP menyala setelah scan sukses */}
                      <BinningStep
                        active
                        icon={<BarcodeOutlined />}
                        label={t("stepMaterial")}
                      />
                      <div
                        className={`${styles.bar} ${done || matOk ? styles.active : ""}`.trim()}
                      />
                      <BinningStep
                        active={done || matOk}
                        icon={<AimOutlined />}
                        label={t("stepLocation")}
                      />
                      <div
                        className={`${styles.bar} ${done ? styles.active : ""}`.trim()}
                      />
                      <BinningStep
                        active={done}
                        icon={<CheckOutlined />}
                        label={t("stepDone")}
                      />
                    </div>
                    <div className={styles["card-head"]}>
                      <div className={styles["card-head-main"]}>
                        <div
                          className={styles["card-head-title"]}
                          title={d.materialName}
                        >
                          {d.materialName}
                        </div>
                        <div className={styles["card-head-code"]}>
                          {t("materialCode")}:{" "}
                          <span className={styles["card-code-value"]}>
                            {d.materialCode}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Partial (akan di-binning) di depan, binned qty di
                        sampingnya — parity pola qty picking; detail via popover */}
                    <Row gutter={8}>
                      <Col span={12}>
                        <label>{t("partialQty")}</label>
                        <Input
                          disabled
                          className={done ? styles["scan-ok"] : undefined}
                          value={d.partialQty ?? 0}
                        />
                      </Col>
                      <Col span={12}>
                        <label>{t("binningQty")}</label>
                        <Space.Compact style={{ width: "100%" }}>
                          <Input
                            disabled
                            className={done ? styles["scan-ok"] : undefined}
                            value={d.binningQty ?? 0}
                          />
                          <Popover
                            trigger="click"
                            placement="left"
                            overlayStyle={{ maxWidth: "70vw" }}
                            content={
                              <div style={{ minWidth: 160 }}>
                                <div>
                                  {t("poQty")}: <b>{d.poQty ?? 0}</b>
                                </div>
                                <div>
                                  {t("remaining")}:{" "}
                                  <b>{(d.poQty ?? 0) - (d.binningQty ?? 0)}</b>
                                </div>
                              </div>
                            }
                          >
                            <Button icon={<InfoCircleOutlined />} />
                          </Popover>
                        </Space.Compact>
                      </Col>
                    </Row>
                    <label>{t("materialBarcode")}</label>
                    {/* Parity legacy: tombol disembunyikan setelah material tervalidasi;
                        kartu biru (partial nyangkut) → input kunci, aksi = Adjust Qty */}
                    {matOk || done || partial ? (
                      <Input
                        disabled
                        className={
                          matOk || done ? styles["scan-ok"] : undefined
                        }
                        value={matVal[d.id] || d.materialBarcode || "-"}
                      />
                    ) : (
                      <Space.Compact style={{ width: "100%" }}>
                        <Input
                          ref={(el) => {
                            materialRefs.current[d.id] = el;
                          }}
                          placeholder={t("scanMaterial")}
                          className={
                            matErrIds.has(d.id) ? styles["scan-err"] : undefined
                          }
                          value={matVal[d.id] ?? ""}
                          disabled={allLoading}
                          onChange={(e) => {
                            setMatVal((prev) => ({
                              ...prev,
                              [d.id]: e.target.value,
                            }));
                            // ketik ulang → hapus merah
                            setMatErrIds((prev) => {
                              if (!prev.has(d.id)) return prev;
                              const next = new Set(prev);
                              next.delete(d.id);
                              return next;
                            });
                          }}
                          onPressEnter={() => onMaterialScan(d)()}
                        />
                        <Button
                          type="primary"
                          className={styles["btn-scan-search"]}
                          icon={<SearchOutlined />}
                          disabled={allLoading}
                          onClick={() => onMaterialScan(d)()}
                        />
                        <Button
                          type="primary"
                          className={styles["btn-scan-camera"]}
                          icon={<CameraOutlined />}
                          disabled={allLoading}
                          onClick={() => {
                            setCamError(null);
                            setScanMode("camera");
                            setUploadUrl(null);
                            setCamTarget({ type: "material", d });
                          }}
                        />
                      </Space.Compact>
                    )}
                    <label>{t("locationBarcode")}</label>
                    {/* Parity legacy: tombol lokasi baru muncul setelah material valid */}
                    {!matOk || done ? (
                      <Input
                        disabled
                        className={done ? styles["scan-ok"] : undefined}
                        value={locVal[d.id] || d.materialLocationBarcode || "-"}
                        placeholder={
                          !done && !d.materialLocationBarcode
                            ? t("scanLocation")
                            : undefined
                        }
                      />
                    ) : (
                      <Space.Compact style={{ width: "100%" }}>
                        <Input
                          ref={(el) => {
                            locationRefs.current[d.id] = el;
                          }}
                          placeholder={t("scanLocation")}
                          className={
                            locErrIds.has(d.id) ? styles["scan-err"] : undefined
                          }
                          value={locVal[d.id] ?? ""}
                          disabled={allLoading || busyId === d.id}
                          onChange={(e) => {
                            setLocVal((prev) => ({
                              ...prev,
                              [d.id]: e.target.value,
                            }));
                            // ketik ulang → hapus merah
                            setLocErrIds((prev) => {
                              if (!prev.has(d.id)) return prev;
                              const next = new Set(prev);
                              next.delete(d.id);
                              return next;
                            });
                          }}
                          onPressEnter={() => onLocationScan(d)()}
                        />
                        <Button
                          type="primary"
                          className={styles["btn-scan-search"]}
                          icon={<SearchOutlined />}
                          disabled={allLoading || busyId === d.id}
                          onClick={() => onLocationScan(d)()}
                        />
                        <Button
                          type="primary"
                          className={styles["btn-scan-camera"]}
                          icon={<CameraOutlined />}
                          disabled={allLoading || busyId === d.id}
                          onClick={() => {
                            setCamError(null);
                            setScanMode("camera");
                            setUploadUrl(null);
                            setCamTarget({ type: "location", d });
                          }}
                        />
                      </Space.Compact>
                    )}
                    {done ? (
                      <div className={styles["card-done"]}>
                        <span className={styles["card-done-pill"]}>
                          <CheckCircleOutlined style={{ fontSize: 13 }} />
                          {t("completed")}
                        </span>
                      </div>
                    ) : partial ? (
                      /* Seal biru: info sisa qty — partial qty di-stage via
                         Quality Inspection (dari halaman list) */
                      <div className={styles["card-partial"]}>
                        <span className={styles["card-partial-pill"]}>
                          <InfoCircleOutlined style={{ fontSize: 13 }} />
                          {t("waitingQi", {
                            count: (d.poQty ?? 0) - (d.binningQty ?? 0),
                          })}
                        </span>
                      </div>
                    ) : (
                      <Button
                        block
                        type="primary"
                        loading={busyId === d.id}
                        disabled={allLoading || (d.partialQty ?? 0) <= 0}
                        onClick={() => complete(d)}
                        style={{ marginTop: 12 }}
                      >
                        {/* Bypass scan — setara klik step Completed legacy */}
                        {t("complete")}
                      </Button>
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      </Spin>

      <BinningSlipForm
        open={slipOpen}
        headerId={id ? String(id) : null}
        onClose={() => setSlipOpen(false)}
      />

      {/* Scan screen fullscreen — gaya DANA/m-BCA: viewfinder + brackets + garis sapuan */}
      <Modal
        open={!!camTarget}
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
              {camTarget?.type === "material"
                ? t("scanMaterial")
                : t("scanLocation")}
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
                document.getElementById("binning-scan-upload")?.click()
              }
              style={{ borderRadius: 999, minWidth: 190 }}
            >
              {t("uploadMode")}
            </Button>
          </div>

          {detecting && (
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
              <span style={{ marginLeft: 10 }}>{t("detecting")}</span>
            </div>
          )}

          <input
            id="binning-scan-upload"
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

export default BinningPage;
