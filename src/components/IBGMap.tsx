import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onMount, createEffect } from "solid-js";

import markerIcon from "../../node_modules/leaflet/dist/images/marker-icon.png";
L.Marker.prototype.setIcon(L.icon({
  iconUrl: markerIcon
}));


export default function IBGMap() {
  let map: any;
  onMount(() => {
    map = L.map("ibg-map").setView([51.5, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // add a single marker to a layer. note it's in an array
    let markerLayer = L.layerGroup([
      L.marker([51.5, -0.09])
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup()
    ]);

  });

  return (
    <section class="bg-slate-950 py-16 px-8 md:px-16 flex justify-center">
      <div id="ibg-map" style="height:300px"></div>
    </section>
  );
}
