import { KAABA_COORDS } from "@/core/constants";

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number): number {
  return (value * 180) / Math.PI;
}

export function normalizeDegrees(value: number): number {
  return (value + 360) % 360;
}

export function getQiblaBearing(lat: number, lng: number): number {
  const lat1 = toRadians(lat);
  const lat2 = toRadians(KAABA_COORDS.lat);
  const deltaLng = toRadians(KAABA_COORDS.lng - lng);

  const y = Math.sin(deltaLng);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(deltaLng);

  return normalizeDegrees(toDegrees(Math.atan2(y, x)));
}

export function relativeNeedleRotation(bearingToKaaba: number, heading: number): number {
  return normalizeDegrees(bearingToKaaba - heading);
}
