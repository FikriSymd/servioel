import type { KeyboardCoordinateGetter } from "@dnd-kit/core";
import { STAGES } from "@/lib/stages";

/**
 * Pengganti penggerak koordinat bawaan dnd-kit untuk jalur keyboard.
 *
 * Bawaan dnd-kit menggeser 25px tiap panah, jadi memindahkan satu kartu ke
 * kolom sebelah butuh sekitar dua belas kali panah. Itu sama saja tidak bisa
 * dipakai. Di sini satu panah kiri/kanan langsung melompat ke kolom sebelahnya,
 * karena kolomnya memang berurutan.
 */
export const keyboardPindahKolom: KeyboardCoordinateGetter = (event, { context }) => {
  const { collisionRect, droppableRects, droppableContainers } = context;
  const kode = event.code;
  if (!collisionRect) return undefined;
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(kode)) {
    return undefined;
  }

  const kolom = STAGES.map((s) => ({ id: s.id, rect: droppableRects.get(s.id) }))
    .filter((k) => k.rect && droppableContainers.get(k.id))
    .map((k) => ({ id: k.id, rect: k.rect! }));

  if (kolom.length === 0) return undefined;

  const tengahKartu = collisionRect.left + collisionRect.width / 2;
  let sekarang = 0;
  let jarakTerdekat = Infinity;
  kolom.forEach((k, i) => {
    const tengahKolom = k.rect.left + k.rect.width / 2;
    const jarak = Math.abs(tengahKolom - tengahKartu);
    if (jarak < jarakTerdekat) {
      jarakTerdekat = jarak;
      sekarang = i;
    }
  });

  let tujuan = sekarang;
  if (kode === "ArrowRight") tujuan = Math.min(kolom.length - 1, sekarang + 1);
  if (kode === "ArrowLeft") tujuan = Math.max(0, sekarang - 1);

  const r = kolom[tujuan].rect;
  return {
    x: r.left + r.width / 2 - collisionRect.width / 2,
    y: r.top + r.height / 2 - collisionRect.height / 2,
  };
};
