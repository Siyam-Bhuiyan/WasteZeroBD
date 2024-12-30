'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { OpenStreetMapProvider } from 'leaflet-geosearch'

const customIcon = new L.Icon({
  iconUrl: '/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: '/marker-shadow.png',
  shadowSize: [41, 41]
});

const LocationMarker = ({ onLocationFound }) => {
  const map = useMapEvents({
    locationfound(e) {
      onLocationFound(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    }
  });
  return null;
};

const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
};

const SearchResult = ({ searchResult, map }) => {
  useEffect(() => {
    if (searchResult && map) {
      map.flyTo([searchResult.y, searchResult.x], 16);
    }
  }, [searchResult, map]);
  return null;
};

interface MapComponentProps {
  position: [number, number] | null;
  onLocationFound: (latlng: { lat: number; lng: number }) => void;
  onMapClick: (latlng: { lat: number; lng: number }) => void;
  searchResult: any | null;
  mapRef: any;
}

export default function MapComponent({ 
  position, 
  onLocationFound, 
  onMapClick, 
  searchResult,
  mapRef 
}: MapComponentProps) {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      className="h-full w-full"
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker onLocationFound={onLocationFound} />
      <MapEvents onMapClick={onMapClick} />
      {position && (
        <Marker position={position} icon={customIcon} />
      )}
      {searchResult && (
        <SearchResult searchResult={searchResult} map={mapRef.current} />
      )}
    </MapContainer>
  );
}