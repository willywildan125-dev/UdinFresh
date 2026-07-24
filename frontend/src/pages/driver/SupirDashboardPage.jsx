import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

export default function SupirDashboardPage() {
  const navigate = useNavigate();
  const [supir, setSupir] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal konfirmasi selesai
  const [confirmId, setConfirmId] = useState(null);

  // Modal notifikasi hasil (sukses / gagal)
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  useEffect(() => {
    const supirData = localStorage.getItem('udinfresh_supir');
    if (!supirData) {
      navigate('/supir/login');
      return;
    }
    const parsed = JSON.parse(supirData);
    setSupir(parsed);
    fetchOrders(parsed.id_supir);
  }, [navigate]);

  const fetchOrders = async (id_supir) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/supir/pesanan/${id_supir}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('udinfresh_supir');
    navigate('/supir/login');
  };

  // Buka modal konfirmasi selesai
  const handleAskSelesaikan = (id_pesanan) => {
    setConfirmId(id_pesanan);
  };

  // Eksekusi setelah user klik "Ya, Selesaikan"
  const handleSelesaikan = async () => {
    const id_pesanan = confirmId;
    setConfirmId(null);
    try {
      const res = await fetch(`${API_URL}/api/supir/pesanan/${id_pesanan}/selesai`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_supir: supir.id_supir })
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Pesanan berhasil diselesaikan!');
        fetchOrders(supir.id_supir);
      } else {
        showToast('error', `Gagal: ${data.message}`);
      }
    } catch (err) {
      showToast('error', `Error: ${err.message}`);
    }
  };

  if (!supir) return null;

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center sm:py-8 font-sans">
      <div className="w-full sm:max-w-[400px] bg-gray-50 sm:rounded-[2.5rem] sm:border-[8px] border-gray-800 shadow-2xl overflow-hidden relative flex flex-col h-screen sm:h-[800px]">
        {/* Notch */}
        <div className="hidden sm:block absolute top-0 inset-x-0 h-4 bg-gray-800 w-32 mx-auto rounded-b-xl z-20"></div>

        {/* Header */}
        <header className="bg-emerald-600 text-white p-4 pt-6 sticky top-0 z-10 shadow-md shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Portal Supir</h1>
            <button
              onClick={handleLogout}
              className="text-emerald-100 hover:text-white text-sm font-medium px-3 py-1 bg-emerald-700 rounded-lg"
            >
              Keluar
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl shadow-inner">
              {supir.nama_supir.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-emerald-100">Selamat datang,</p>
              <p className="font-bold">{supir.nama_supir}</p>
              <p className="text-xs text-emerald-200 mt-0.5 font-mono bg-emerald-800/30 inline-block px-2 py-0.5 rounded">
                {supir.nopol || 'Tanpa Kendaraan'}
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 flex-1 overflow-y-auto pb-20 no-scrollbar">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Daftar Antaran</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
              {orders.length} Pesanan
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
              <p className="text-gray-500 text-sm">Memuat data pesanan...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100 mt-8">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Tidak ada antaran</h3>
              <p className="text-gray-500 text-sm">Saat ini belum ada pesanan yang ditugaskan kepada Anda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id_pesanan} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
                  {/* Status Indicator Bar */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${order.status_pesanan === 'Dikirim' ? 'bg-orange-400' : 'bg-emerald-500'}`}></div>

                  <div className="p-4 pl-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded mb-2">
                          SJ: {order.no_surat_jalan}
                        </span>
                        <h3 className="font-bold text-gray-900">{order.nama_pembeli}</h3>
                        <p className="text-sm text-gray-500">{order.nama_toko}</p>
                      </div>
                      <a
                        href={`https://wa.me/${order.hp_pembeli?.replace(/^0/, '62')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition-colors shrink-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/>
                        </svg>
                      </a>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Daftar Barang ({order.total_berat} kg)
                      </p>
                      <ul className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <li key={idx} className="text-sm flex justify-between">
                            <span className="text-gray-800">{item.jumlah}x {item.nama_produk}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500">Total Tagihan</span>
                        <span className="font-bold text-emerald-600">Rp {order.total_bayar?.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAskSelesaikan(order.id_pesanan)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Selesaikan Pesanan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ─── Modal Konfirmasi Selesai ─── */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
            {/* Ikon */}
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">Selesaikan Pesanan?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Apakah pesanan ini sudah sampai ke tangan konsumen?
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSelesaikan}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Notifikasi Hasil ─── */}
      {toast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 flex flex-col items-center text-center">
            {/* Ikon sukses / error */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${toast.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'}`}>
              {toast.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h3 className={`text-base font-bold mb-1 ${toast.type === 'success' ? 'text-emerald-700' : 'text-red-700'}`}>
              {toast.type === 'success' ? 'Berhasil!' : 'Terjadi Kesalahan'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className={`w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-colors shadow-sm ${toast.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-500 hover:bg-red-600'}`}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
