export const timeFormatter = (examTime, examDate, duration) => {
	
	const [time, modifier] = examTime.split(' ');
	let [hours, minutes] = time.split(':').map(Number);
	if (modifier.toLowerCase() === 'pm' && hours !== 12) hours += 12;
	if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;

	
	const startDateTime = new Date(
		`${formatDate(examDate)}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00Z`
	);

	
	const calculatedDuration = duration || 3;
	const endDateTime = new Date(
		startDateTime.getTime() + calculatedDuration * 60 * 60 * 1000
	);


	let endHours = endDateTime.getUTCHours();
	const endMinutes = endDateTime.getUTCMinutes();
	const endModifier = endHours >= 12 ? 'pm' : 'am';
	endHours = endHours % 12 || 12; // Convert to 12-hour format
	const formattedEndTime = `${endHours}:${endMinutes.toString().padStart(2, '0')} ${endModifier}`;

	
	return {
		startDateTime, 
		endDateTime, 
		formattedEndTime, 
	};
};

const formatDate = (date) => {
	const [year, month, day] = date.split('-').map(Number);
	return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};
