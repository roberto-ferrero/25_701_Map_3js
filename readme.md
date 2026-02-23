## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```


## PandoraMap.init
Initialize the map with:

```js
window.PandoraMap.init({ ...config })
```

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `$container` | `HTMLElement` | Yes | Container where WebGL is rendered. |
| `$mouseEvents` | `HTMLElement` | Yes | Element used to listen to pointer/wheel interactions. |
| `debug` | `boolean` | No | Enables debug/tracing behavior. |
| `loader_pathPrefix` | `string` | Yes | Base path for assets (`glbs/`, `img/`, etc.). |
| `cities_dataPath` | `string` | Yes | Path to cities JSON data. |
| `shops_dataPath` | `string` | Yes | Path to shops JSON data. |
| `events_dataPath` | `string` | Yes | Path to events JSON data. |
| `settings` | `object` | No | Runtime tuning values (drag factors, scales, opacities, tier scale factors). |
| `onInit` | `() => void` | Yes | Called when intro finishes and app is ready. |
| `onZoomChange` | `(zoomLevel: number) => void` | Yes | Called when zoom changes. |
| `onTierChange` | `(tierLevel: number) => void` | Yes | Called when tier mode changes (1, 2, 3). |
| `onMarkerClicked` | `(type: "city" | "shop" | "event", id: number | string) => void` | Yes | Called when a marker click is confirmed. |

Notes:
- In current implementation callbacks are called directly (without null checks), so define all 4 callbacks.
- `init` returns `window.platform` (Platform instance).

### Settings:
`drag_factors`: For each zoom level: Corrections to dragging so draged item adjusts to mouse/finger position.
`shop_scales`: For each zoom level: Multiplier to the base scale of shops. 0 = hidden.
`city_scale_factor`: Multiplier to the base scale of cities.
`event_scale_factor`: Multiplier to the base scale of events.
`shop_scale_factor`: Multiplier to the base scale of shops.
`city_opacity_factor`: Multiplier to the base opacity of cities.
`shop_opacity_factor`: Multiplier to the base opacity of shops.
`event_opacity_factor`: Multiplier to the base opacity of events.
`tier_T_in_zoom_Z_scale_factor`: Multiplier to the city scale based in the tier (T) and zoom level (Z)


### Callback Events
Callbacks provided in `init`:

```js
window.PandoraMap.init({
  onInit: () => {}, // Called when intro finishes and app is ready.
  onZoomChange: (zoomLevel) => {}, // Called when zoom changes.
  onTierChange: (tierLevel) => {}, // Called when tier mode changes (1, 2, 3).
  onMarkerClicked: (type, id) => {} // Called when a marker click is confirmed. type: {city, shop, event}
})
```

### Emitter Events
After `init`, you can subscribe to internal events using:

```js
window.platform.webglApp.emitter.on(eventName, handler)
```

Supported event names and payloads:

| Event | Payload |
|---|---|
| `onCityClicked` | `{ id }` |
| `onShopClicked` | `{ id }` |
| `onEventClicked` | `{ id }` |
| `onAppZoomChange` | `{ zoom, doZoomingAnim }` |
| `onAppTierModeChange` | `{ tier }` |

Example:

```js
window.platform.webglApp.emitter.on("onCityClicked", (data) => {
  console.log("City clicked:", data.id)
})
```
