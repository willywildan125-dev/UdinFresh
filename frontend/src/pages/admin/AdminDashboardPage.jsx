import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboard.service';

export default function AdminDashboardPage() {
  const [data, setData] = useState({
    stats: {
      totalProduk: 0,
      totalPesanan: 0,
      pesananDiproses: 0,
      totalPendapatan: 0
    },
    recentTransactions: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardData();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const stats = [
    { title: 'Total Produk', value: data.stats.totalProduk.toLocaleString('id-ID'), change: 'Updated', isNeutral: true, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { title: 'Total Pesanan', value: data.stats.totalPesanan.toLocaleString('id-ID'), change: 'Updated', isNeutral: true, icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { title: 'Pesanan Diproses', value: data.stats.pesananDiproses.toLocaleString('id-ID'), change: 'Diproses', isNeutral: true, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { title: 'Total Pendapatan', value: formatCurrency(data.stats.totalPendapatan), change: 'Selesai', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  const getStatusColor = (status) => {
    if (status === 'Selesai') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Menunggu Pembayaran') return 'bg-orange-100 text-orange-700';
    if (status === 'Menunggu Konfirmasi') return 'bg-purple-100 text-purple-700';
    if (status === 'Diproses') return 'bg-blue-100 text-blue-700';
    if (status === 'Dibatalkan') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const categoryColors = ['bg-emerald-500', 'bg-teal-400', 'bg-sky-400', 'bg-amber-400', 'bg-indigo-400', 'bg-pink-400'];

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-emerald-500 font-medium">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back. Here's what's happening with your marketplace today.</p>
        </div>
        <div className="text-xs text-gray-400">
          <button onClick={fetchDashboardData} className="flex items-center gap-1 hover:text-emerald-500 transition-colors">
            <span>Refresh Data</span>
            <span className="text-lg">↻</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                </svg>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                stat.isNeutral ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-xl font-extrabold text-gray-800 truncate" title={stat.value}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mock Chart Area */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-800">Daily Sales Overview</h2>
              <p className="text-xs text-gray-400 mt-1">Revenue over the last 14 days (Mock Data)</p>
            </div>
            <select className="text-xs border-gray-200 bg-gray-50 rounded-lg text-gray-600 px-3 py-1.5 outline-none focus:ring-1 focus:ring-emerald-500 font-medium">
              <option>Last 14 Days</option>
              <option>This Month</option>
            </select>
          </div>
          {/* Simple Mock Chart (SVG) */}
          <div className="w-full h-48 relative flex items-end">
             {/* Grid lines */}
             <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-gray-100 text-[10px] text-gray-400 pb-5 pl-2">
               <div className="w-full border-t border-gray-50 h-0">15M</div>
               <div className="w-full border-t border-gray-50 h-0">10M</div>
               <div className="w-full border-t border-gray-50 h-0">5M</div>
             </div>
             {/* Mock Line */}
             <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,80 L10,60 L20,70 L30,50 L40,65 L50,40 L60,55 L70,30 L80,50 L90,20 L100,45" 
                      fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M0,80 L10,60 L20,70 L30,50 L40,65 L50,40 L60,55 L70,30 L80,50 L90,20 L100,45 L100,100 L0,100 Z" 
                      fill="url(#gradient)" opacity="0.1"/>
                <defs>
                  <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
             </svg>
             <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-gray-400 px-4">
                <span>01 Nov</span>
                <span>05 Nov</span>
                <span>10 Nov</span>
                <span>14 Nov</span>
             </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-base font-bold text-gray-800 mb-6">Top Categories</h2>
          <div className="flex-1 space-y-5">
            {data.categories.length > 0 ? data.categories.map((cat, index) => {
              const color = categoryColors[index % categoryColors.length];
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                      {cat.name}
                    </div>
                    <span>{cat.val}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`${color} h-1.5 rounded-full`} style={{ width: `${cat.val}%` }}></div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-xs text-gray-500 text-center py-4">No categories found</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-800">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/50 text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Order ID</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
              {data.recentTransactions.length > 0 ? data.recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-emerald-600 font-bold">{tx.id}</td>
                  <td className="px-6 py-4">{tx.customer || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-800 font-bold">{tx.amount}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No recent transactions</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
