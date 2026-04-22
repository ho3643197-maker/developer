# Catatan Proyek: PropDev ERP Pro 🏢

Dokumen ini berisi ringkasan teknis dan fungsional dari aplikasi **PropDev ERP Pro**, sebuah sistem ERP komprehensif untuk pengembang properti.

## 🚀 Ringkasan Proyek
Aplikasi ini dirancang untuk mengelola seluruh aspek bisnis properti, mulai dari pemasaran, teknik, keuangan, hingga audit dan HRD.

- **Status Saat Ini**: Pengembangan Aktif
- **Server Dev**: http://localhost:80/
- **Backend**: Supabase (PostgreSQL, Auth, Storage)

## 🛠️ Prinsip Kerja & Workflow
Berdasarkan instruksi terbaru, pengembangan mengikuti protokol berikut:
1.  **AI Expert Persona**: Bertindak sebagai pakar dengan pengalaman 10+ tahun.
2.  **Kerja Per Modul**: Fokus pada satu modul secara eksklusif tanpa memodifikasi modul lain yang tidak terkait.
3.  **Isolasi Data**: Sistem dan data bekerja secara ketat sesuai dengan cabang (branch/division) masing-masing.
4.  **Format Berpikir**: Analisa -> Masalah Utama -> Solusi Bertahap -> Tips.

## 📦 Daftar Modul Utama
- **Teknik/Proyek**: RAB, Progress, Material, PO.
- **Pemasaran**: Leads, Sales, Payments, Promos.
- **Keuangan/Akuntansi**: Cash Flow, Journal, Ledger, Taxation, Payroll.
- **HRD**: Attendance, Employees, Recruitment.
- **Audit**: Stock Audit, Cost Audit, Transaction Audit.

## 🗄️ Struktur Database Utama
(Berdasarkan `supabase_init.sql`)
- `profiles` (Role: admin, marketing, owner, teknik, keuangan, audit, hrd, accounting)
- `projects`, `units`, `customers`, `sales`, `installments`, `payments`.

---
*Terakhir diperbarui: 21 April 2026*
