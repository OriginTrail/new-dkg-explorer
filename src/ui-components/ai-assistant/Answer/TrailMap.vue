<template>
  <div class="map-container" :id="mapId"></div>
</template>

<script>
import L from "leaflet";
import stopPin from "../../../../public/images/chatdkg/icons/stop-pin.svg";
export default {
  name: "TrailMap",
  props: {
    coordinates: {
      required: true,
      type: Array,
    },
    stops: {
      type: Array,
      default: () => [],
    },
    mapId: {
      type: String,
      default: "map",
    },
    initialZoom: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom: this.initialZoom ?? 5,
      center: this.stops[0] ?? [44.728047, 20.525627],
      map: null,
    };
  },
  mounted() {
    const map = L.map(this.mapId, {
      attributionControl: false,
      zoomControl: false,
    }).setView(this.center, this.zoom);
    this.map = map;
    L.tileLayer(
      "https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",
    ).addTo(map);

    const polyline = L.polyline(this.coordinates, {
      color: "#0E3FE5",
      dashArray: "5, 5",
    }).addTo(map);

    // zoom the map to the polyline
    if (this.coordinates?.length >= 2) {
      map.fitBounds(polyline.getBounds());
    }
    //add zoom control in desired position
    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(map);
    const stopIcon = L.icon({
      iconRetinaUrl: stopPin,
      iconUrl: stopPin,
      tooltipAnchor: [11, 11],
      iconSize: [22, 22],
    });
    this.stops.forEach((stop) => {
      L.marker(stop, {
        icon: stopIcon,
      }).addTo(map);
    });
  },
};
</script>

<style scoped></style>
