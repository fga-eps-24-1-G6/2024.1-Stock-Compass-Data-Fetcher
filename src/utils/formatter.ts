export function formatDate(dateString: string): string | null {
    const dateParts = dateString.split('/');

    if (dateParts.length !== 3) {
        return null;
    }

    const year = parseInt(dateParts[2], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[0], 10);

    try {
        const date = new Date(year, month, day);
        return date.toISOString().split('T')[0];
    } catch (error) {
        return null;
    }
}