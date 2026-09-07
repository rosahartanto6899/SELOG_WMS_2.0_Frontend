# Registrasi Menu: Input Plan Outgoing (003)

MenuCode service: `OUTSTANDING-OUTGOING` (permissions READ/CREATE/UPDATE dipakai
controller `OutgoingOutgoingController`).

## Langkah (ServiceUser, UI menu-configuration existing)

1. Login sebagai Super Admin → User Management → Menu Configuration.
2. Tambah menu:
   - Name: `Input Plan Outgoing`
   - Path: `/plan-outgoing/input-outgoing`
   - Parent: grup "Plan Outgoing" (buat jika belum ada)
3. Tambah permission untuk menu `OUTSTANDING-OUTGOING`:
   - `READ` (akses halaman + C6 edit data)
   - `CREATE` (C1 create, C2 add detail)
   - `UPDATE` (C3/C4 edit)
4. Assign menu + permission ke role yang berhak (mis. role gudang).
5. Verifikasi: user role tersebut login → menu muncul → halaman terbuka;
   tanpa permission → 403 dari service outgoing.

Catatan: menuCode OUTSTANDING-OUTGOING dipakai bersama untuk fitur list
outstanding outgoing berikutnya (parity OUTSTANDING-INCOMING yang satu menuCode
untuk seluruh aksi fitur incoming).
