export type Locality = {
  id: string;
  name: string;
  lat: number;
  lon: number;
};

export const MUMBAI_LOCALITIES: Locality[] = [
  { id: "bandra", name: "Bandra", lat: 19.0606, lon: 72.8362 },
  { id: "andheri", name: "Andheri", lat: 19.1197, lon: 72.8468 },
  { id: "juhu", name: "Juhu", lat: 19.1075, lon: 72.8263 },
  { id: "powai", name: "Powai", lat: 19.1197, lon: 72.9051 },
  { id: "dadar", name: "Dadar", lat: 19.018, lon: 72.8417 },
  { id: "worli", name: "Worli", lat: 19.0176, lon: 72.8118 },
  { id: "colaba", name: "Colaba", lat: 18.9176, lon: 72.8312 },
  { id: "borivali", name: "Borivali", lat: 19.2288, lon: 72.8568 },
  { id: "malad", name: "Malad", lat: 19.1849, lon: 72.8392 },
  { id: "kandivali", name: "Kandivali", lat: 19.2094, lon: 72.8526 },
  { id: "ghatkopar", name: "Ghatkopar", lat: 19.0858, lon: 72.9081 },
  { id: "chembur", name: "Chembur", lat: 19.0626, lon: 72.9006 },
  { id: "lower-parel", name: "Lower Parel", lat: 18.9967, lon: 72.8302 },
  { id: "navi-mumbai", name: "Navi Mumbai", lat: 19.033, lon: 73.0297 },
  { id: "thane", name: "Thane", lat: 19.2183, lon: 72.9781 },
  { id: "khar", name: "Khar West", lat: 19.0696, lon: 72.8331 },
  { id: "bkc", name: "Bandra Kurla Complex", lat: 19.0686, lon: 72.8688 },
  { id: "vile-parle", name: "Vile Parle", lat: 19.1003, lon: 72.8443 },
];

// Haversine distance in km
export function distanceKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}
