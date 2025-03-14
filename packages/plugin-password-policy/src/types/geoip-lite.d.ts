declare module 'geoip-lite' {
  export interface GeoData {
    range: [number, number];
    country: string;
    region: string;
    eu: '0' | '1';
    timezone: string;
    city: string;
    ll: [number, number]; // 经纬度
    metro: number;
    area: number;
  }

  export function lookup(ip: string): GeoData | null;
}
