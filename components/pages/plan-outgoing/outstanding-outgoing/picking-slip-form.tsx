/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import CustomerApi from "@sera-libraries/api/customer";
import OutstandingOutgoingApi from "@sera-libraries/api/outstanding-outgoing";
import { useEffect } from "react";

interface Props {
  open: boolean;
  headerId: string | null;
  onClose: () => void;
}

/** Picking slip print — headless (tanpa popup): saat open, fetch Q15 lalu buka
 *  dokumen print tab baru. Layout parity legacy PickingSlip
 *  (PlanOutgoingController.cs): logo + judul biru #003399, header PT
 *  SerasiLogistics, section CUSTOMER, tabel 8 kolom, 4 kotak tanda tangan,
 *  catatan kaki. */
const PickingSlipForm = ({ open, headerId, onClose }: Props) => {
  useEffect(() => {
    if (!open || !headerId) return;

    const print = async () => {
      let rows: any[] = [];
      try {
        rows =
          (await OutstandingOutgoingApi().retrievePickingSlip(headerId)) ?? [];
      } catch {
        onClose();
        return;
      }
      const first = rows[0];

      /** Alamat customer (best effort, parity GetMstCustomerByCustomerCode). */
      let cust: any = null;
      try {
        const res: any = await CustomerApi().retrieveCustomers({
          page: 1,
          limit: 1,
          search: first?.customerCode,
          searchBy: "code",
        });
        cust = res?.data?.data?.[0] ?? null;
      } catch {
        cust = null;
      }
      const customerName = cust?.name ?? first?.customerName ?? "";
      const customerAddress = cust?.address ?? "";

      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
      const totalQty = rows.reduce((sum, r) => sum + (Number(r.qty) || 0), 0);

      const itemRows = rows
        .map(
          (r, i) =>
            `<tr><td class="c">${i + 1}</td><td>${r.materialCode ?? ""}</td>` +
            `<td>${r.materialName ?? ""}</td><td>${r.brand ?? ""}</td>` +
            `<td class="c">${r.qty ?? ""}</td><td class="c">${r.satuan ?? ""}</td>` +
            `<td>${r.loc ?? ""}</td><td>${r.description ?? ""}</td></tr>`,
        )
        .join("");

      const win = window.open();
      if (!win) {
        onClose();
        return;
      }
      win.document.write(`<!DOCTYPE html><html><head><title>PICKING SLIP</title>
<style>
  @page { size: A4 portrait; margin: 12mm; }
  body { font: 10px/1.4 Helvetica, Arial, sans-serif; color: #000; margin: 0; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; }
  .head img { height: 65px; }
  .head h1 { font-size: 24px; text-align: right; margin: 0; color: #003399; }
  .hdr { display: flex; justify-content: space-between; margin: 8px 0; }
  .hdr .right { text-align: right; }
  .cust-label { display: inline-block; width: 50%; box-sizing: border-box;
    background: #003399; color: #fff; font-weight: bold; padding: 5px 10px;
    -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .cust { display: flex; justify-content: space-between; margin: 4px 0; }
  .cust .right { text-align: right; }
  table { border-collapse: collapse; width: 100%; }
  .item { margin: 8px 0; }
  .item th, .item td { border: 1px solid #000; padding: 3px 4px; text-align: left; }
  .item th { font-weight: bold; text-align: center; }
  .c { text-align: center; }
  .foot td { border: 1px solid #000; padding: 10px 6px; text-align: center;
    width: 25%; vertical-align: top; }
  .foot .gap { height: 56px; }
  .note { margin-top: 12px; }
</style></head><body>
<div class="head">
  <img src="/img/selognew.png" alt="SELOG"/>
  <h1>PICKING SLIP</h1>
</div>
<div class="hdr">
  <div>PT SERASILOGISTICS INDONESIA<br/>Jl Pontianak Blok C2-01<br/>KBN Marunda, Jakarta Utara 14120 (021-4614450)</div>
  <div class="right">Date: ${date}<br/>PO No: ${first?.poNo ?? ""}<br/>Reference No: ${first?.referenceNo ?? ""}</div>
</div>
<span class="cust-label">CUSTOMER</span>
<div class="cust">
  <div><strong>${customerName}</strong><br/>${customerAddress}</div>
  <div class="right">Total : ${totalQty} Items</div>
</div>
<table class="item">
  <thead><tr><th>No</th><th>Material Code</th><th>Material Name</th>
    <th>Material Brand</th><th>Qty</th><th>UoM</th><th>Loc</th><th>Desc</th></tr></thead>
  <tbody>${itemRows}</tbody>
</table>
<table class="foot">
  <tr>
    <td>Pick by:<div class="gap"></div>____________<br/><br/>Team Warehouse</td>
    <td>Check by:<div class="gap"></div>____________<br/><br/>Quality Inspection</td>
    <td>Mengetahui:<div class="gap"></div>____________<br/><br/>WHS Officer<br/>PT Serasi Logistics Indonesia</td>
    <td>Scan Here:<br/>To View All Items<div class="gap"></div>QR</td>
  </tr>
</table>
<div class="note">*Dokumentasi ini adalah Dokumen resmi pengeluaran barang<br/>*Harap melengkapi Dokumen dengan tanda tangan dan nama jelas</div>
<script>setTimeout(function(){window.print();},300);window.onafterprint=function(){window.close();};</script>
</body></html>`);
      win.document.close();
      onClose();
    };

    print();
  }, [open, headerId]);

  return null;
};

export default PickingSlipForm;
