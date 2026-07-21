import React, { useState, useEffect } from 'react';

export default function AdminDataProdukPage() {
  const [products, setProducts] = useState([]);
  
  const [formData, setFormData] = useState({
    nama_produk: '',
    harga: '',
    stok: '',
    berat: '',
    kategori: 'Sayuran'
  });
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // State untuk mode edit
  const [editingId, setEditingId] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/produk');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error("Gagal memuat produk:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const handleEditClick = (product) => {
    setEditingId(product.id_produk);
    setFormData({
      nama_produk: product.nama_produk,
      harga: product.harga,
      stok: product.stok,
      berat: product.berat,
      kategori: product.kategori
    });
    setFoto(null); // Reset file input karena opsional
    setMessage({ type: '', text: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ nama_produk: '', harga: '', stok: '', berat: '', kategori: 'Sayuran' });
    setFoto(null);
    // Remove setMessage from here so it doesn't overwrite success messages
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.nama_produk || !formData.harga || !formData.stok || !formData.berat || (!foto && !editingId)) {
      setMessage({ type: 'error', text: 'Semua field wajib diisi' + (!editingId ? ' dan foto wajib dilampirkan!' : '!') });
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('nama_produk', formData.nama_produk);
    data.append('harga', formData.harga);
    data.append('stok', formData.stok);
    data.append('berat', formData.berat);
    data.append('kategori', formData.kategori);
    if (foto) {
      data.append('foto_produk', foto);
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/produk/${editingId}`
        : 'http://localhost:5000/api/produk';

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        body: data,
      });

      const responseText = await response.text();
      console.log('Raw Server Response:', responseText);
      const result = JSON.parse(responseText);

      if (response.ok && result.success) {
        handleCancelEdit();
        setMessage({ type: 'success', text: editingId ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!' });
        fetchProducts();
      } else {
        setMessage({ type: 'error', text: result.message || 'Gagal menyimpan produk.' });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setMessage({ type: 'error', text: 'Terjadi kesalahan koneksi ke server.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/produk/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      
      if (response.ok && result.success) {
        if (editingId === id) handleCancelEdit();
        fetchProducts(); // Refresh after delete
      } else {
        alert(result.message || 'Gagal menghapus produk');
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Kesalahan koneksi ke server.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Data Produk</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola katalog produk UdinFresh.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Create/Edit Product */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-1 h-fit">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-gray-800">
              {editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h2>
            {editingId && (
              <button onClick={handleCancelEdit} className="text-xs text-red-500 hover:text-red-700 font-semibold bg-red-50 px-2 py-1 rounded">
                Batal Edit
              </button>
            )}
          </div>
          
          {message.text && (
            <div className={`p-3 rounded-xl mb-4 text-sm font-semibold ${
              message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nama Produk</label>
              <input 
                type="text" 
                name="nama_produk"
                value={formData.nama_produk}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Misal: Tomat Ceri"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Harga (Rp)</label>
                <input 
                  type="number" 
                  name="harga"
                  value={formData.harga}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Stok (kg)</label>
                <input 
                  type="number" 
                  name="stok"
                  value={formData.stok}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Berat (gr)</label>
                <input 
                  type="number" 
                  name="berat"
                  value={formData.berat}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Kategori</label>
                <select 
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Sayuran">Sayuran</option>
                  <option value="Buah">Buah</option>
                  <option value="Daging">Daging</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Bumbu">Bumbu</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                Foto Produk {editingId && <span className="text-gray-400 font-normal lowercase">(Opsional, abaikan jika tidak diganti)</span>}
              </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-2.5 mt-2 rounded-xl text-sm font-bold text-white transition-all shadow-md ${
                loading ? 'bg-emerald-400 cursor-not-allowed' : (editingId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30')
              }`}
            >
              {loading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Simpan Produk')}
            </button>
          </form>
        </div>

        {/* Existing Products Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col overflow-hidden h-fit">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Daftar Produk</h2>
            <div className="relative">
              <input type="text" placeholder="Cari produk..." className="border border-gray-200 bg-gray-50 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              <svg className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto max-h-150 overflow-y-auto">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 h-full">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-700">Etalase Masih Kosong</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">Tambahkan produk baru melalui form di samping.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 font-semibold uppercase tracking-wider">Produk</th>
                    <th className="px-6 py-3 font-semibold uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 font-semibold uppercase tracking-wider">Harga</th>
                    <th className="px-6 py-3 font-semibold uppercase tracking-wider">Stok</th>
                    <th className="px-6 py-3 font-semibold uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id_produk} className={`hover:bg-gray-50 transition-colors ${editingId === p.id_produk ? 'bg-blue-50/50' : ''}`}>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img 
                          src={p.foto_produk ? `http://localhost:5000/images/${p.foto_produk}` : 'https://via.placeholder.com/40'} 
                          alt={p.nama_produk}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                        />
                        <span className="font-bold text-gray-800">{p.nama_produk}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-[10px] font-bold">{p.kategori}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600">Rp {p.harga.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{p.stok} kg</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => handleEditClick(p)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                          title="Edit Produk"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id_produk)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                          title="Hapus Produk"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
