import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCart, cartActions } from '../../store/cartStore';

// Fix default marker icon for Leaflet + Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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

// ─── Sub-component: handles map click & drag events ───────────────────────────
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

// ─── Sub-component: draggable marker that reports its new position ─────────────
function DraggableMarker({ position, onDragEnd }) {
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        onDragEnd(marker.getLatLng());
      }
    },
  };

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
}

// ─── Map Modal Component ───────────────────────────────────────────────────────
function MapModal({ isOpen, onClose, onConfirm }) {
  const [markerPos, setMarkerPos] = useState({ lat: -7.2504, lng: 112.7688 }); // default: Surabaya
  const [previewAddress, setPreviewAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const fetchAddress = async (latlng) => {
    setIsGeocoding(true);
    setPreviewAddress('Mencari alamat...');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}&addressdetails=1&accept-language=id`,
        { headers: { 'User-Agent': 'UdinFresh/1.0' } }
      );
      const data = await res.json();
      if (data && data.display_name) {
        setPreviewAddress(data.display_name);
      } else {
        setPreviewAddress('Alamat tidak ditemukan');
      }
    } catch {
      setPreviewAddress('Gagal mengambil alamat. Coba lagi.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleLocationSelect = (latlng) => {
    setMarkerPos(latlng);
    fetchAddress(latlng);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung GPS.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMarkerPos(latlng);
        fetchAddress(latlng);
        setIsLocating(false);
      },
      () => {
        alert('Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.');
        setIsLocating(false);
      }
    );
  };

  const handleConfirm = () => {
    if (previewAddress && previewAddress !== 'Mencari alamat...' && previewAddress !== 'Alamat tidak ditemukan') {
      onConfirm(previewAddress);
      onClose();
    } else {
      alert('Silakan klik lokasi di peta terlebih dahulu.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '90vh' }}>
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Pilih Lokasi di Peta</h3>
              <p className="text-xs text-gray-500">Klik atau geser pin untuk menentukan alamat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Gunakan Lokasi Saya Button */}
        <div className="px-5 pt-3 pb-2">
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-60"
          >
            {isLocating ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {isLocating ? 'Mencari lokasi Anda...' : 'Gunakan Lokasi Saya (GPS)'}
          </button>
        </div>

        {/* Map */}
        <div className="flex-1 mx-5 rounded-xl overflow-hidden border border-gray-200" style={{ height: '340px' }}>
          <MapContainer
            center={[markerPos.lat, markerPos.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onLocationSelect={handleLocationSelect} />
            <DraggableMarker position={[markerPos.lat, markerPos.lng]} onDragEnd={handleLocationSelect} />
          </MapContainer>
        </div>

        {/* Address Preview */}
        <div className="mx-5 mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[52px] flex items-start gap-2">
          {isGeocoding ? (
            <svg className="animate-spin h-4 w-4 text-emerald-500 mt-0.5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
          <p className="text-xs text-gray-600 leading-relaxed">
            {previewAddress || 'Klik pada peta atau geser pin untuk mendapatkan alamat otomatis.'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!previewAddress || isGeocoding}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Gunakan Alamat Ini
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main CheckoutPage ─────────────────────────────────────────────────────────
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
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle | processing | success
  const [errors, setErrors] = useState({});
  const [isMapOpen, setIsMapOpen] = useState(false);

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

  const handleAddressFromMap = (address) => {
    setForm((prev) => ({ ...prev, address }));
    if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
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

      localStorage.setItem('udinfresh_user_phone', form.phone);
      selectedItems.forEach((item) => cartActions.removeItem(item.cartItemId));

      setPaymentStatus('processing');

      setTimeout(async () => {
        try {
          await fetch(`${API_URL}/api/pesanan/${data.id_pesanan}/bayar`, { method: 'PUT' });
          setPaymentStatus('success');
          setTimeout(() => {
            navigate('/pesanan');
            setIsSubmitting(false);
          }, 1500);
        } catch (e) {
          console.error(e);
          navigate('/pesanan');
          setIsSubmitting(false);
        }
      }, 2000);

    } catch (err) {
      alert(`Gagal: ${err.message}`);
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

      {/* Map Modal */}
      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onConfirm={handleAddressFromMap}
      />

      {/* Body */}
      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto px-4 py-5 md:py-6 grid grid-cols-1 md:grid-cols-[1fr_380px] gap-4 md:gap-6 items-start">

          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-4">

            {/* Data Diri */}
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-sm font-bold text-gray-800">Data Diri</h2>
              </div>

              <div className="px-5 py-4 space-y-4">
                {/* Row: Nama Lengkap + Nama Toko */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Nama Lengkap <span className="text-red-500">*</span>
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
                      Nama Toko <span className="text-gray-400 font-normal">(Opsional)</span>
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

                {/* Nomor Telepon */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Nomor Telepon <span className="text-red-500">*</span>
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

                {/* Alamat Lengkap */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-600">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    {/* Tombol Pilih dari Peta */}
                    <button
                      type="button"
                      onClick={() => setIsMapOpen(true)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 active:scale-95 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Pilih dari Peta
                    </button>
                  </div>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Klik 'Pilih dari Peta' atau ketik manual: Jl. Nama Jalan No. xx, Kelurahan, Kecamatan, Kota"
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none ${
                      errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                  )}
                  {form.address && (
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Alamat berhasil diisi
                    </p>
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
                    <div key={method.id} className="py-2">
                      <label
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
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${isActive ? 'rotate-90 text-emerald-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </label>

                      {/* Payment Method Details Expand */}
                      {isActive && (
                        <div className="pl-14 pr-3 py-4 text-sm bg-emerald-50/40 rounded-b-lg -mx-3 -mt-2 mb-1 border-t border-emerald-100/50">
                          {method.id === 'transfer_bank' && (
                            <div className="space-y-3">
                              <p className="font-semibold text-emerald-800">Transfer ke salah satu rekening berikut:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                                  <p className="font-bold text-gray-800 flex justify-between">BCA <span className="font-mono text-emerald-700">1234567890</span></p>
                                  <p className="text-xs text-gray-500 mt-1">a.n. Udin Fresh</p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                                  <p className="font-bold text-gray-800 flex justify-between">Mandiri <span className="font-mono text-emerald-700">0987654321</span></p>
                                  <p className="text-xs text-gray-500 mt-1">a.n. Udin Fresh</p>
                                </div>
                              </div>
                            </div>
                          )}
                          {method.id === 'qris' && (
                            <div className="flex flex-col items-center justify-center space-y-3 py-2">
                              <p className="font-semibold text-emerald-800">Scan QR Code ini untuk membayar:</p>
                              <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm inline-block">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QRIS UdinFresh" className="w-40 h-40 object-contain mx-auto" />
                              </div>
                              <p className="text-xs text-emerald-600/80 text-center max-w-xs">Buka aplikasi e-wallet (OVO, GoPay, Dana) atau m-banking Anda, lalu scan QR di atas.</p>
                            </div>
                          )}
                          {method.id === 'cod' && (
                            <div className="bg-white p-3.5 rounded-lg border border-emerald-200 shadow-sm flex gap-3 items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                Anda akan membayar secara tunai kepada kurir saat pesanan tiba di alamat Anda. Mohon siapkan uang pas sebesar <span className="font-bold text-emerald-700">Rp {totalPayment.toLocaleString('id-ID')}</span>.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
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

      {/* Interactive Payment Modal */}
      {paymentStatus !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center shadow-2xl transform transition-all duration-300 scale-100 opacity-100">
            {paymentStatus === 'processing' ? (
              <>
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Memproses Pembayaran</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Mohon tunggu sebentar, sistem sedang memverifikasi pembayaran Anda secara otomatis...
                </p>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-500 scale-in-center shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Pembayaran Berhasil!</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-1">
                  Pesanan Anda telah dibayar dan kini masuk ke antrean.
                </p>
                <p className="text-emerald-600 font-bold text-sm">
                  Status: Menunggu Konfirmasi Admin
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
