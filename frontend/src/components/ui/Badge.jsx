const VARIANTS = {
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  neutral: 'bg-gray-100 text-gray-600 border-gray-200',
  primary: 'bg-primary-light text-primary-dark border-primary/20',
};

/**
 * Label kecil bergaya pill — dipakai untuk "Segar", "Stok: Tersedia",
 * status pesanan ("Selesai", "Sedang Diproses"), dll.
 *
 * Contoh pakai:
 *   <Badge variant="primary">Segar</Badge>
 *   <Badge variant="success">Selesai</Badge>
 *   <Badge variant="warning">Menunggu Konfirmasi</Badge>
 */
export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full border px-2.5 py-1
        text-xs font-medium
        ${VARIANTS[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
