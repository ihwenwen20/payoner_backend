// # 1
function orderId() {
	// Mendapatkan timestamp saat ini dalam milidetik
	const timestamp = Date.now();

	// Nomor acak (dalam hal ini, angka acak antara 100 dan 999)
	const randomNum = Math.floor(Math.random() * 900) + 100;

	// Kode unik
	const uniqueCode = "ABC"; // Ganti dengan kode unik yang sesuai

	// Membuat order_id dengan format yang diinginkan
	const order_id = `INV-${timestamp}-${randomNum}-${uniqueCode}`;

	console.log(order_id); // Output: INV-1693419265771-ABC

}

// # 2
// Simpan nomor urutan terakhir
// let lastOrderNumber = 0; // Misalnya mulai dari 0

function generateOrderID(prefix, uniqueCode) {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	// Meningkatkan nomor urutan setiap kali membuat order_id
	lastOrderNumber++;

	// Menggabungkan tanggal, kode unik, dan nomor urutan
	const orderID = `${prefix}-${year}${day}${month}-${uniqueCode}${lastOrderNumber}`;

	return orderID;
}

const uniqueCode = "ABC"; // Ganti dengan kode unik yang sesuai
// const orderID = generateOrderID("INV", uniqueCode);

console.log(orderID); // Contoh output: INV-20230831-ABC1


// # 3
let lastOrderNumber = 923001254;
function generateOrderID(prefix) {
    lastOrderNumber++;
    // Menggabungkan nomor urutan dengan preix
    const orderNumber = String(lastOrderNumber).padStart(9, '0');
    const orderID = `${prefix}-${orderNumber}`;

    return orderID;
}

// const orderID = generateOrderID("INV");

console.log(orderID); // Contoh output: INV-923001255


// # 4
// Fungsi untuk menghasilkan angka dengan leading zeroes
function generatePaddedNumber(number, length) {
	return String(number).padStart(length, '0');
}

// Contoh input dari form body
const orderNumber = 1; // Ganti dengan angka urutan yang sesuai
const locationCode = "TGR"; // Ganti dengan kode lokasi yang sesuai
const secondOrderNumber = 1; // Ganti dengan angka urutan kedua yang sesuai

// Membuat order_id dengan format yang diinginkan
const orderID = `${generatePaddedNumber(orderNumber, 3)}-${locationCode}-${generatePaddedNumber(secondOrderNumber, 5)}`;

console.log(orderID); // Contoh output: 001-TGR-00001

