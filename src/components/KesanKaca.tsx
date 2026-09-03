'use client';

import { useEffect } from 'react';

/**
 * Dua kesan kecil yang menjadikan permukaan terasa seperti kaca sebenar.
 *
 *  1. Sheen yang mengikut kursor pada mana-mana elemen `.kilau`. Satu pendengar
 *     sahaja untuk seluruh halaman, didikit oleh requestAnimationFrame, dan
 *     hanya dipasang pada peranti dengan penuding tepat.
 *  2. Pengepala menjadi lebih pekat sebaik pengguna mula menatal, supaya teks
 *     yang lalu di belakangnya tidak menembusi.
 *
 * Kedua-duanya hiasan sahaja — halaman berfungsi sepenuhnya tanpa JavaScript.
 */
export function KesanKaca() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.header');
    let rafTatal = 0;

    function kemasTatal() {
      rafTatal = 0;
      header?.setAttribute('data-tebal', window.scrollY > 8 ? 'ya' : 'tidak');
    }

    function padaTatal() {
      if (!rafTatal) rafTatal = requestAnimationFrame(kemasTatal);
    }

    kemasTatal();
    window.addEventListener('scroll', padaTatal, { passive: true });

    const penudingTepat = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let rafKilau = 0;
    let seterusnya: { el: HTMLElement; x: number; y: number } | null = null;

    function pakaiKilau() {
      rafKilau = 0;
      if (!seterusnya) return;
      seterusnya.el.style.setProperty('--sx', `${seterusnya.x}%`);
      seterusnya.el.style.setProperty('--sy', `${seterusnya.y}%`);
    }

    function padaGerak(event: PointerEvent) {
      const sasaran = event.target instanceof Element ? event.target.closest<HTMLElement>('.kilau') : null;
      if (!sasaran) return;
      const kotak = sasaran.getBoundingClientRect();
      seterusnya = {
        el: sasaran,
        x: ((event.clientX - kotak.left) / kotak.width) * 100,
        y: ((event.clientY - kotak.top) / kotak.height) * 100,
      };
      if (!rafKilau) rafKilau = requestAnimationFrame(pakaiKilau);
    }

    if (penudingTepat) {
      window.addEventListener('pointermove', padaGerak, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', padaTatal);
      window.removeEventListener('pointermove', padaGerak);
      if (rafTatal) cancelAnimationFrame(rafTatal);
      if (rafKilau) cancelAnimationFrame(rafKilau);
    };
  }, []);

  return null;
}
