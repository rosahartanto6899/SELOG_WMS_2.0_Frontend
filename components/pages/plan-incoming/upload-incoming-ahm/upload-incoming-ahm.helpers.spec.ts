import { validateHeaderConsistency } from "./upload-incoming-ahm.helpers";

const row = (over: Record<string, unknown>) =>
  ({
    deliveryNoteNo: "AHMRF/22/002325",
    deliveryNoteDate: "2022-11-07",
    deliveryNoteStatus: "Printed",
    deliveryNoteType: "EXPORT",
    poNumber: "4700628176",
    plantId: "1800",
    plantDesc: "Plant KRW EXT 1",
    gateId: "P8P1",
    supplierId: "1100073",
    supplierDesc: "PT ASTRA VISTEON INDONESIA",
    ...over,
  }) as any;

describe("validateHeaderConsistency — satu DN = satu header", () => {
  it("lolos jika header DN sama identik (field detail bebas beda)", () => {
    const errors = validateHeaderConsistency([
      row({ supplierPartNumber: "A", qtyDn: 10 }),
      row({ supplierPartNumber: "B", qtyDn: 20 }),
    ]);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("flag sel header yang beda pada baris berikutnya", () => {
    const errors = validateHeaderConsistency([
      row({}),
      row({ gateId: "P9P2", poNumber: "999" }),
    ]);
    expect(errors["1-gateId"]).toBe("mismatch");
    expect(errors["1-poNumber"]).toBe("mismatch");
    expect(errors["1-deliveryNoteDate"]).toBeUndefined();
  });

  it("DN berbeda tidak saling dibandingkan", () => {
    const errors = validateHeaderConsistency([
      row({}),
      row({ deliveryNoteNo: "OTHER/1", gateId: "X1" }),
    ]);
    expect(Object.keys(errors)).toHaveLength(0);
  });
});
