const moment = require('moment');
require('moment-timezone'); // Moment-Timezone extends the moment object

export function getDateTimePST() {
  const pacificTimeZone = 'America/Los_Angeles';
  // Get the current time in Pacific Time
  const pacificTimeMoment = moment().tz(pacificTimeZone);
  const formattedPacificTime24h = pacificTimeMoment.format('YYYY-MM-DD HH:mm');

  console.log(`Current Pacific Time (YYYY-MM-DD HH:mm): ${formattedPacificTime24h}`);
  return formattedPacificTime24h;
}
