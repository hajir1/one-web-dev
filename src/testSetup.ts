// Dimuat sebelum setiap berkas test (lihat skrip "test" di package.json):
// test memakai teks lengkap, bukan hanya bagian "core" yang ikut bundle awal.
import { ensureFullLocale } from "./i18n";

await ensureFullLocale("id");
