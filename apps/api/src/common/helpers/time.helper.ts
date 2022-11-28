/**
 * Prases a string duration in the format of HH:MM:SS
 * @return {hours: number, minutes: number, seconds: number} An object containing the parsed time.
 */
 export const parseStringDuration = (duration: string) => {
  const [hours, minutes, seconds] = duration.split(':');
  return { hours: +hours, minutes: +minutes, seconds: +seconds };
};

/**
 * Prases a string duration in the format of millisecond
 * @returns The milliseconds of the parsed time.
 */
export const parseStringDurationInMilli = (duration: string) => {
  const [hours, minutes, seconds] = duration.split(':');
  let milliseconds = 0;

  console.log(hours);

  if (+hours) milliseconds += +hours * 3600000;
  if (+minutes) milliseconds += +minutes * 60000 ;
  if (+seconds) milliseconds += +seconds * 1000;

  return milliseconds;
};
