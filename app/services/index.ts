export function getDayOfWeekFromUTC(timecode: number, offset: number): string {
    const utcMilliseconds = timecode * 1000; // Convert seconds to milliseconds
    const offsetMilliseconds = offset * 1000; // Convert hours to milliseconds
    const date = new Date(utcMilliseconds + offsetMilliseconds);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[date.getUTCDay()];
  
    return dayOfWeek;
  }

  export function getDateFromUTC(timecode: number, offset: number): Date {
    const utcMilliseconds = timecode * 1000; // Convert seconds to milliseconds
    const offsetMilliseconds = offset * 1000; // Convert hours to milliseconds
  
    const date = new Date(utcMilliseconds + offsetMilliseconds);
    return date;
  }