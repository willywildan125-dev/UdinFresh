import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

const TABS = [
  { id: 'semua',      label: 'Semua' },
  { id: 'belum_bayar',label: 'Belum Bayar' },
  { id: 'menunggu_konfirmasi', label: 'Menunggu Konfirmasi' },
  { id: 'diproses',   label: 'Diproses' },
  { id: 'dikirim',    label: 'Dikirim' },
  { id: 'selesai',    label: 'Selesai' },
  { id: 'dibatalkan', label: 'Dibatalkan' },
];

// Mapping status dari DB ke key tab
const STATUS_MAP = {
  'Menunggu Pembayaran': 'belum_bayar',
  'Menunggu Konfirmasi': 'menunggu_konfirmasi',
  'Diproses':            'diproses',
  'Sedang Diproses':     'diproses',
  'Sedang Dikirim':      'dikirim',
  'Dikirim':             'dikirim',
  'Selesai':             'selesai',
  'Dibatalkan':          'dibatalkan',
};

const STATUS_STYLE = {
  belum_bayar: { label: 'Belum Bayar', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  menunggu_konfirmasi: { label: 'Menunggu Konfirmasi', bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  diproses:   { label: 'Sedang Diproses', bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400' },
  dikirim:    { label: 'Sedang Dikirim',  bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400' },
  selesai:    { label: 'Selesai',         bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  dibatalkan: { label: 'Dibatalkan',      bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400' },
};

// Format tanggal dari ISO menjadi "dd Mmm yyyy"
function formatTanggal(isoString) {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function StatusBadge({ statusKey }) {
  const s = STATUS_STYLE[statusKey] || { label: statusKey, bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function OrderCard({ order, statusKey, onDetail, onPay, onCancel }) {
  const firstItem = order.items[0];
  const extraCount = order.items.length - 1;
  const totalPayment = order.items.reduce((sum, i) => sum + i.subtotal, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm">🏪</span>
          <span className="text-[13px] font-bold text-gray-800">UdinFresh</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">{formatTanggal(order.tanggal_pesanan)}</span>
          <StatusBadge statusKey={statusKey} />
        </div>
      </div>

      {/* Items preview */}
      <div className="px-4 py-3 flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
            {firstItem?.foto_produk ? (
              <img
                src={`${API_URL}/images/${firstItem.foto_produk}`}
                alt={firstItem.nama_produk}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🥬</div>
            )}
          </div>
          {extraCount > 0 && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
              +{extraCount}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug">
            {firstItem?.nama_produk || '-'}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            × {firstItem?.jumlah}
            {extraCount > 0 && ` + ${extraCount} produk lainnya`}
          </p>
          <p className="text-xs font-bold text-emerald-600 mt-1">
            Total: Rp {totalPayment.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between gap-2">
        <span className="text-[11px] text-gray-400 font-medium">ORD-{String(order.id_pesanan).padStart(8, '0')}</span>
        <div className="flex gap-2">
          <button
            onClick={() => onDetail(order)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Lihat Detail
          </button>
          {statusKey === 'belum_bayar' && (
            <button 
              onClick={() => onPay(order.id_pesanan)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors"
            >
              Bayar Sekarang
            </button>
          )}
          {statusKey === 'selesai' && (
            <button className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
              Beli Lagi
            </button>
          )}
          {statusKey === 'dikirim' && (
            <button className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
              Lacak Pesanan
            </button>
          )}
          {statusKey === 'diproses' && (
            <button 
              onClick={() => onCancel(order.id_pesanan)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
            >
              Batalkan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Modal detail pesanan
function OrderDetailModal({ order, statusKey, onClose }) {
  if (!order) return null;
  const totalPayment = order.items.reduce((sum, i) => sum + i.subtotal, 0);
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white w-full max-w-md md:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Detail Pesanan</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-400 font-medium">No. Pesanan</p>
              <p className="text-sm font-bold text-gray-800">ORD-{String(order.id_pesanan).padStart(8, '0')}</p>
            </div>
            <StatusBadge statusKey={statusKey} />
          </div>

          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
            <span className="text-lg">🏪</span>
            <div>
              <p className="text-[11px] text-gray-400">Toko</p>
              <p className="text-sm font-bold text-gray-800">UdinFresh</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Produk</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-white shrink-0">
                    {item.foto_produk ? (
                      <img src={`${API_URL}/images/${item.foto_produk}`} alt={item.nama_produk} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🥬</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-gray-800 line-clamp-2">{item.nama_produk}</p>
                    <p className="text-[11px] text-gray-400">× {item.jumlah}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-800 shrink-0">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-3 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800">Total Pembayaran</span>
            <span className="text-base font-extrabold text-emerald-600">
              Rp {totalPayment.toLocaleString('id-ID')}
            </span>
          </div>

          <p className="text-[11px] text-gray-400 text-center">{formatTanggal(order.tanggal_pesanan)}</p>
        </div>
      </div>
    </div>
  );
}

export default function PesananPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('semua');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);

  const fetchOrders = () => {
    const noHp = localStorage.getItem('udinfresh_user_phone');
    if (!noHp) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/pesanan/pembeli/${encodeURIComponent(noHp)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.data);
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError('Gagal memuat pesanan. Pastikan server berjalan.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePay = async (id_pesanan) => {
    try {
      const res = await fetch(`${API_URL}/api/pesanan/${id_pesanan}/bayar`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        alert('Pembayaran berhasil disimulasikan!');
        fetchOrders();
      } else {
        alert(`Gagal: ${data.message}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleCancel = async (id_pesanan) => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;
    
    try {
      const res = await fetch(`${API_URL}/api/pesanan/${id_pesanan}/batal`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        alert('Pesanan berhasil dibatalkan!');
        fetchOrders();
      } else {
        alert(`Gagal: ${data.message}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Tambahkan statusKey ke tiap order
  const ordersWithKey = orders.map((o) => ({
    ...o,
    statusKey: STATUS_MAP[o.status_pesanan] || 'diproses',
  }));

  const filtered =
    activeTab === 'semua'
      ? ordersWithKey
      : ordersWithKey.filter((o) => o.statusKey === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button
            onClick={() => navigate(-1)}
            className="md:hidden p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-gray-900">Pesanan Saya</h1>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide border-t border-gray-100">
          {TABS.map((tab) => {
            const count =
              tab.id === 'semua'
                ? ordersWithKey.length
                : ordersWithKey.filter((o) => o.statusKey === tab.id).length;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-shrink-0 px-4 py-3 text-xs font-semibold transition-colors whitespace-nowrap ${
                  isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders list */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-400">Memuat pesanan...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-700 mb-1">Gagal memuat pesanan</h3>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-700 mb-1">Belum ada pesanan</h3>
            <p className="text-sm text-gray-400 mb-6">Yuk mulai belanja produk segar favoritmu!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-emerald-600 text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-emerald-700 transition-colors"
            >
              Belanja Sekarang
            </button>
          </div>
        ) : (
          filtered.map((order) => (
            <OrderCard
              key={order.id_pesanan}
              order={order}
              statusKey={order.statusKey}
              onDetail={(o) => setDetailOrder(o)}
              onPay={handlePay}
              onCancel={handleCancel}
            />
          ))
        )}
      </div>

      {/* Detail Modal */}
      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          statusKey={detailOrder.statusKey}
          onClose={() => setDetailOrder(null)}
        />
      )}
    </div>
  );
}
