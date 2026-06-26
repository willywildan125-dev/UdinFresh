import { X } from 'lucide-react';

/**
 * Modal dasar dengan overlay gelap dan tombol close.
 * Bisa dipakai untuk preview foto retur, konfirmasi hapus cart, dll.
 *
 * Contoh pakai:
 *   <Modal isOpen={open} onClose={() => setOpen(false)} title="Konfirmasi">
 *     <p>Yakin ingin menghapus item ini?</p>
 *   </Modal>
 */
export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
