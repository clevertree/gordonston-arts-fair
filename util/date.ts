export function getTimeSpan(startDate: Date, endDate: Date) {
    const diffMilliseconds = endDate.getTime() - startDate.getTime();

    // Calculate total days
    const totalDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));

    // Calculate months (approximate, as months have varying days)
    const months = Math.floor(totalDays / 30.44); // Average days in a month

    // Calculate remaining days after accounting for full months
    const remainingDaysAfterMonths = totalDays % 30.44;

    // Calculate weeks from remaining days
    const weeks = Math.floor(remainingDaysAfterMonths / 7);

    // Calculate remaining days after accounting for full weeks
    const days = Math.floor(remainingDaysAfterMonths % 7);

    let result = [];
    if (months > 0) {
        result.push(`${months} month${months !== 1 ? 's' : ''}`);
    }
    if (weeks > 0) {
        result.push(`${weeks} week${weeks !== 1 ? 's' : ''}`);
    }
    if (days > 0 || result.length === 0) { // Include days even if zero if no other units
        result.push(`${days} day${days !== 1 ? 's' : ''}`);
    }
    return result.join(', ');
}

export function formatToLocal(date: Date, options: Intl.DateTimeFormatOptions = {}) {
    return date.toLocaleDateString('EN', {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        ...options
    });
}
