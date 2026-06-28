maptilersdk.config.apiKey = mapToken; // mapToken ejs file se aa raha hoga

const map = new maptilersdk.Map({
  container: 'map', // Jis div mein map dikhana hai uska ID
  style: maptilersdk.MapStyle.STREETS,
  center: listing.geometry.coordinates, // Starting position [lng, lat]
  zoom: 9 // Starting zoom level
});

// Map par marker lagane ke liye
const marker = new maptilersdk.Marker({ color: "#fe424d" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new maptilersdk.Popup({offset: 25})
  .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`))
  .addTo(map);