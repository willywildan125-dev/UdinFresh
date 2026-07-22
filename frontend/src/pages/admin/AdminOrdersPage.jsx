import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleConfirm = async (id) => {
    if (!confirm('Apakah Anda yakin ingin mengkonfirmasi pembayaran pesanan ini?')) return;
    try {
      const res = await fetch(`${API_URL}/api/pesanan/${id}/konfirmasi`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        alert('Pesanan berhasil dikonfirmasi dan sedang diproses.');
        fetchOrders();
      } else {
        alert(`Gagal: ${data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Menunggu Pembayaran': return 'bg-orange-100 text-orange-700';
      case 'Menunggu Konfirmasi': return 'bg-purple-100 text-purple-700';
      case 'Diproses': return 'bg-blue-100 text-blue-700';
      case 'Sedang Diproses': return 'bg-blue-100 text-blue-700';
      case 'Sedang Dikirim': return 'bg-sky-100 text-sky-700';
      case 'Dikirim': return 'bg-sky-100 text-sky-700';
      case 'Selesai': return 'bg-emerald-100 text-emerald-700';
      case 'Dibatalkan': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTanggal = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
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
                        onClick={() => handleConfirm(order.id_pesanan)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        Konfirmasi Pembayaran
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Belum ada pesanan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
