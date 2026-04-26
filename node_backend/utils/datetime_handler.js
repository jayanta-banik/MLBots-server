import moment from 'moment-timezone';

export function parseDateOfBirth(value) {
  if (typeof value !== 'string') return value;

  const trimmedValue = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) return Number.NaN;

  const parsedDate = new Date(`${trimmedValue}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) return Number.NaN;

  return parsedDate;
}

export function utcTimestamp() {
  return moment().utc().toDate();
}

export function getMonthName(monthNumber) {
  return moment()
    .month(monthNumber - 1)
    .format('MMMM');
}
