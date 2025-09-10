export const toLocalDateTimeStr = (timestamp: string | Date, timezone: string) => {
    const options = {
        timeZone: timezone,
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

export const toLocalTimeStr = (value: number, timezone: string) => {
  return (new Date(Number(value)).toLocaleTimeString('en-US', {timeZone: timezone, timeStyle: 'short'}));
}

export const getTzLabel = (timezone: string) => timezone.split('/')[1].replace('_', ' ');


export const textAlignRight = (params: any) => {
  if (parseFloat(params.value)) {
      return 'MuiDataGrid-cell--textRight'
  }
  return '';
}

export const orderStatusMap = {
  'FLL': 'Filled'
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
  const lines = csvText.trim().split('\r');
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
       // timestamp
      values[5] = values[5];

      const result = Object.fromEntries(headers.map((h, i) => [h, values[i]]));
      return result;
  });
}

const getSundaysInMonth = (date: Date) => {
  const sundays = [];
  const year = date.getFullYear();
  const month = date.getMonth();
  const dayPointer = new Date(year, month, 1);

  while (dayPointer.getMonth() === month) {
    if (dayPointer.getDay() === 0) {
      sundays.push(dayPointer.getDate());
    }
    dayPointer.setDate(dayPointer.getDate() + 1);
  }

  return sundays;
}

export const isDST = (date = new Date()) => {
  const localDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const month = localDate.getMonth() + 1;
  const day = localDate.getDate();
  const sundays = getSundaysInMonth(localDate);

  const dstMap: {[key: number]: boolean} = {
    1: false,
    2: false,
    3: day >= sundays[1],
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: day < sundays[0],
    12: false
  };

  return dstMap[month];
}