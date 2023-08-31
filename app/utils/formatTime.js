function getFormattedLocalDateTime() {
	const now = new Date();

	// Array nama hari dalam Bahasa Inggris
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	// Array nama bulan dalam Bahasa Inggris
	const months = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	const dayName = days[now.getDay()];
	const day = now.getDate();
	const month = months[now.getMonth()];
	const year = now.getFullYear();

	const hours = now.getHours();
	const minutes = now.getMinutes();
	const seconds = now.getSeconds();

	// Format waktu dengan nol di depan jika kurang dari 10
	const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

	// Cara 1 akan menghasilkan format seperti ini: 'Wednesday, 30 August 2023, 1:46:32'
	const formattedDateTime = `${dayName}, ${day} ${month} ${year}, ${formattedTime}`;
	return formattedDateTime;

	// Cara 2 akan menghasilkan format seperti ini: 'Wednesday, 30/August/2023, 01:50:44'
	// const formattedDateTime = `${dayName}, ${day}/${month}/${year}, ${formattedTime}`;
	// return formattedDateTime;
}

const formattedDateTime = getFormattedLocalDateTime();
console.log(formattedDateTime);
