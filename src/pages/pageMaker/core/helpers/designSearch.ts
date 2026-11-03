/** Cari desain berdasarkan nama: tanpa beda huruf besar/kecil & aksen, semua kata harus cocok. */
export function filterDesigns<T extends { name: string }>(designs: T[], query: string): T[] {
  const norm = (v: string) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return designs;
  return designs.filter((d) => {
    const n = norm(d.name);
    return words.every((w) => n.includes(w));
  });
}
