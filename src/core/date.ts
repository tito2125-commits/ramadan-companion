export function toISODate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function minutesFromTime(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function upcomingPrayerName(times: {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}): { name: string; time: string } {
  const entries: Array<{ name: string; time: string }> = [
    { name: "الفجر", time: times.fajr },
    { name: "الظهر", time: times.dhuhr },
    { name: "العصر", time: times.asr },
    { name: "المغرب", time: times.maghrib },
    { name: "العشاء", time: times.isha },
  ];

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const next = entries.find((entry) => minutesFromTime(entry.time) > currentMinutes);

  return next ?? entries[0];
}
