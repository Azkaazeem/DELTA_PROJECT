maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
  container: 'map', // EJS mein div ki ID
  style: maptilersdk.MapStyle.STREETS,
  center: coordinates, // EJS se aane walay coordinates
  zoom: 9 
});

// Map ke upar Red Marker lagane ke liye
const marker = new maptilersdk.Marker({ color: "#fe424d" })
  .setLngLat(coordinates)
  .addTo(map);