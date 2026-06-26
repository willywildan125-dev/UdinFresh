export default function FeatureFooter() {
  const features = [
    { title: 'Kualitas Terjamin', desc: 'Produk segar setiap hari', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { title: 'Dari Petani Lokal', desc: 'Mendukung petani Indonesia', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Pengiriman Cepat', desc: 'Sampai ke rumahmu', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Pembayaran Aman', desc: '100% aman & terpercaya', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.956 11.956 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
  ];

  return (
    <div className="hidden md:grid grid-cols-4 gap-6 px-6 py-8 mt-12 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      {features.map((feature, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="text-emerald-500 bg-emerald-50 p-2.5 rounded-full shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
            </svg>
          </div>
          <div>
            <h5 className="text-sm font-bold text-gray-800">{feature.title}</h5>
            <p className="text-[10px] text-gray-500">{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
