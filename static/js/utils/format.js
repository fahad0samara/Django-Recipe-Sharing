// Formatting utilities
export const format = {
    date: (date) => new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date)),
    
    number: (num) => new Intl.NumberFormat('en-US').format(num),
    
    duration: (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours ? `${hours}h ${mins}m` : `${mins}m`;
    }
};