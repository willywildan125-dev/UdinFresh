/**
 * Tabel dasar untuk halaman admin (Pesanan Masuk, dll).
 *
 * Contoh pakai:
 *   <Table
 *     columns={['Order ID', 'Tanggal', 'Pelanggan', 'Status']}
 *     data={orders}
 *     renderRow={(order) => (
 *       <>
 *         <td>{order.id}</td>
 *         <td>{order.date}</td>
 *         <td>{order.customer}</td>
 *         <td><Badge>{order.status}</Badge></td>
 *       </>
 *     )}
 *   />
 */
export default function Table({ columns = [], data = [], renderRow, emptyMessage = 'Tidak ada data.' }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id ?? idx} className="hover:bg-gray-50">
                {renderRow(row)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
