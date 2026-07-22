import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, cartActions } from '../../store/cartStore';

const API_URL = 'http://localhost:5000';

const SHIPPING_COST = 25000;

const PAYMENT_METHODS = [
  {
    id: 'transfer_bank',
    label: 'Transfer Bank',
    description: 'BCA, Mandiri, BNI, BRI',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
  },
  {
    id: 'qris',
    label: 'QRIS',
    description: 'Scan QR dari semua e-wallet & bank',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    id: 'cod',
    label: 'Bayar di Tempat (COD)',
    description: 'Bayar saat paket tiba',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const selectedItems = cart.filter((item) => item.selected);

  const [form, setForm] = useState({
    fullName: '',
    storeName: '',
    phone: '',
    address: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('transfer_bank');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculations
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalWeight = selectedItems.reduce((sum, item) => {
    const parsed = parseFloat(item.weight);
    return sum + (isNaN(parsed) ? 0 : parsed) * item.quantity;
  }, 0);
  const totalPayment = subtotal + SHIPPING_COST;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!form.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi';
    else if (!/^[0-9+\-\s]{8,15}$/.test(form.phone.trim()))
      newErrors.phone = 'Format nomor telepon tidak valid';
    if (!form.address.trim()) newErrors.address = 'Alamat lengkap wajib diisi';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Siapkan payload sesuai struktur backend
      const items = selectedItems.map((item) => ({
        id_produk: item.productId,
        jumlah: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const payload = {
        nama_pembeli: form.fullName,
        no_hp: form.phone,
        nama_toko: form.storeName || '',
        items,
        total_berat: totalWeight,
      };

      const res = await fetch(`${API_URL}/api/pesanan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal membuat pesanan.');
      }

      // Simpan no_hp ke localStorage agar PesananPage bisa fetch pesanan milik user ini
      localStorage.setItem('udinfresh_user_phone', form.phone);

      // Hapus item yang sudah di-checkout dari keranjang
      selectedItems.forEach((item) => cartActions.removeItem(item.cartItemId));

      navigate('/pesanan');
    } catch (err) {
      alert(`Gagal: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white px-4 py-3 flex items-center border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-gray-900 ml-3">Checkout</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Tidak ada produk dipilih</h2>
          <p className="text-sm text-gray-500 mb-6">Silakan pilih produk di keranjang terlebih dahulu.</p>
          <button
            onClick={() => navigate('/cart')}
            className="bg-emerald-600 text-white font-bold py-2.5 px-8 rounded-full hover:bg-emerald-700 transition-colors"
          >
            Ke Keranjang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 -ml-1 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-gray-900 ml-3">Checkout</h1>
      </header>

      {/* Body */}
      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto px-4 py-5 md:py-6 grid grid-cols-1 md:grid-cols-[1fr_380px] gap-4 md:gap-6 items-start">

          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-4">

            {/* Alamat Pengiriman */}
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-sm font-bold text-gray-800">Alamat Pengiriman</h2>
              </div>

              <div className="px-5 py-4 space-y-4">
                {/* Row: Full Name + Store Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Nama lengkap penerima"
                      className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all ${
                        errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Store Name <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="storeName"
                      value={form.storeName}
                      onChange={handleChange}
                      placeholder="Nama toko (jika ada)"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all ${
                      errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Jl. Nama Jalan No. xx, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos"
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none ${
                      errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Metode Pembayaran */}
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h2 className="text-sm font-bold text-gray-800">Metode Pembayaran</h2>
              </div>

              <div className="px-5 py-3 divide-y divide-gray-50">
                {PAYMENT_METHODS.map((method) => {
                  const isActive = paymentMethod === method.id;
                  return (
                    <label
                      key={method.id}
                      htmlFor={`pay-${method.id}`}
                      className={`flex items-center gap-3 py-3.5 cursor-pointer rounded-lg px-3 -mx-3 transition-colors ${
                        isActive ? 'bg-emerald-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* Radio */}
                      <input
                        type="radio"
                        id={`pay-${method.id}`}
                        name="paymentMethod"
                        value={method.id}
                        checked={isActive}
                        onChange={() => setPaymentMethod(method.id)}
                        className="hidden"
                      />
                      {/* Custom radio circle */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isActive ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                        }`}
                      >
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>

                      {/* Icon */}
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {method.icon}
                      </div>

                      {/* Label & Desc */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold leading-tight ${isActive ? 'text-emerald-800' : 'text-gray-800'}`}>
                          {method.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                      </div>

                      {/* Right arrow */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </label>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="space-y-4">

            {/* Ringkasan Pesanan */}
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-sm font-bold text-gray-800">Ringkasan Pesanan</h2>
              </div>

              {/* Item list */}
              <div className="px-5 py-3 divide-y divide-gray-50">
                {selectedItems.map((item) => (
                  <div key={item.cartItemId} className="flex items-center gap-3 py-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {item.weight} × {item.quantity}
                      </p>
                    </div>
                    {/* Price */}
                    <span className="text-sm font-bold text-gray-800 shrink-0">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary totals */}
              <div className="px-5 pb-4 pt-2 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Total Berat</span>
                  <span className="font-medium text-gray-700">{totalWeight % 1 === 0 ? totalWeight : totalWeight.toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal Produk</span>
                  <span className="font-medium text-gray-700">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Ongkos Kirim</span>
                  <span className="font-medium text-gray-700">Rp {SHIPPING_COST.toLocaleString('id-ID')}</span>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-2 mt-1 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-800">Total Pembayaran</span>
                  <span className="text-base font-extrabold text-emerald-600">
                    Rp {totalPayment.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all duration-200 ${
                isSubmitting
                  ? 'bg-emerald-400 cursor-not-allowed text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Buat Pesanan
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
