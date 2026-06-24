/// <reference types="google.maps" />
import { useEffect, useRef } from "react";
import { useGoogleMaps } from "@/lib/use-google-maps";

export type MapSalon = {
  id: string;
  name: string;
  area: string;
  lat: number;
  lon: number;
  rating: number;
  avgCost: number;
};

type Props = {
  center: { lat: number; lon: number };
  salons: MapSalon[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
};

export function SalonMap({ center, salons, activeId, onSelect }: Props) {
  const { ready, error } = useGoogleMaps();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const centerMarkerRef = useRef<google.maps.Marker | null>(null);

  // Init map
  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;
    mapRef.current = new google.maps.Map(containerRef.current, {
      center: { lat: center.lat, lng: center.lon },
      zoom: 12,
      disableDefaultUI: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#f5efe4" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#3a4a3a" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#fbf7ee" }] },
        { featureType: "water", stylers: [{ color: "#cfe0d4" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
      ],
    });
    infoRef.current = new google.maps.InfoWindow();
  }, [ready, center.lat, center.lon]);

  // Recentre when center changes
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.panTo({ lat: center.lat, lng: center.lon });
    if (centerMarkerRef.current) centerMarkerRef.current.setMap(null);
    centerMarkerRef.current = new google.maps.Marker({
      position: { lat: center.lat, lng: center.lon },
      map: mapRef.current,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 9,
        fillColor: "#b07a5e",
        fillOpacity: 1,
        strokeColor: "#fbf7ee",
        strokeWeight: 3,
      },
      title: "Your location",
      zIndex: 999,
    });
  }, [center.lat, center.lon, ready]);

  // Render salon markers
  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const map = mapRef.current;
    // Clear existing
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current.clear();

    salons.forEach((s) => {
      const marker = new google.maps.Marker({
        position: { lat: s.lat, lng: s.lon },
        map,
        title: s.name,
        label: {
          text: "♥",
          color: "#fbf7ee",
          fontSize: "14px",
          fontWeight: "700",
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: activeId === s.id ? "#3d5a3d" : "#2a3a2a",
          fillOpacity: 1,
          strokeColor: "#fbf7ee",
          strokeWeight: 2,
        },
      });
      marker.addListener("click", () => {
        infoRef.current?.setContent(
          `<div style="font-family:sans-serif;min-width:160px"><div style="font-weight:600;font-size:14px;color:#1f2a1f">${s.name}</div><div style="font-size:12px;color:#666;margin-top:2px">${s.area}</div><div style="font-size:12px;margin-top:6px">★ ${s.rating.toFixed(1)} · ₹${s.avgCost.toLocaleString("en-IN")} avg</div></div>`,
        );
        infoRef.current?.open(map, marker);
        onSelect?.(s.id);
      });
      markersRef.current.set(s.id, marker);
    });

    // Fit bounds
    if (salons.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: center.lat, lng: center.lon });
      salons.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lon }));
      map.fitBounds(bounds, 60);
    }
  }, [salons, activeId, onSelect, ready, center.lat, center.lon]);

  if (error) {
    return (
      <div className="grid h-full w-full place-items-center bg-beige text-sm text-muted-foreground p-6 text-center">
        Map could not load: {error}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-beige text-xs uppercase tracking-widest text-muted-foreground z-10">
          Loading map…
        </div>
      )}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
