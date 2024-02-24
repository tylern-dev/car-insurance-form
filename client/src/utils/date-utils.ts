export function convertDateToString(date: Date) {
    if (!date) return;
    return new Date(date).toISOString().split('T')[0];
}
