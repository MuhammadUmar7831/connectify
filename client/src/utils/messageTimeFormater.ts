import { format, parseISO, differenceInCalendarDays, differenceInMonths, differenceInYears } from 'date-fns';

export default function formatTimestamp(timestamp: string | undefined | null): string | null {
    if (!timestamp) {
        return null;
    }
    const now = new Date();
    const date = parseISO(timestamp);

    const daysDifference = differenceInCalendarDays(now, date);
    const monthsDifference = differenceInMonths(now, date);
    const yearsDifference = differenceInYears(now, date);

    if (daysDifference === 0) {
        return format(date, 'hh:mm a'); // Format for today
    } else if (daysDifference === 1) {
        return 'Yesterday';
    } else if (daysDifference < 7) {
        return format(date, 'eeee'); // Day of the week for messages within a week
    } else if (daysDifference < 30) {
        return format(date, 'dd MMM'); // Day and month for messages within a month
    } else if (monthsDifference < 12) {
        if (monthsDifference === 1) {
            return 'a month ago';
        }
        return `${monthsDifference} months ago`;
    } else {
        if (yearsDifference === 1) {
            return 'a year ago';
        }
        return `${yearsDifference} years ago`;
    }
}
