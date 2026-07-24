-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 24, 2026 at 04:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_udinfresh`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL,
  `nama_admin` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id_admin`, `nama_admin`, `email`, `password`) VALUES
(1, 'yanzz', 'admin@udinfresh.com', '$2b$10$Qfv4qFfGstuvfzAdP8or3uwimZEdPyahWmjWyB9cEXXdb8HkoJyaG');

-- --------------------------------------------------------

--
-- Table structure for table `detail_pesanan`
--

CREATE TABLE `detail_pesanan` (
  `id_detail` int(11) NOT NULL,
  `id_pesanan` int(11) NOT NULL,
  `id_produk` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `subtotal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `detail_pesanan`
--

INSERT INTO `detail_pesanan` (`id_detail`, `id_pesanan`, `id_produk`, `jumlah`, `subtotal`) VALUES
(1, 4, 85, 2, 24000),
(2, 5, 86, 1, 12000),
(3, 6, 84, 1, 50000),
(4, 7, 86, 1, 12000),
(5, 8, 86, 1, 12000);

-- --------------------------------------------------------

--
-- Table structure for table `mobil`
--

CREATE TABLE `mobil` (
  `nopol` varchar(20) NOT NULL,
  `type_mobil` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mobil`
--

INSERT INTO `mobil` (`nopol`, `type_mobil`) VALUES
('B 1000 XC', 'Pick Up Carry'),
('B 1100 XC', 'Pick Up Carry'),
('B 1234 UDF', 'Box Carry'),
('B 7890 UDF', 'Pick Up Carry'),
('B 9012 UDF', 'Blind Van GranMax'),
('D 3456 UDF', 'Box Engkel'),
('D 5678 UDF', 'Pick Up L300');

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id_pembayaran` int(11) NOT NULL,
  `tanggal_bayar` datetime DEFAULT current_timestamp(),
  `total_bayar` int(11) NOT NULL,
  `id_pesanan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pembayaran`
--

INSERT INTO `pembayaran` (`id_pembayaran`, `tanggal_bayar`, `total_bayar`, `id_pesanan`) VALUES
(1, '2026-07-22 22:49:30', 12000, 5),
(2, '2026-07-22 23:56:56', 50000, 6),
(3, '2026-07-24 19:26:40', 12000, 7),
(4, '2026-07-24 20:59:20', 12000, 8);

-- --------------------------------------------------------

--
-- Table structure for table `pembeli`
--

CREATE TABLE `pembeli` (
  `id_pembeli` int(11) NOT NULL,
  `nama_pembeli` varchar(255) NOT NULL,
  `no_hp` varchar(20) NOT NULL,
  `nama_toko` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pembeli`
--

INSERT INTO `pembeli` (`id_pembeli`, `nama_pembeli`, `no_hp`, `nama_toko`) VALUES
(1, '', '', ''),
(2, 'Udin', '4324324', 'toko udin\r\n'),
(3, 'jbfdmn', '084343323232', 'fnbd f'),
(4, 'jhbjh', '08676756', 'nbhh'),
(5, 'cx', '084354343', 'cxc'),
(6, 'jfknsdf', '088764734367', 'fsnd'),
(7, 'fds', '08642673574', 'fds');

-- --------------------------------------------------------

--
-- Table structure for table `pesanan`
--

CREATE TABLE `pesanan` (
  `id_pesanan` int(11) NOT NULL,
  `tanggal_pesanan` datetime DEFAULT current_timestamp(),
  `status_pesanan` varchar(100) NOT NULL,
  `total_berat` decimal(10,2) NOT NULL,
  `id_pembeli` int(11) NOT NULL,
  `id_admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pesanan`
--

INSERT INTO `pesanan` (`id_pesanan`, `tanggal_pesanan`, `status_pesanan`, `total_berat`, `id_pembeli`, `id_admin`) VALUES
(1, '2026-06-20 01:07:47', 'Menunggu Konfirmasi', 15.00, 1, 1),
(2, '2026-06-20 18:05:43', 'Menunggu Konfirmasi', 15.00, 1, 1),
(3, '2026-06-20 23:47:31', 'Menunggu Konfirmasi', 15.00, 1, 1),
(4, '2026-07-22 12:58:17', 'Gagal Kirim', 1000.00, 3, NULL),
(5, '2026-07-22 22:49:26', 'Selesai', 500.00, 4, NULL),
(6, '2026-07-22 23:56:54', 'Selesai', 500.00, 5, NULL),
(7, '2026-07-24 19:26:38', 'Dibatalkan', 500.00, 6, NULL),
(8, '2026-07-24 20:59:18', 'Menunggu Konfirmasi', 500.00, 7, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `produk`
--

CREATE TABLE `produk` (
  `id_produk` int(11) NOT NULL,
  `nama_produk` varchar(255) NOT NULL,
  `harga` int(11) NOT NULL,
  `stok` int(11) NOT NULL,
  `berat` decimal(10,2) NOT NULL,
  `kategori` varchar(100) NOT NULL,
  `foto_produk` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`id_produk`, `nama_produk`, `harga`, `stok`, `berat`, `kategori`, `foto_produk`) VALUES
(15, 'Nanas Madu ', 10000, 100, 1000.00, 'Buah', '1782712319876-187366105.png'),
(16, 'Alpukat Mentega', 30000, 100, 1000.00, 'Buah', '1782712680482-45686413.png'),
(17, 'Pisang', 15000, 100, 1000.00, 'Buah', '1782712708811-520155982.jpg'),
(20, 'Sawi Hijau', 10000, 100, 500.00, 'Sayuran', '1782714078215-183299010.jpg'),
(21, 'Selada', 12000, 100, 500.00, 'Sayuran', '1782714111653-872500209.jpg'),
(22, 'Seledri', 8000, 100, 500.00, 'Sayuran', '1782714142777-85824954.jpg'),
(23, 'Terong Ungu', 12000, 100, 500.00, 'Sayuran', '1782714215689-950639752.jpg'),
(24, 'Tauge', 7000, 100, 500.00, 'Sayuran', '1782714257075-311810453.jpg'),
(25, 'Wortel', 14000, 100, 500.00, 'Sayuran', '1782714300672-860614822.jpg'),
(26, 'Brokoli', 20000, 100, 500.00, 'Sayuran', '1782714333123-1015017.jpg'),
(27, 'Buncis', 11000, 100, 500.00, 'Sayuran', '1782714391207-990325109.jpg'),
(28, 'Bayam', 8000, 100, 500.00, 'Sayuran', '1782714437560-483806792.jpg'),
(29, 'Kangkung', 7000, 100, 500.00, 'Sayuran', '1782714581805-808454905.jpg'),
(30, 'Kol / Kubis', 10000, 100, 500.00, 'Sayuran', '1782714615826-439986440.jpg'),
(31, 'Kentang', 15000, 100, 500.00, 'Sayuran', '1782714662162-214004938.png'),
(32, 'Bawang Merah', 25000, 100, 500.00, 'Sayuran', '1782714736032-432653327.jpg'),
(33, 'Bawang Bombay', 20000, 100, 500.00, 'Sayuran', '1782714765529-724421368.jpg'),
(34, 'Kunyit', 10000, 100, 500.00, 'Sayuran', '1782714808428-158560156.jpg'),
(35, 'Kelapa', 15000, 100, 500.00, 'Buah', '1782714911591-705634611.jpg'),
(36, 'Jahe', 18000, 1000, 5000.00, 'Sayuran', '1782715081464-445129230.jpg'),
(40, 'Alpukat', 25000, 100, 500.00, 'Buah', 'Alpukat.png'),
(41, 'Ikan Bawal', 35000, 100, 500.00, 'Seafood', 'bawal.jpg'),
(42, 'Bawang Bombay', 20000, 100, 500.00, 'Sayuran', 'bawang bombai.jpg'),
(43, 'Bawang Merah', 25000, 100, 500.00, 'Sayuran', 'bawang merah.jpg'),
(44, 'Bayam Hijau', 7000, 100, 500.00, 'Sayuran', 'bayam hijau.png'),
(45, 'Brokoli', 18000, 100, 500.00, 'Sayuran', 'brokoli.jpg'),
(46, 'Bulu Babi', 50000, 100, 500.00, 'Seafood', 'Bulu Babi.jpg'),
(47, 'Buncis', 10000, 100, 500.00, 'Sayuran', 'buncis.jpg'),
(48, 'Cabe Merah', 30000, 100, 500.00, 'Sayuran', 'cabe merah.png'),
(49, 'Cabe Hijau', 25000, 100, 500.00, 'Sayuran', 'cabe_hijau.jpg'),
(50, 'Cabe Keriting', 35000, 100, 500.00, 'Sayuran', 'cabe_keriting.jpg'),
(51, 'Cabe Rawit Merah', 40000, 100, 500.00, 'Sayuran', 'cabe_rawit_merah.jpg'),
(52, 'Cumi-Cumi', 45000, 100, 500.00, 'Seafood', 'cumi.jpg'),
(53, 'Daun Bawang', 8000, 100, 500.00, 'Sayuran', 'daun_bawang.jpg'),
(54, 'Ikan Gurame', 40000, 100, 500.00, 'Seafood', 'gurame.jpg'),
(55, 'Gurita', 60000, 100, 500.00, 'Seafood', 'gurita.jpg'),
(56, 'Ikan Kakap Merah', 55000, 100, 500.00, 'Seafood', 'ikan kakap merah.jpg'),
(57, 'Jagung', 9000, 100, 500.00, 'Sayuran', 'jagung.jpg'),
(58, 'Jahe', 15000, 100, 500.00, 'Sayuran', 'jahe.jpg'),
(59, 'Kacang Panjang', 8000, 100, 500.00, 'Sayuran', 'kacang_panjang.jpg'),
(60, 'Kacang Tanah', 14000, 100, 500.00, 'Sayuran', 'kacang_tanah.jpg'),
(61, 'Kangkung', 6000, 100, 500.00, 'Sayuran', 'kangkung.jpg'),
(62, 'Kelapa Tua', 10000, 100, 500.00, 'Buah', 'kelapa_tua.jpg'),
(63, 'Kentang', 16000, 100, 500.00, 'Sayuran', 'kentang.png'),
(64, 'Kepiting', 75000, 100, 500.00, 'Seafood', 'kepiting.jpg'),
(65, 'Kerang Hijau', 20000, 100, 500.00, 'Seafood', 'kerang ijo.jpg'),
(66, 'Kerang Darah', 25000, 100, 500.00, 'Seafood', 'kerang darah.jpg'),
(67, 'Kol', 9000, 100, 500.00, 'Sayuran', 'kol.jpg'),
(68, 'Kunyit', 10000, 100, 500.00, 'Sayuran', 'kunyit.jpg'),
(69, 'Lobster', 85000, 100, 500.00, 'Seafood', 'lobster.jpg'),
(70, 'Nanas', 12000, 100, 500.00, 'Buah', 'nanas.png'),
(71, 'Tiram (Oyster)', 65000, 100, 500.00, 'Seafood', 'oyster.jpg'),
(72, 'Pisang', 15000, 100, 500.00, 'Buah', 'pisang.jpg'),
(73, 'Ikan Salmon', 120000, 100, 500.00, 'Seafood', 'salmon.jpg'),
(74, 'Sawi Hijau', 8000, 100, 500.00, 'Sayuran', 'sawi_hijau.jpg'),
(75, 'Selada Keriting', 12000, 100, 500.00, 'Sayuran', 'selada keriting.jpg'),
(76, 'Seledri', 7000, 100, 500.00, 'Sayuran', 'seledri.jpg'),
(77, 'Sereh', 6000, 100, 500.00, 'Sayuran', 'sereh.jpg'),
(78, 'Sotong', 45000, 100, 500.00, 'Seafood', 'sotong.jpg'),
(79, 'Terong Ungu', 10000, 100, 500.00, 'Sayuran', 'terong_ungu.jpg'),
(80, 'Toge', 6000, 100, 500.00, 'Sayuran', 'toge.jpg'),
(81, 'Tomat', 14000, 100, 500.00, 'Sayuran', 'tomat.png'),
(82, 'Tomat Cherry', 22000, 100, 500.00, 'Sayuran', 'tomat_cherry.png'),
(83, 'Ikan Tuna', 70000, 100, 500.00, 'Seafood', 'tuna.jpg'),
(84, 'Udang', 50000, 100, 500.00, 'Seafood', 'udang.jpg'),
(85, 'Wortel Jpg', 12000, 100, 500.00, 'Sayuran', 'wortel.jpg'),
(86, 'Wortel Png', 12000, 100, 500.00, 'Sayuran', 'wortel.png');

-- --------------------------------------------------------

--
-- Table structure for table `supir`
--

CREATE TABLE `supir` (
  `id_supir` int(11) NOT NULL,
  `nama_supir` varchar(255) NOT NULL,
  `nopol` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supir`
--

INSERT INTO `supir` (`id_supir`, `nama_supir`, `nopol`, `password`) VALUES
(1, 'Ahmad Supardi', 'B 1234 UDF', '$2b$10$THEZjA14YPCrwhDu8Q3yqulonXxIKCe1waZZNo6AnOUXfkpWgVzaW'),
(2, 'Budi Santoso', 'D 5678 UDF', '$2b$10$THEZjA14YPCrwhDu8Q3yqulonXxIKCe1waZZNo6AnOUXfkpWgVzaW'),
(3, 'Candra Wijaya', 'B 9012 UDF', '$2b$10$THEZjA14YPCrwhDu8Q3yqulonXxIKCe1waZZNo6AnOUXfkpWgVzaW'),
(4, 'Deni Kurniawan', 'D 3456 UDF', '$2b$10$THEZjA14YPCrwhDu8Q3yqulonXxIKCe1waZZNo6AnOUXfkpWgVzaW'),
(5, 'Eko Prasetyo', 'B 7890 UDF', '$2b$10$THEZjA14YPCrwhDu8Q3yqulonXxIKCe1waZZNo6AnOUXfkpWgVzaW'),
(6, 'Ahmad Supardi', 'B 1234 UDF', '$2b$10$THEZjA14YPCrwhDu8Q3yqulonXxIKCe1waZZNo6AnOUXfkpWgVzaW'),
(7, 'Budi Santoso', 'D 5678 UDF', '$2b$10$THEZjA14YPCrwhDu8Q3yqulonXxIKCe1waZZNo6AnOUXfkpWgVzaW'),
(8, 'Candra Wijaya', 'B 9012 UDF', '$2b$10$THEZjA14YPCrwhDu8Q3yqulonXxIKCe1waZZNo6AnOUXfkpWgVzaW'),
(9, 'Deni Kurniawan', 'D 3456 UDF', '$2b$10$THEZjA14YPCrwhDu8Q3yqulonXxIKCe1waZZNo6AnOUXfkpWgVzaW'),
(10, 'Asep Baharudin', 'B 1000 XC', '$2b$10$THEZjA14YPCrwhDu8Q3yqulonXxIKCe1waZZNo6AnOUXfkpWgVzaW'),
(11, 'Eko Prasetyo', 'B 7890 UDF', '$2b$10$THEZjA14YPCrwhDu8Q3yqulonXxIKCe1waZZNo6AnOUXfkpWgVzaW');

-- --------------------------------------------------------

--
-- Table structure for table `surat_jalan`
--

CREATE TABLE `surat_jalan` (
  `id_surat_jalan` int(11) NOT NULL,
  `id_admin` int(11) DEFAULT NULL,
  `id_pesanan` int(11) NOT NULL,
  `id_supir` int(11) NOT NULL,
  `no_surat_jalan` varchar(50) NOT NULL,
  `tanggal_dibuat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `surat_jalan`
--

INSERT INTO `surat_jalan` (`id_surat_jalan`, `id_admin`, `id_pesanan`, `id_supir`, `no_surat_jalan`, `tanggal_dibuat`) VALUES
(1, 1, 6, 1, 'SJ/2026/07/001', '2026-07-23 21:51:21'),
(2, 1, 5, 1, 'SJ/2026/07/001', '2026-07-24 20:36:12'),
(3, 1, 4, 1, 'SJ/2026/07/001', '2026-07-24 20:37:19'),
(4, 1, 7, 1, 'SJ/2026/07/001', '2026-07-24 20:38:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  ADD PRIMARY KEY (`id_detail`),
  ADD KEY `id_produk` (`id_produk`),
  ADD KEY `id_pesanan` (`id_pesanan`);

--
-- Indexes for table `mobil`
--
ALTER TABLE `mobil`
  ADD PRIMARY KEY (`nopol`);

--
-- Indexes for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id_pembayaran`),
  ADD KEY `id_pesanan` (`id_pesanan`);

--
-- Indexes for table `pembeli`
--
ALTER TABLE `pembeli`
  ADD PRIMARY KEY (`id_pembeli`);

--
-- Indexes for table `pesanan`
--
ALTER TABLE `pesanan`
  ADD PRIMARY KEY (`id_pesanan`),
  ADD KEY `id_pembeli` (`id_pembeli`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id_produk`);

--
-- Indexes for table `supir`
--
ALTER TABLE `supir`
  ADD PRIMARY KEY (`id_supir`),
  ADD KEY `nopol` (`nopol`);

--
-- Indexes for table `surat_jalan`
--
ALTER TABLE `surat_jalan`
  ADD PRIMARY KEY (`id_surat_jalan`),
  ADD KEY `id_admin` (`id_admin`),
  ADD KEY `fk_sj_pesanan` (`id_pesanan`),
  ADD KEY `fk_sj_supir` (`id_supir`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  MODIFY `id_detail` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id_pembayaran` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pembeli`
--
ALTER TABLE `pembeli`
  MODIFY `id_pembeli` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id_pesanan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `produk`
--
ALTER TABLE `produk`
  MODIFY `id_produk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `supir`
--
ALTER TABLE `supir`
  MODIFY `id_supir` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `surat_jalan`
--
ALTER TABLE `surat_jalan`
  MODIFY `id_surat_jalan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  ADD CONSTRAINT `fk_detail_pesanan` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan` (`id_pesanan`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detail_produk` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan` (`id_pesanan`);

--
-- Constraints for table `pesanan`
--
ALTER TABLE `pesanan`
  ADD CONSTRAINT `pesanan_ibfk_1` FOREIGN KEY (`id_pembeli`) REFERENCES `pembeli` (`id_pembeli`),
  ADD CONSTRAINT `pesanan_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admin` (`id_admin`);

--
-- Constraints for table `supir`
--
ALTER TABLE `supir`
  ADD CONSTRAINT `supir_ibfk_1` FOREIGN KEY (`nopol`) REFERENCES `mobil` (`nopol`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `surat_jalan`
--
ALTER TABLE `surat_jalan`
  ADD CONSTRAINT `fk_sj_pesanan` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan` (`id_pesanan`),
  ADD CONSTRAINT `fk_sj_supir` FOREIGN KEY (`id_supir`) REFERENCES `supir` (`id_supir`),
  ADD CONSTRAINT `surat_jalan_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `admin` (`id_admin`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
