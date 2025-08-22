export const toLocalDateTimeStr = (timestamp: string | Date, timeZone = 'America/Los_Angeles') => {
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

    if (typeof timestamp === 'string') {
      return new Date(timestamp).toLocaleString('en-US', options);
    } else if (timestamp instanceof Date) {
      return timestamp.toLocaleString('en-US', options);
    }
}

export const toRfc3339Str = (date: Date) => {
  return date.toISOString().replace('.000', '');
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

/**
 * Increment a date by multiple units.
 * @param date - original Date object
 * @param increments - object with optional days, hours, minutes, seconds, milliseconds
 * @returns new Date object
 */
export const addToDate = (
  date: Date,
  increments: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
  }
): Date => {
  const copy = new Date(date.getTime()); // copy original date

  if (increments.days) copy.setDate(copy.getDate() + increments.days);
  if (increments.hours) copy.setHours(copy.getHours() + increments.hours);
  if (increments.minutes) copy.setMinutes(copy.getMinutes() + increments.minutes);
  if (increments.seconds) copy.setSeconds(copy.getSeconds() + increments.seconds);
  if (increments.milliseconds) copy.setMilliseconds(copy.getMilliseconds() + increments.milliseconds);

  return copy;
}

export const parseCSV = (csvText: string) => {
  const lines = csvText.trim().split('\n');
  const headers = lines.shift()?.split(',') ?? [];
  return lines.map(line => {
      const values = line.split(',');

      // open
      values[0] = parseFloat(values[0]);
      // high
      values[1] = parseFloat(values[1]);
      // low
      values[2] = parseFloat(values[2]);
      // close
      values[3] = parseFloat(values[3]);
      // totalvolume
      values[4] = parseInt(values[4]);

      return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
  });
}