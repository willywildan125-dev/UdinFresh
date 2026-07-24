import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtCurrency = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);
const fmtDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const STATUS_CONFIG = {
  'Dikirim': { label: 'Dikirim', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  'Sedang Dikirim': { label: 'Sedang Dikirim', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  'Paket Dibawa Kurir': { label: 'Paket Dibawa', color: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  'Dalam Perjalanan': { label: 'Dalam Perjalanan', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  'Selesai': { label: 'Terkirim ✓', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  'Gagal Kirim': { label: 'Gagal Kirim', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

const ALASAN_GAGAL = [
  'Alamat tidak ditemukan / salah',
  'Rumah kosong / pembeli tidak bisa dihubungi',
  'Pembeli menolak paket',
  'Kendala cuaca / kendaraan rusak',
  'Lainnya',
];

// ─── Status Badge ──────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Toast Notification ────────────────────────────────────────────────────
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }
  }, [toast, onClose]);
  if (!toast) return null;
  return (
    <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-semibold transition-all animate-in slide-in-from-top-2 duration-300 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
      {toast.type === 'success' ? (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
      ) : (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
      )}
      {toast.message}
    </div>
  );
}

// ─── Order Card ────────────────────────────────────────────────────────────
function OrderCard({ order, onUpdateStatus, onGagalKirim, onLihatDetail }) {  
  const hp = order.hp_pembeli?.replace(/^0/, '62');
  const statusSelesai = order.status_pesanan === 'Selesai' || order.status_pesanan === 'Gagal Kirim';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Color bar */}
      <div className={`h-1 w-full ${STATUS_CONFIG[order.status_pesanan]?.dot || 'bg-gray-300'}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded mb-1 inline-block">
              {order.no_surat_jalan}
            </span>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{order.nama_pembeli}</h3>
            <p className="text-gray-500 text-sm">{order.nama_toko}</p>
          </div>
          <StatusBadge status={order.status_pesanan} />
        </div>

        {/* Info Row */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
            {order.total_berat} kg
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="font-semibold text-emerald-600">{fmtCurrency(order.total_bayar)}</span>
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {fmtDate(order.tanggal_pesanan)}
          </span>
        </div>

        {/* Action Buttons */}
        {!statusSelesai && (
          <div className="space-y-2">
            {/* Top row: contact & maps */}
            <div className="flex gap-2">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${hp}?text=Halo ${order.nama_pembeli}, saya kurir UdinFresh sedang mengantar pesanan Anda (SJ: ${order.no_surat_jalan}).`}
                target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-sm rounded-xl transition-colors border border-green-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/></svg>
                WA
              </a>
              {/* Telepon */}
              <a
                href={`tel:${order.hp_pembeli}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-sm rounded-xl transition-colors border border-blue-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Telepon
              </a>
              {/* Google Maps */}
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(order.nama_toko + ' ' + order.nama_pembeli)}`}
                target="_blank" rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm rounded-xl transition-colors border border-red-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Peta
              </a>
            </div>

            {/* Status update */}
            <div className="flex gap-2">
              {order.status_pesanan !== 'Paket Dibawa Kurir' && order.status_pesanan !== 'Dalam Perjalanan' && (
                <button
                  onClick={() => onUpdateStatus(order.id_pesanan, 'Paket Dibawa Kurir')}
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm rounded-xl transition-colors"
                >
                  📦 Paket Dibawa
                </button>
              )}
              {(order.status_pesanan === 'Paket Dibawa Kurir' || order.status_pesanan === 'Dikirim' || order.status_pesanan === 'Sedang Dikirim') && (
                <button
                  onClick={() => onUpdateStatus(order.id_pesanan, 'Dalam Perjalanan')}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl transition-colors"
                >
                  🚚 Dalam Perjalanan
                </button>
              )}
            </div>

            {/* Selesai & Gagal */}
            <div className="flex gap-2">
              <button
                onClick={() => onLihatDetail(order)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                Selesai
              </button>
              <button
                onClick={() => onGagalKirim(order.id_pesanan)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 font-semibold text-sm rounded-xl transition-colors border border-gray-200 hover:border-red-200"
              >
                ✕ Gagal Kirim
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Proof of Delivery Modal ───────────────────────────────────────────────
function PoDAModal({ order, onClose, onConfirm }) {
  const [namaPenerima, setNamaPenerima] = useState('');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);

  const startDraw = (e) => {
    setIsDrawing(true);
    setHasSig(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1f2937';
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const endDraw = () => setIsDrawing(false);
  const clearSig = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
  };

  const handleConfirm = () => {
    if (!namaPenerima.trim()) { alert('Mohon isi nama penerima.'); return; }
    onConfirm(order.id_pesanan, namaPenerima);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Bukti Pengiriman</h3>
              <p className="text-emerald-100 text-sm">{order?.nama_pembeli} • {order?.no_surat_jalan}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Nama penerima */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Penerima *</label>
            <input
              type="text"
              value={namaPenerima}
              onChange={(e) => setNamaPenerima(e.target.value)}
              placeholder="Misal: Pak RT, Satpam, Ibu Sari..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Tanda tangan */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Tanda Tangan Penerima</label>
              <button onClick={clearSig} className="text-xs text-red-500 hover:text-red-700 font-medium">Hapus</button>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <canvas
                ref={canvasRef}
                width={440}
                height={140}
                className="w-full cursor-crosshair touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
              {!hasSig && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-xs text-gray-400">Minta penerima tanda tangan di sini</p>
                </div>
              )}
            </div>
          </div>

          {/* Konfirmasi */}
          <button
            onClick={handleConfirm}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            Konfirmasi Terkirim
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Gagal Kirim Modal ─────────────────────────────────────────────────────
function GagalModal({ pesananId, onClose, onConfirm }) {
  const [alasan, setAlasan] = useState('');
  const [custom, setCustom] = useState('');

  const handleConfirm = () => {
    const finalAlasan = alasan === 'Lainnya' ? custom : alasan;
    if (!finalAlasan.trim()) { alert('Pilih alasan kegagalan.'); return; }
    onConfirm(pesananId, finalAlasan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-red-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Laporan Gagal Kirim</h3>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">Pilih alasan kegagalan pengiriman:</p>
          <div className="space-y-2">
            {ALASAN_GAGAL.map((a) => (
              <label key={a} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${alasan === a ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="alasan" value={a} checked={alasan === a} onChange={() => setAlasan(a)} className="accent-red-600" />
                <span className="text-sm font-medium text-gray-700">{a}</span>
              </label>
            ))}
          </div>
          {alasan === 'Lainnya' && (
            <input
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Tulis alasan lainnya..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          )}
          <button
            onClick={handleConfirm}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl transition-colors"
          >
            Laporkan Gagal Kirim
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Riwayat Tab ───────────────────────────────────────────────────────────
function RiwayatTab({ idSupir }) {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('supirToken');
    fetch(`${API_URL}/api/supir/riwayat/${idSupir}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setRiwayat(d.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [idSupir]);

  const selesai = riwayat.filter(r => r.status_pesanan === 'Selesai').length;
  const gagal = riwayat.filter(r => r.status_pesanan === 'Gagal Kirim').length;

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-emerald-700">{selesai}</p>
          <p className="text-sm text-emerald-600 font-medium mt-0.5">Berhasil</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{gagal}</p>
          <p className="text-sm text-red-500 font-medium mt-0.5">Gagal</p>
        </div>
      </div>

      {riwayat.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <p className="font-semibold text-gray-700">Belum ada riwayat</p>
          <p className="text-gray-400 text-sm mt-1">Pengiriman yang selesai akan muncul di sini</p>
        </div>
      ) : (
        <div className="space-y-3">
          {riwayat.map((r) => (
            <div key={r.id_pesanan} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{r.nama_pembeli}</p>
                <p className="text-gray-400 text-xs">{r.no_surat_jalan} • {fmtDate(r.tanggal_pesanan)}</p>
              </div>
              <StatusBadge status={r.status_pesanan} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function SupirDashboardPage() {
  const navigate = useNavigate();
  const [supir, setSupir] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tugas'); // 'tugas' | 'riwayat'
  const [toast, setToast] = useState(null);
  const [podOrder, setPodOrder] = useState(null); // order for PoD modal
  const [gagalId, setGagalId] = useState(null);  // id_pesanan for gagal modal

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  // Auth check & load
  useEffect(() => {
    const supirData = localStorage.getItem('udinfresh_supir');
    const token = localStorage.getItem('supirToken');
    if (!supirData || !token || supirData === 'undefined') {
      localStorage.removeItem('supirToken');
      localStorage.removeItem('udinfresh_supir');
      navigate('/supir/login');
      return;
    }
    try {
      const parsed = JSON.parse(supirData);
      if (!parsed?.id_supir || !parsed?.nama_supir) throw new Error('Data tidak lengkap');
      setSupir(parsed);
      fetchOrders(parsed.id_supir, token);
    } catch (err) {
      localStorage.removeItem('supirToken');
      localStorage.removeItem('udinfresh_supir');
      navigate('/supir/login');
    }
  }, [navigate]);

  const fetchOrders = async (id_supir, token) => {
    setLoading(true);
    try {
      const activeToken = token || localStorage.getItem('supirToken');
      const res = await fetch(`${API_URL}/api/supir/pesanan/${id_supir}`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('supirToken');
    localStorage.removeItem('udinfresh_supir');
    navigate('/supir/login');
  };

  const handleUpdateStatus = async (id_pesanan, status) => {
    const token = localStorage.getItem('supirToken');
    try {
      const res = await fetch(`${API_URL}/api/supir/pesanan/${id_pesanan}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', data.message);
        fetchOrders(supir.id_supir);
      } else {
        showToast('error', data.message);
      }
    } catch (err) { showToast('error', 'Terjadi kesalahan.'); }
  };

  const handleGagalKirim = async (id_pesanan, alasan) => {
    const token = localStorage.getItem('supirToken');
    try {
      await fetch(`${API_URL}/api/supir/pesanan/${id_pesanan}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'Gagal Kirim' })
      });
      showToast('error', `Gagal kirim dicatat: ${alasan}`);
      fetchOrders(supir.id_supir);
    } catch (err) { showToast('error', 'Terjadi kesalahan.'); }
  };

  const handleSelesai = async (id_pesanan, namaPenerima) => {
    const token = localStorage.getItem('supirToken');
    try {
      const res = await fetch(`${API_URL}/api/supir/pesanan/${id_pesanan}/selesai`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id_supir: supir.id_supir, nama_penerima: namaPenerima })
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', `Pesanan berhasil dikirim! Diterima oleh: ${namaPenerima}`);
        fetchOrders(supir.id_supir);
      } else {
        showToast('error', data.message);
      }
    } catch (err) { showToast('error', 'Terjadi kesalahan.'); }
  };

  if (!supir) return null;

  const todayOrders = orders.length;
  const inProgress = orders.filter(o => ['Dalam Perjalanan', 'Paket Dibawa Kurir'].includes(o.status_pesanan)).length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* PoD Modal */}
      {podOrder && (
        <PoDAModal
          order={podOrder}
          onClose={() => setPodOrder(null)}
          onConfirm={handleSelesai}
        />
      )}

      {/* Gagal Modal */}
      {gagalId && (
        <GagalModal
          pesananId={gagalId}
          onClose={() => setGagalId(null)}
          onConfirm={handleGagalKirim}
        />
      )}

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-400 leading-none">Portal Kurir</p>
                <p className="font-bold text-gray-900 leading-tight">{supir.nama_supir}</p>
              </div>
            </div>

            {/* Center: Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              {[
                { key: 'tugas', label: '📦 Tugas', count: todayOrders },
                { key: 'riwayat', label: '📋 Riwayat', count: null },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === tab.key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${activeTab === tab.key ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Right: Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span className="hidden sm:block">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero Stats Bar ──────────────────────────────────────────────── */}
      <div className="bg-emerald-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Selamat Bertugas,</p>
              <h1 className="text-white text-xl font-bold">{supir.nama_supir}</h1>
              {supir.nopol && (
                <span className="inline-block mt-1 text-xs font-mono bg-emerald-700/50 text-emerald-100 px-2 py-0.5 rounded">
                  🚛 {supir.nopol}
                </span>
              )}
            </div>
            <div className="flex gap-3 sm:gap-5">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{todayOrders}</p>
                <p className="text-emerald-200 text-xs">Total Tugas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-300">{inProgress}</p>
                <p className="text-emerald-200 text-xs">Sedang Jalan</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-200">{todayOrders - inProgress}</p>
                <p className="text-emerald-200 text-xs">Menunggu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'tugas' && (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
                <p className="text-gray-500 text-sm font-medium">Memuat daftar tugas...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">Semua Tugas Selesai! 🎉</h3>
                <p className="text-gray-400 text-sm">Tidak ada pesanan aktif yang ditugaskan untuk Anda.</p>
                <button
                  onClick={() => fetchOrders(supir.id_supir)}
                  className="mt-6 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-gray-800 text-lg">
                    Daftar Pengiriman
                    <span className="ml-2 text-sm font-normal text-gray-400">({orders.length} pesanan)</span>
                  </h2>
                  <button
                    onClick={() => fetchOrders(supir.id_supir)}
                    className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Refresh
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders.map((order) => (
                    <OrderCard
                      key={order.id_pesanan}
                      order={order}
                      onUpdateStatus={handleUpdateStatus}
                      onGagalKirim={(id) => setGagalId(id)}
                      onLihatDetail={(o) => setPodOrder(o)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'riwayat' && supir && (
          <RiwayatTab idSupir={supir.id_supir} />
        )}
      </main>
    </div>
  );
}
