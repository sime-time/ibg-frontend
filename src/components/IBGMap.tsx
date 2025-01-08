import { onMount, onCleanup } from "solid-js";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

export default function IBGMap() {
  let mapRef!: HTMLDivElement;
  let map: any;
  onMount(() => {
    map = L.map(mapRef).setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map)
      .bindPopup('A pretty CSS popup.<br> Easily customizable.')
      .openPopup();
  });

  return (
    <div ref={mapRef} aria-label="Gym location"></div>
  );
}
