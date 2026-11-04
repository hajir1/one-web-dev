// Loaded before every test file (see the "test" script in package.json):
// tests use the full text, not just the "core" part shipped in the initial bundle.
import { ensureFullLocale } from "./i18n";

await ensureFullLocale("id");
