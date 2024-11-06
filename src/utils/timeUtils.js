export const timeFormatter = (examTime, examDate, duration) => {
	// Convert examTime from "hh:mm am/pm" format to a 24-hour format for Date parsing
	const [time, modifier] = examTime.split(' ');
	let [hours, minutes] = time.split(':').map(Number);
	if (modifier.toLowerCase() === 'pm' && hours !== 12) hours += 12;
	if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;

	// Create a Date object for the start time by combining examDate and adjusted startTime
	const startDateTime = new Date(
		`${formatDate(examDate)}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00Z`
	);

	// Determine duration in hours, defaulting to 3 if not provided
	const calculatedDuration = duration || 3;
	const endDateTime = new Date(
		startDateTime.getTime() + calculatedDuration * 60 * 60 * 1000
	);

	// Format endDateTime to "hh:mm am/pm" for easy readability, if needed
	let endHours = endDateTime.getUTCHours();
	const endMinutes = endDateTime.getUTCMinutes();
	const endModifier = endHours >= 12 ? 'pm' : 'am';
	endHours = endHours % 12 || 12; // Convert to 12-hour format
	const formattedEndTime = `${endHours}:${endMinutes.toString().padStart(2, '0')} ${endModifier}`;

	// Return start and end times in Date format (for Mongoose) and formatted time
	return {
		startDateTime, // Date object for start time (suitable for Mongoose)
		endDateTime, // Date object for end time (suitable for Mongoose)
		formattedEndTime, // Readable formatted time string
	};
};

const formatDate = (date) => {
	const [year, month, day] = date.split('-').map(Number);
	return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};
