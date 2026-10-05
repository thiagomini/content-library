const publishedAtFormat = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
});

export function formatPublishedAt(publishedAt: string): string {
    return publishedAtFormat.format(parseCalendarDay(publishedAt));
}

function parseCalendarDay(isoDate: string): Date {
    return new Date(`${isoDate}T00:00:00`);
}
