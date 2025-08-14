export const toLocalDateTimeStr = (timestamp: string, timeZone = 'America/Los_Angeles') => {
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

export const toLocalTimeStr = (value: string) => {
  // const timeZone = 'UTC';
  const timeZone = 'America/Los_Angeles';
  return (new Date(Number(value)).toLocaleTimeString('en-US', {timeZone: timeZone, timeStyle: 'short'}));
}

export const textAlignRight = (params: any) => {
    if (parseFloat(params.value)) {
        return 'MuiDataGrid-cell--textRight'
    }
    return '';
  }