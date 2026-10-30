# Konfigurasi Resmi & Template AI Assistant (Antigravity, Cursor, Copilot, Claude)

Repositori **Mirai No Webu** mendukung integrasi penuh dengan berbagai *AI Coding Agent* dan asisten pemrograman modern. Untuk memastikan efisiensi token, kecepatan respons, dan kepatuhan terhadap standar desain, berkas konfigurasi telah diorganisir sesuai dokumentasi resmi masing-masing platform:

---

## 📍 Penempatan Resmi Konfigurasi AI di Workspace

| Platform AI | Berkas Konfigurasi Aktif | Lokasi Resmi di Repositori | Keterangan & Mekanisme Kerja |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini** | `panduan/agent.md`<br>`panduan/CONTEKAN-TAG.md` | Workspace Context | Antigravity secara native membaca berkas panduan dan cheatsheet tag langsung dari workspace sebagai *Single Source of Truth*. |
| **Cursor AI** | `.cursorrules` | Root (`/.cursorrules`) | Cursor membaca file `.cursorrules` di root direktori untuk memuat aturan otomatis setiap memulai obrolan/komposisi kode. File ini di-nest di bawah `.gitignore` di VS Code explorer. |
| **GitHub Copilot** | `copilot-instructions.md` | Root (`.github/copilot-instructions.md`) | Sesuai dokumentasi resmi GitHub, Copilot di VS Code dan GitHub.com membaca instruksi workspace dari folder `.github/`. |
| **Claude Code CLI** | `CLAUDE.md` / `agent.md` | `panduan/agent.md` | Claude Code CLI dapat diarahkan langsung membaca `panduan/agent.md` untuk konteks lengkap arsitektur. |

---

## 🗂️ Berkas Cadangan & Rujukan di Folder Ini (`panduan/ai-configs/`):

1. **`panduan/ai-configs/.cursorrules`**: Salinan rujukan template aturan untuk Cursor AI.
2. **`panduan/ai-configs/copilot-instructions.md`**: Salinan rujukan template aturan untuk GitHub Copilot.
3. **`panduan/ai-configs/README.md`**: Dokumentasi panduan ini.

> [!NOTE]
> Berkas aktif di root (`.cursorrules` dan `.github/copilot-instructions.md`) disinkronkan secara berkala dengan isi `panduan/agent.md` agar seluruh asisten AI bekerja dengan instruksi arsitektur yang seragam dan mutakhir.
