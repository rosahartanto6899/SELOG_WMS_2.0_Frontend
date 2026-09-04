import * as XLSX from "xlsx";

import {
  HEADER_KEYS,
  MAX_ROWS,
  parseRows,
  validateRefMembership,
  validateWorkbookIntegrity,
} from "./material-mapping.helpers";

/** Build a mock workbook with the template structure (Formulir input + Ref sheets). */
function buildWorkbook(opts?: {
  headers?: string[];
  rows?: (string | number)[][];
  refMaterial?: string[][];
  refLocation?: string[][];
}) {
  const wb = XLSX.utils.book_new();

  const main: (string | number)[][] = [
    ["MANDATORY READ"],
    ["instruksi 1"],
    ["instruksi 2"],
    [],
    opts?.headers ?? [
      "Material Code",
      "Material Name",
      "Material Brand",
      "Location Name",
    ],
    ...(opts?.rows ?? [["M-001", "Bearing 6204", "SKF", "Bin A-01"]]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(main),
    "Formulir input",
  );

  const bodyKey = [
    ["name", "id"],
    ["Material Code", "materialCode"],
    ["Material Name", "materialName"],
    ["Material Brand", "materialBrand"],
    ["Location Name", "locationName"],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(bodyKey),
    "Ref_bodyKey",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      ["name", "id"],
      ...(opts?.refMaterial ?? [
        ["M-001", "uuid-m1"],
        ["M-002", "uuid-m2"],
      ]),
    ]),
    "Ref_material",
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([
      ["name", "id"],
      ...(opts?.refLocation ?? [
        ["Bin A-01", "uuid-l1"],
        ["Bin A-02", "uuid-l2"],
      ]),
    ]),
    "Ref_location",
  );
  return wb;
}

describe("material-mapping helpers", () => {
  it("HEADER_KEYS identik 4 key backend", () => {
    expect([...HEADER_KEYS]).toEqual([
      "materialCode",
      "materialName",
      "materialBrand",
      "locationName",
    ]);
    expect(MAX_ROWS).toBe(25000);
  });

  it("validateWorkbookIntegrity lolos untuk template valid", () => {
    expect(validateWorkbookIntegrity(buildWorkbook())).toBeNull();
  });

  it("validateWorkbookIntegrity menolak template tanpa Ref_bodyKey", () => {
    const wb = buildWorkbook();
    delete wb.Sheets["Ref_bodyKey"];
    expect(validateWorkbookIntegrity(wb)).toBe("message.import");
  });

  it("parseRows memetakan label→key dan lolos tanpa error", () => {
    const errors: string[] = [];
    const rows = parseRows(buildWorkbook(), (i, k, m) =>
      errors.push(`${i}-${k}-${m}`),
    );
    expect(errors).toHaveLength(0);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      materialCode: "M-001",
      locationName: "Bin A-01",
      upsertStatus: "pending",
    });
  });

  it("parseRows menandai kolom wajib kosong + nilai di luar ref", () => {
    const errors: Record<string, string> = {};
    parseRows(
      buildWorkbook({
        rows: [
          ["", "Bearing", "SKF", "Bin Z-99"], // empty material + location not in ref
          ["M-002", "Oil Seal", "NGK", ""], // location kosong
        ],
      }),
      (i, k, m) => {
        errors[`${i}-${k}`] = m;
      },
    );
    expect(errors["0-materialCode"]).toBe("required");
    expect(errors["0-locationName"]).toBe("notFound");
    expect(errors["1-locationName"]).toBe("required");
  });

  it("validateRefMembership — string match terhadap kolom name", () => {
    const refs = [{ name: "M-001" }, { name: "M-002" }];
    expect(validateRefMembership("M-001", refs)).toBe(true);
    expect(validateRefMembership("M-XXX", refs)).toBe(false);
  });
});
