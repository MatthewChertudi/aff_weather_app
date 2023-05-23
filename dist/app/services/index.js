"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateFromUTC = exports.getDayOfWeekFromUTC = void 0;
function getDayOfWeekFromUTC(timecode, offset) {
    const utcMilliseconds = timecode * 1000; // Convert seconds to milliseconds
    const offsetMilliseconds = offset * 1000; // Convert hours to milliseconds
    const date = new Date(utcMilliseconds + offsetMilliseconds);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[date.getUTCDay()];
    return dayOfWeek;
}
exports.getDayOfWeekFromUTC = getDayOfWeekFromUTC;
function getDateFromUTC(timecode, offset) {
    const utcMilliseconds = timecode * 1000; // Convert seconds to milliseconds
    const offsetMilliseconds = offset * 1000; // Convert hours to milliseconds
    const date = new Date(utcMilliseconds + offsetMilliseconds);
    return date;
}
exports.getDateFromUTC = getDateFromUTC;
