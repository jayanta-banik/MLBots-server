import moment from 'moment-timezone';

export function parseDateOfBirth({ value }) {
  if (!value) return null;

  const m = moment(value, 'YYYY-MM-DD', true); // strict parsing

  if (!m.isValid()) return null;

  return m.toDate(); // JS Date object
}

export function utcTimestamp() {
  return moment().utc().toDate();
}

export function getMonthName(monthNumber) {
  return moment()
    .month(monthNumber - 1)
    .format('MMMM');
}
