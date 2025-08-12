export const toLocalTime = (timestamp, timeZone = 'America/Los_Angeles') => {
    const options = {
        timeZone: timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    };

    const localTimeStamp = new Date(timestamp).toLocaleString('en-US', options);
    return localTimeStamp;
}