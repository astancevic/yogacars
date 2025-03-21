/**
 * Format a number as currency (USD)
 * @param value Number to format
 * @returns Formatted currency string
 */
export function formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) {
        return 'Call for Price';
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}