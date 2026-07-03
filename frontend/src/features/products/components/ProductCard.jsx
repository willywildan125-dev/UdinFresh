import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function ProductCard({ product }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      {/* Area Gambar (Sementara kita pakai Emoji besar sebagai ganti foto) */}
      <div className="w-full h-48 bg-emerald-50 flex items-center justify-center text-7xl border-b border-gray-100">
        {product.icon}
      </div>
      
      {/* Area Detail Produk */}
      <div className="p-4 flex flex-col grow">
        <h3 className="font-bold text-gray-800 text-lg line-clamp-1" title={product.name}>
          {product.name}
        </h3>
        <p className="text-emerald-600 font-extrabold mt-1 text-lg">
          Rp {product.price.toLocaleString('id-ID')}<span className="text-sm font-normal text-gray-500">/{product.unit}</span>
        </p>
        
        <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 mb-5">
          <span className="text-yellow-400">⭐</span>
          <span className="font-medium text-gray-700">{product.rating}</span>
          <span>({product.reviews} ulasan)</span>
        </div>
        
        {/* Tombol selalu di bawah berkat flex-grow & mt-auto */}
        <div className="mt-auto">
          <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white">
            + Keranjang
          </Button>
        </div>
      </div>
    </Card>
  );
}