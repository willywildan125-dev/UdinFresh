import React, { useState, useEffect, useRef } from 'react';

const API_URL = 'http://localhost:5000';

// Hapus DAFTAR_SUPIR statis

const formatTanggal = (isoString) => {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const formatTanggalCetak = (isoString) => {
  if (!isoString) return '-';
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
};

export default function AdminSuratJalanPage() {
  const [orders, setOrders] = useState([]);
  const [supirList, setSupirList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupir, setSelectedSupir] = useState({}); // { id_pesanan: supirObj }
  const [modalOrder, setModalOrder] = useState(null);     // pesanan yang akan dicetak
  const [nomorSJ, setNomorSJ] = useState({});             // nomor surat jalan per pesanan
  const printRef = useRef();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/pesanan`);
      const data = await res.json();
      if (data.success) {
        // Hanya tampilkan pesanan yang statusnya "Diproses"
        const filtered = data.data.filter(o => o.status_pesanan === 'Diproses');
        setOrders(filtered);

        // Auto-generate nomor surat jalan jika belum ada
        const nomors = {};
        filtered.forEach((o, idx) => {
          const tgl = new Date(o.tanggal_pesanan);
          const y   = tgl.getFullYear();
          const m   = String(tgl.getMonth() + 1).padStart(2, '0');
          const seq = String(idx + 1).padStart(3, '0');
          nomors[o.id_pesanan] = `SJ/${y}/${m}/${seq}`;
        });
        setNomorSJ(nomors);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupir = async () => {
    try {
      const res = await fetch(`${API_URL}/api/surat-jalan/supir`);
      const data = await res.json();
      if (data.success) {
        setSupirList(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { 
    fetchOrders(); 
    fetchSupir();
  }, []);

  const handlePilihSupir = (id_pesanan, supirId) => {
    const supir = supirList.find(s => s.id_supir === Number(supirId));
    setSelectedSupir(prev => ({ ...prev, [id_pesanan]: supir || null }));
  };

  const handleBuatSuratJalan = (order) => {
    if (!selectedSupir[order.id_pesanan]) {
      alert('Pilih supir terlebih dahulu sebelum membuat Surat Jalan.');
      return;
    }
    setModalOrder(order);
  };

  const handlePrint = async () => {
    const supirTerpilih = selectedSupir[modalOrder.id_pesanan];
    
    try {
      // Simpan ke database
      const res = await fetch(`${API_URL}/api/surat-jalan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_pesanan: modalOrder.id_pesanan,
          id_supir: supirTerpilih.id_supir,
          no_surat_jalan: nomorSJ[modalOrder.id_pesanan]
        })
      });
      const data = await res.json();
      
      if (!data.success) {
        alert('Gagal menyimpan surat jalan: ' + data.message);
        return;
      }
      
      // Jika berhasil simpan ke DB, baru print
      const printContent = printRef.current.innerHTML;
      const win = window.open('', '_blank', 'width=800,height=600');
      win.document.write(`
      <html>
        <head>
          <title>Surat Jalan - ${nomorSJ[modalOrder.id_pesanan]}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; font-size: 13px; color: #1a1a1a; padding: 32px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #16a34a; padding-bottom: 16px; margin-bottom: 20px; }
            .company { }
            .company h1 { font-size: 22px; font-weight: 800; color: #16a34a; }
            .company p  { font-size: 11px; color: #555; margin-top: 2px; }
            .sj-title   { text-align: right; }
            .sj-title h2 { font-size: 18px; font-weight: 700; color: #1a1a1a; }
            .sj-title p  { font-size: 11px; color: #555; margin-top: 2px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
            .info-box  { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
            .info-box h3 { font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; margin-bottom: 8px; font-weight: 600; }
            .info-box p  { font-size: 13px; font-weight: 600; color: #111; line-height: 1.6; }
            .info-box span { font-weight: 400; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            thead tr { background: #f0fdf4; }
            th { padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: #166534; border-bottom: 2px solid #16a34a; }
            td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
            .total-row td { font-weight: 700; border-top: 2px solid #e5e7eb; border-bottom: none; }
            .footer { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 32px; }
            .sign-box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; text-align: center; }
            .sign-box .label { font-size: 10px; text-transform: uppercase; color: #6b7280; font-weight: 600; margin-bottom: 56px; }
            .sign-box .name  { font-size: 12px; font-weight: 700; border-top: 1px solid #d1d5db; padding-top: 8px; margin-top: 8px; }
            .badge { display: inline-block; background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
    
    // Refresh data setelah dicetak
    setModalOrder(null);
    fetchOrders();
  } catch (error) {
    alert('Terjadi kesalahan: ' + error.message);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-emerald-500 font-medium">
        Memuat data surat jalan...
      </div>
    );
  }

  const supirModal  = modalOrder ? selectedSupir[modalOrder.id_pesanan] : null;
  const nomorModal  = modalOrder ? nomorSJ[modalOrder.id_pesanan] : '';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Surat Jalan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Buat surat jalan untuk pesanan yang sudah dikonfirmasi (status: <span className="font-semibold text-blue-600">Diproses</span>).
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-1 hover:text-emerald-500 transition-colors text-sm text-gray-500"
        >
          <span>Refresh Data</span>
          <span className="text-lg">↻</span>
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          Hanya pesanan dengan status <strong>Diproses</strong> yang tampil di sini.
          Pilih supir kemudian klik <strong>Buat Surat Jalan</strong> untuk mencetak.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">No. Surat Jalan</th>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Tanggal Pesanan</th>
                <th className="px-6 py-4 font-semibold">Berat (kg)</th>
                <th className="px-6 py-4 font-semibold">Pilih Supir</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order.id_pesanan} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {nomorSJ[order.id_pesanan]}
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600">
                    ORD-{String(order.id_pesanan).padStart(5, '0')}
                  </td>
                  <td className="px-6 py-4">{formatTanggal(order.tanggal_pesanan)}</td>
                  <td className="px-6 py-4">{order.total_berat} kg</td>
                  <td className="px-6 py-4 min-w-[220px]">
                    <select
                      value={selectedSupir[order.id_pesanan]?.id || ''}
                      onChange={(e) => handlePilihSupir(order.id_pesanan, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                      <option value="">-- Pilih Supir --</option>
                      {supirList.map(s => (
                        <option key={s.id_supir} value={s.id_supir}>{s.nama_supir}</option>
                      ))}
                    </select>
                    {selectedSupir[order.id_pesanan] && (
                      <p className="text-[11px] text-gray-400 mt-1 pl-1">
                        Nopol: {selectedSupir[order.id_pesanan].nopol || '-'}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleBuatSuratJalan(order)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-sm ${
                        selectedSupir[order.id_pesanan]
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Buat Surat Jalan
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm font-medium">Belum ada pesanan yang siap dibuat surat jalan</p>
                      <p className="text-xs">Konfirmasi pesanan terlebih dahulu di menu Pesanan Masuk.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Preview Surat Jalan */}
      {modalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-800">Preview Surat Jalan</h2>
                <p className="text-xs text-gray-500">{nomorModal}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Cetak
                </button>
                <button
                  onClick={() => setModalOrder(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body - Preview */}
            <div className="overflow-y-auto flex-1 p-6 bg-gray-50">
              {/* Konten yang akan di-print */}
              <div ref={printRef} className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-sm">

                {/* Kop Surat */}
                <div className="flex justify-between items-start border-b-2 border-emerald-500 pb-4 mb-6">
                  <div>
                    <h1 className="text-2xl font-extrabold text-emerald-600">UdinFresh Market</h1>
                    <p className="text-xs text-gray-500 mt-1">Pasar Segar Langsung ke Tangan Anda</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-bold text-gray-800">SURAT JALAN</h2>
                    <p className="text-xs text-gray-500 mt-1 font-mono">{nomorModal}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Tanggal: {formatTanggalCetak(new Date().toISOString())}</p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Informasi Pesanan</h3>
                    <p className="font-bold text-gray-800">
                      ORD-{String(modalOrder.id_pesanan).padStart(5, '0')}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Tanggal Pesan: {formatTanggalCetak(modalOrder.tanggal_pesanan)}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Total Berat: <span className="font-semibold text-gray-700">{modalOrder.total_berat} kg</span>
                    </p>
                    <span className="inline-block mt-2 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {modalOrder.status_pesanan}
                    </span>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Informasi Pengantar</h3>
                    <p className="font-bold text-gray-800">{supirModal?.nama_supir}</p>
                    <p className="text-gray-500 text-xs mt-1">Nopol: {supirModal?.nopol || '-'}</p>
                  </div>
                </div>

                {/* Tabel Item */}
                <table className="w-full border-collapse mb-6">
                  <thead>
                    <tr className="bg-emerald-50">
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase text-emerald-700 border-b-2 border-emerald-400">No</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase text-emerald-700 border-b-2 border-emerald-400">Keterangan</th>
                      <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase text-emerald-700 border-b-2 border-emerald-400">Berat (kg)</th>
                      <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase text-emerald-700 border-b-2 border-emerald-400">Kondisi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-700">1</td>
                      <td className="px-4 py-3 text-gray-700">
                        Pengiriman Pesanan ORD-{String(modalOrder.id_pesanan).padStart(5, '0')}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-800">
                        {modalOrder.total_berat} kg
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Baik</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Keterangan */}
                <div className="border border-dashed border-gray-300 rounded-xl p-4 mb-6 text-xs text-gray-500">
                  <strong className="text-gray-700">Keterangan:</strong> Surat jalan ini adalah bukti pengiriman barang dari UdinFresh Market kepada pelanggan.
                  Penerima wajib memeriksa kondisi barang sebelum menandatangani surat ini.
                </div>

                {/* Tanda Tangan */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {['Disiapkan Oleh', 'Pengantar / Supir', 'Penerima'].map((label, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</p>
                      <div className="h-14 mt-2" />
                      <div className="border-t border-gray-300 pt-2 mt-2">
                        <p className="text-[11px] font-bold text-gray-700">
                          {i === 1 ? supirModal?.nama_supir : '( ...................... )'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
