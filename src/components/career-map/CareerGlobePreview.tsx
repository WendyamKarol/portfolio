'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import {
  buildSideTripsGeoJSON,
  buildSpineRouteGeoJSON,
  getStepColor,
  getSortedSteps,
} from '@/lib/career-journey';
import { getConfig } from '@/lib/config-loader';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

export default function CareerGlobePreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const config = getConfig();
    const journey = config.careerJourney;
    if (!journey) return;

    const steps = getSortedSteps(journey);

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: journey.map.style,
      projection: 'globe',
      center: journey.map.idleCenter,
      zoom: 1.35,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on('load', () => {
      map.setFog({
        color: 'rgb(12, 18, 32)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(8, 10, 18)',
        'star-intensity': 0.35,
      });

      map.addSource('teaser-spine', {
        type: 'geojson',
        data: buildSpineRouteGeoJSON(steps),
      });
      map.addLayer({
        id: 'teaser-spine-line',
        type: 'line',
        source: 'teaser-spine',
        paint: {
          'line-color': '#F4821E',
          'line-width': 2,
          'line-opacity': 0.75,
        },
      });

      map.addSource('teaser-side', {
        type: 'geojson',
        data: buildSideTripsGeoJSON(steps),
      });
      map.addLayer({
        id: 'teaser-side-line',
        type: 'line',
        source: 'teaser-side',
        paint: {
          'line-color': '#F4821E',
          'line-width': 2,
          'line-opacity': 0.55,
          'line-dasharray': [2, 2],
        },
      });

      steps.forEach((step) => {
        const el = document.createElement('div');
        el.style.cssText = `
          width:10px;height:10px;border-radius:50%;
          background:${getStepColor(step)};
          box-shadow:0 0 8px ${getStepColor(step)}88;
        `;
        new mapboxgl.Marker({ element: el })
          .setLngLat([step.lng, step.lat])
          .addTo(map);
      });

      let bearing = 0;
      const spin = () => {
        bearing += 0.08;
        map.setBearing(bearing);
        frameRef.current = requestAnimationFrame(spin);
      };
      frameRef.current = requestAnimationFrame(spin);
    });

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <Link
      href="/journey"
      className="group relative block h-72 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-xl md:h-80"
      aria-label="Open interactive career map"
    >
      <div ref={containerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="pointer-events-none absolute bottom-3 left-0 right-0 text-center">
        <span className="rounded-full bg-black/50 px-3 py-1 text-xs text-white/90 backdrop-blur-sm">
          Tap to explore · interactive globe
        </span>
      </div>
    </Link>
  );
}
