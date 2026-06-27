const key = mapToken;

const map = new maplibregl.Map({
  container: 'map', // container id
  style: `https://api.maptiler.com/maps/streets-v4/style.json?key=${key}`, // style URL
  center: [73.0479, 33.6844], // starting position [lng, lat] (Islamabad, PK)
  zoom: 9 // starting zoom
});