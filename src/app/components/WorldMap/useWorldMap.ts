import { useEffect, useRef } from 'react';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

function toThreeDigits(number: number): string {
  if (number < 10) {
    return `00${number}`;
  }
  if (number < 100) {
    return `0${number}`;
  }
  return `${number}`;
}

const worldCRS = leaflet.extend({}, leaflet.CRS.Simple, {
  transformation: new leaflet.Transformation(1 / 16, 0, -1 / 16, 0),
});

const WorldTiles = leaflet.TileLayer.extend({
  getTileUrl(coords: { x: number; y: number; z: number }) {
    const zoom = 8 - coords.z - 1;
    const multiplicators = [1, 2, 4, 8, 16, 32, 64];
    const x = coords.x * multiplicators[zoom - 1];
    const y = (-coords.y - 1) * multiplicators[zoom - 1];

    if (x < 0 || y < 0 || y >= 64 || x >= 64) {
      return '/map/empty.webp';
    }
    // return `/map/map_l1_y000_x024.webp`;
    return `/map/map_l${zoom}_y${toThreeDigits(y)}_x${toThreeDigits(x)}.webp`;
  },
  getTileSize() {
    return { x: 1024, y: 1024 };
  },
});

function useWorldMap(): {
  elementRef: React.MutableRefObject<HTMLDivElement | null>;
  leafletMap: leaflet.Map | null;
} {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<leaflet.Map | null>(null);

  useEffect(() => {
    const mapElement = elementRef.current;
    if (!mapElement) {
      return;
    }

    const southWest = leaflet.latLng(0, 4000);
    const northEast = leaflet.latLng(10000, 14336);
    const bounds = leaflet.latLngBounds(southWest, northEast);
    const map = leaflet.map(mapElement, {
      crs: worldCRS,
      maxZoom: 6,
      minZoom: 0,
      attributionControl: false,
    });
    leafletMap.current = map;
    map.fitBounds(bounds);

    const divElement = leaflet.DomUtil.create('div');
    function handleMouseMove(event: leaflet.LeafletMouseEvent) {
      divElement.innerHTML = `<span>[${event.latlng.lng}, ${event.latlng.lat}]</span>`;
    }
    const CoordinatesControl = leaflet.Control.extend({
      onAdd(map: leaflet.Map) {
        map.on('mousemove', handleMouseMove);
        return divElement;
      },
      onRemove(map: leaflet.Map) {
        map.off('mousemove', handleMouseMove);
      },
    });

    const coordinates = new CoordinatesControl({ position: 'topright' });
    coordinates.addTo(map);

    const worldTiles = new WorldTiles();
    worldTiles.addTo(map);

    return () => {
      leafletMap.current = null;
      map.remove();
    };
  }, [elementRef]);

  return { elementRef, leafletMap: leafletMap.current };
}

export default useWorldMap;