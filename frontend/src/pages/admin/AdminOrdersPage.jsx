import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

const formatTanggal = (isoString) => {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const formatTanggalCetak = (isoString) => {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
};

const formatRupiah = (val) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const printRef = useRef();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notaModal, setNotaModal] = useState(null);   // { order, items }
  const [loadingNota, setLoadingNota] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null); // order yang akan dikonfirmasi

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/pesanan`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Buka modal konfirmasi kustom
  const handleAskConfirm = (order) => {
    setConfirmModal(order);
  };

  const handleConfirm = async (order) => {
    setConfirmModal(null);
    setLoadingNota(true);
    try {
      // 1. Konfirmasi pesanan
      const res = await fetch(`${API_URL}/api/pesanan/${order.id_pesanan}/konfirmasi`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (!data.success) {
        alert(`Gagal: ${data.message}`);
        setLoadingNota(false);
        return;
      }

      // 2. Fetch detail item pesanan
      const detailRes = await fetch(`${API_URL}/api/detail-pesanan/${order.id_pesanan}`);
      const detailData = await detailRes.json();
      const items = detailData.success ? detailData.data : [];

      // 3. Hitung total
      const subtotal = items.reduce((sum, it) => sum + Number(it.subtotal), 0);

      // 4. Tampilkan modal nota
      setNotaModal({ order, items, subtotal });
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoadingNota(false);
      fetchOrders();
    }
  };

  const handleCetakNota = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=800,height=700');
    win.document.write(`
      <html>
        <head>
          <title>Nota Konfirmasi - ORD-${String(notaModal.order.id_pesanan).padStart(5, '0')}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; font-size: 13px; color: #1a1a1a; padding: 32px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #16a34a; padding-bottom: 16px; margin-bottom: 20px; }
            .company h1 { font-size: 22px; font-weight: 800; color: #16a34a; }
            .company p  { font-size: 11px; color: #555; margin-top: 2px; }
            .nota-title { text-align: right; }
            .nota-title h2 { font-size: 18px; font-weight: 700; }
            .nota-title p { font-size: 11px; color: #555; margin-top: 2px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
            .info-box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
            .info-box h3 { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; margin-bottom: 8px; font-weight: 600; }
            .info-box p { font-size: 13px; font-weight: 600; color: #111; line-height: 1.6; }
            .info-box span { font-weight: 400; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            thead tr { background: #f0fdf4; }
            th { padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: #166534; border-bottom: 2px solid #16a34a; }
            td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
            .td-right { text-align: right; }
            .total-row td { font-weight: 700; border-top: 2px solid #e5e7eb; border-bottom: none; background: #f9fafb; }
            .badge { display: inline-block; background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; }
            .footer-note { font-size: 11px; color: #6b7280; border-top: 1px dashed #d1d5db; padding-top: 12px; margin-top: 4px; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const handleTutupNota = () => {
    setNotaModal(null);
    navigate('/admin/surat-jalan');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Menunggu Pembayaran':  return 'bg-orange-100 text-orange-700';
      case 'Menunggu Konfirmasi':  return 'bg-purple-100 text-purple-700';
      case 'Diproses':             return 'bg-blue-100 text-blue-700';
      case 'Sedang Diproses':      return 'bg-blue-100 text-blue-700';
      case 'Sedang Dikirim':       return 'bg-sky-100 text-sky-700';
      case 'Dikirim':              return 'bg-sky-100 text-sky-700';
      case 'Selesai':              return 'bg-emerald-100 text-emerald-700';
      case 'Dibatalkan':           return 'bg-red-100 text-red-700';
      default:                     return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-emerald-500 font-medium">Loading orders data...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Manajemen Pesanan</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola dan konfirmasi pesanan pelanggan.</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-1 hover:text-emerald-500 transition-colors text-sm text-gray-500">
          <span>Refresh Data</span>
          <span className="text-lg">↻</span>
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Pembeli</th>
                <th className="px-6 py-4 font-semibold">Tanggal</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Berat (kg)</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order.id_pesanan} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-emerald-600">
                    ORD-{String(order.id_pesanan).padStart(5, '0')}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800 text-xs">{order.nama_pembeli || '-'}</p>
                    {order.nama_toko && <p className="text-[11px] text-gray-400">{order.nama_toko}</p>}
                  </td>
                  <td className="px-6 py-4">{formatTanggal(order.tanggal_pesanan)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusColor(order.status_pesanan)}`}>
                      {order.status_pesanan}
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.total_berat}</td>
                  <td className="px-6 py-4 text-right">
                    {order.status_pesanan === 'Menunggu Konfirmasi' && (
                      <button
                        onClick={() => handleConfirm(order)}
                        disabled={loadingNota}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loadingNota ? (
                          <>
                            <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Memproses...
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Konfirmasi & Cetak Nota
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Belum ada pesanan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Modal Nota Konfirmasi ─── */}
      {notaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="font-bold text-gray-800">Nota Konfirmasi Pesanan</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  ORD-{String(notaModal.order.id_pesanan).padStart(5, '0')} · Pesanan berhasil dikonfirmasi ✓
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCetakNota}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Cetak Nota
                </button>
                <button
                  onClick={handleTutupNota}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Ke Surat Jalan
                </button>
              </div>
            </div>

            {/* Modal Body – Preview Nota */}
            <div className="overflow-y-auto flex-1 p-6 bg-gray-50">
              <div ref={printRef} className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-sm">

                {/* Kop */}
                <div className="flex justify-between items-start border-b-2 border-emerald-500 pb-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-extrabold text-emerald-600">UdinFresh Market</h1>
                    <p className="text-xs text-gray-500 mt-1">Pasar Segar Langsung ke Tangan Anda</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-bold text-gray-800">NOTA KONFIRMASI</h2>
                    <p className="text-xs font-mono text-gray-500 mt-1">
                      ORD-{String(notaModal.order.id_pesanan).padStart(5, '0')}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Tanggal: {formatTanggalCetak(new Date().toISOString())}
                    </p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Informasi Pembeli</h3>
                    <p className="font-bold text-gray-800">{notaModal.order.nama_pembeli || '-'}</p>
                    {notaModal.order.nama_toko && (
                      <p className="text-xs text-gray-500 mt-0.5">Toko: {notaModal.order.nama_toko}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">
                      No. HP: <span className="font-semibold text-gray-700">{notaModal.order.no_hp || '-'}</span>
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Informasi Pesanan</h3>
                    <p className="font-bold text-gray-800">
                      ORD-{String(notaModal.order.id_pesanan).padStart(5, '0')}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Tanggal Pesan: {formatTanggalCetak(notaModal.order.tanggal_pesanan)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Total Berat: <span className="font-semibold text-gray-700">{notaModal.order.total_berat} kg</span>
                    </p>
                    <span className="inline-block mt-2 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Diproses
                    </span>
                  </div>
                </div>

                {/* Tabel Item */}
                <table className="w-full border-collapse mb-6">
                  <thead>
                    <tr className="bg-emerald-50">
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase text-emerald-700 border-b-2 border-emerald-400">No</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase text-emerald-700 border-b-2 border-emerald-400">Nama Produk</th>
                      <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase text-emerald-700 border-b-2 border-emerald-400">Qty</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase text-emerald-700 border-b-2 border-emerald-400">Harga Satuan</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase text-emerald-700 border-b-2 border-emerald-400">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notaModal.items.map((item, idx) => (
                      <tr key={item.id_detail} className="border-b border-gray-100">
                        <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-3 text-gray-800 font-medium">{item.nama_produk}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{item.jumlah}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{formatRupiah(item.harga)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatRupiah(item.subtotal)}</td>
                      </tr>
                    ))}
                    {/* Total row */}
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan="4" className="px-4 py-3 text-right text-gray-700 border-t-2 border-gray-200">Total Produk</td>
                      <td className="px-4 py-3 text-right text-emerald-700 border-t-2 border-gray-200">{formatRupiah(notaModal.subtotal)}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan="4" className="px-4 py-3 text-right text-gray-500">Ongkos Kirim</td>
                      <td className="px-4 py-3 text-right text-gray-700">Rp 25.000</td>
                    </tr>
                    <tr className="bg-emerald-50 font-extrabold">
                      <td colSpan="4" className="px-4 py-3 text-right text-gray-800 border-t-2 border-emerald-200">TOTAL PEMBAYARAN</td>
                      <td className="px-4 py-3 text-right text-emerald-700 text-base border-t-2 border-emerald-200">
                        {formatRupiah(notaModal.subtotal + 25000)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Keterangan */}
                <div className="border border-dashed border-gray-300 rounded-xl p-4 text-xs text-gray-500">
                  <strong className="text-gray-700">Keterangan:</strong> Nota ini adalah bukti konfirmasi pesanan dari UdinFresh Market.
                  Pesanan telah dikonfirmasi dan sedang diproses untuk pengiriman.
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
