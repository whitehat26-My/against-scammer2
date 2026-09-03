/**
 * Latar belakang: grid halus dengan satu jalur cahaya yang menyapu perlahan.
 *
 * Ia memberi permukaan kaca sesuatu untuk dipantulkan. Semuanya CSS —
 * jalur cahaya menganimasikan `transform` sahaja, jadi ia kekal pada thread
 * komposit dan tidak menyebabkan cat semula.
 */
export function LatarBelakang() {
  return (
    <div className="latar" aria-hidden="true">
      <div className="latar__grid" />
      <div className="latar__sapu" />
    </div>
  );
}
