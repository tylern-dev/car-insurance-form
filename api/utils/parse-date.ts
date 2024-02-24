export function parseDate(dateString: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        console.error(`invalid date: ${dateString}`);
        return null;
    }
    return date;
}
