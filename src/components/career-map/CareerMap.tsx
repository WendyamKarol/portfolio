'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  buildProgressRouteGeoJSON,
  buildSideTripsGeoJSON,
  buildSpineRouteGeoJSON,
  getStepColor,
  interpolateLngLat,
  buildAnimationPath,
} from '@/lib/career-journey';
import { FLY_TO_DURATION_MS, INTRO_ROTATION_MS } from '@/lib/career-map-constants';
import {
  createAvatarMarker,
  createStepMarkerElement,
} from '@/components/career-map/CareerMapAvatar';
import { buildCareerMapPopupHtml } from '@/components/career-map/CareerMapPopup';
import type { PlayerMode } from '@/components/career-map/useCareerPlayer';
import type { CareerJourney, CareerStep, Locale } from '@/types/portfolio';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';

interface Props {
  journey: CareerJourney;
  steps: CareerStep[];
  currentIndex: number;
  mode: PlayerMode;
  locale: Locale;
  avatarMarkerSrc: string;
  avatarMarkerFallback: string;
  onIntroDone: () => void;
  onStepMarkerClick: (index: number) => void;
  onOpenDetail?: (index: number) => void;
  fullScreen?: boolean;
}

export default function CareerMap({
  journey,
  steps,
  currentIndex,
  mode,
  locale,
  avatarMarkerSrc,
  avatarMarkerFallback,
  onIntroDone,
  onStepMarkerClick,
  onOpenDetail,
  fullScreen = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const avatarMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const stepMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const introStartedRef = useRef(false);
  const avatarAtIndexRef = useRef(-1);
  const reducedMotionRef = useRef(false);

  const onIntroDoneRef = useRef(onIntroDone);
  const onStepMarkerClickRef = useRef(onStepMarkerClick);
  const onOpenDetailRef = useRef(onOpenDetail);
  onIntroDoneRef.current = onIntroDone;
  onStepMarkerClickRef.current = onStepMarkerClick;
  onOpenDetailRef.current = onOpenDetail;

  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
  }, []);

  const cancelAvatarAnimation = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const closePopup = useCallback(() => {
    popupRef.current?.remove();
    popupRef.current = null;
  }, []);

  const attachPopupHandlers = useCallback(
    (popup: mapboxgl.Popup, stepIndex: number) => {
      const openDetail = () => {
        onOpenDetailRef.current?.(stepIndex);
      };

      const root = popup.getElement();
      if (!root || root.dataset.detailHandlers === 'true') return;
      root.dataset.detailHandlers = 'true';

      root.addEventListener('click', (e) => e.stopPropagation());

      const inner = root.querySelector('.career-map-popup__inner');
      const btn = root.querySelector('.career-map-popup__detail-btn');

      btn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openDetail();
      });

      inner?.addEventListener('click', (e) => {
        if (e.target === btn || btn?.contains(e.target as Node)) return;
        openDetail();
      });

      inner?.addEventListener('keydown', (e) => {
        if (!(e instanceof KeyboardEvent)) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail();
        }
      });
    },
    [],
  );

  const showPopupForStep = useCallback(
    (step: CareerStep, map: mapboxgl.Map, stepIndex: number) => {
      closePopup();
      const isMobile = window.innerWidth < 640;
      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: 'min(320px, 90vw)',
        anchor: isMobile ? 'bottom' : 'left',
        offset: isMobile ? [0, -28] : [24, 0],
        className: 'career-map-popup',
      })
        .setLngLat([step.lng, step.lat])
        .setHTML(buildCareerMapPopupHtml(step, locale))
        .addTo(map);

      popupRef.current = popup;
      attachPopupHandlers(popup, stepIndex);
    },
    [closePopup, locale, attachPopupHandlers],
  );

  const flyToStep = useCallback((step: CareerStep, map: mapboxgl.Map) => {
    map.flyTo({
      center: [step.lng, step.lat],
      zoom: step.type === 'education' ? 10 : 11,
      pitch: reducedMotionRef.current ? 0 : 45,
      bearing: 0,
      duration: reducedMotionRef.current ? 0 : FLY_TO_DURATION_MS,
      essential: true,
    });
  }, []);

  const animateAvatarBetween = useCallback(
    (
      from: CareerStep,
      to: CareerStep,
      toIndex: number,
      durationMs: number,
      commitIndex = true,
    ): Promise<void> => {
      return new Promise((resolve) => {
        const marker = avatarMarkerRef.current;
        if (!marker) {
          resolve();
          return;
        }

        if (reducedMotionRef.current) {
          marker.setLngLat([to.lng, to.lat]);
          if (commitIndex) avatarAtIndexRef.current = toIndex;
          resolve();
          return;
        }

        cancelAvatarAnimation();
        const start = performance.now();

        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const [lng, lat] = interpolateLngLat(from, to, eased);
          marker.setLngLat([lng, lat]);
          if (t < 1) {
            animFrameRef.current = requestAnimationFrame(tick);
          } else {
            animFrameRef.current = null;
            if (commitIndex) avatarAtIndexRef.current = toIndex;
            resolve();
          }
        };
        animFrameRef.current = requestAnimationFrame(tick);
      });
    },
    [cancelAvatarAnimation],
  );

  const placeAvatarAtStep = useCallback(
    (step: CareerStep, index: number) => {
      const marker = avatarMarkerRef.current;
      if (!marker) return;
      marker.setLngLat([step.lng, step.lat]);
      avatarAtIndexRef.current = index;
    },
    [],
  );

  const getPath = useCallback(
    (fromIndex: number, toIndex: number) =>
      buildAnimationPath(steps, fromIndex, toIndex),
    [steps],
  );

  const animateAvatarAlongPath = useCallback(
    async (path: CareerStep[], finalIndex: number, totalDurationMs: number) => {
      if (path.length < 2) {
        if (path[0]) placeAvatarAtStep(path[0], finalIndex);
        return;
      }

      const segmentDuration = totalDurationMs / (path.length - 1);
      for (let i = 1; i < path.length; i++) {
        const isLast = i === path.length - 1;
        await animateAvatarBetween(
          path[i - 1],
          path[i],
          finalIndex,
          segmentDuration,
          isLast,
        );
      }
    },
    [animateAvatarBetween, placeAvatarAtStep],
  );

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!mapboxgl.accessToken) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: journey.map.style,
      projection: 'globe',
      center: journey.map.idleCenter,
      zoom: journey.map.idleZoom,
      pitch: 0,
      bearing: 0,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      if (fullScreen) {
        map.setFog({
          color: 'rgb(12, 18, 32)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(8, 10, 18)',
          'star-intensity': 0.35,
        });
      }

      map.addSource('route-spine', {
        type: 'geojson',
        data: buildSpineRouteGeoJSON(steps),
      });
      map.addLayer({
        id: 'route-spine-line',
        type: 'line',
        source: 'route-spine',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#8899AA', 'line-width': 2, 'line-opacity': 0.25 },
      });

      map.addSource('route-side', {
        type: 'geojson',
        data: buildSideTripsGeoJSON(steps),
      });
      map.addLayer({
        id: 'route-side-line',
        type: 'line',
        source: 'route-side',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#8899AA',
          'line-width': 2,
          'line-opacity': 0.35,
          'line-dasharray': [2, 2],
        },
      });

      map.addSource('route-progress-spine', {
        type: 'geojson',
        data: buildProgressRouteGeoJSON(steps, 0).spine,
      });
      map.addLayer({
        id: 'route-progress-spine-line',
        type: 'line',
        source: 'route-progress-spine',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 3,
          'line-opacity': 0.9,
        },
      });

      map.addSource('route-progress-side', {
        type: 'geojson',
        data: buildProgressRouteGeoJSON(steps, 0).side,
      });
      map.addLayer({
        id: 'route-progress-side-line',
        type: 'line',
        source: 'route-progress-side',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 3,
          'line-opacity': 0.85,
          'line-dasharray': [2, 2],
        },
      });

      const avatarEl = createAvatarMarker(avatarMarkerSrc, avatarMarkerFallback, 48);
      avatarEl.style.zIndex = '20';
      avatarEl.style.position = 'relative';

      avatarMarkerRef.current = new mapboxgl.Marker({
        element: avatarEl,
        anchor: 'center',
        pitchAlignment: 'map',
        rotationAlignment: 'map',
      })
        .setLngLat(journey.map.idleCenter)
        .addTo(map);

      stepMarkersRef.current = steps.map((step, index) => {
        const el = createStepMarkerElement(getStepColor(step), false, false);
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onStepMarkerClickRef.current(index);
        });
        return new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([step.lng, step.lat])
          .addTo(map);
      });

      map.on('click', () => closePopup());

      setMapReady(true);
    });

    return () => {
      cancelAvatarAnimation();
      closePopup();
      stepMarkersRef.current.forEach((m) => m.remove());
      avatarMarkerRef.current?.remove();
      map.remove();
      mapRef.current = null;
      setMapReady(false);
      introStartedRef.current = false;
      avatarAtIndexRef.current = -1;
    };
  }, [
    journey.map.style,
    journey.map.idleCenter,
    journey.map.idleZoom,
    steps,
    avatarMarkerSrc,
    avatarMarkerFallback,
    fullScreen,
    cancelAvatarAnimation,
    closePopup,
  ]);

  // Update route progress + step marker styles
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    const progress = buildProgressRouteGeoJSON(steps, currentIndex);
    const spineSrc = map.getSource('route-progress-spine') as mapboxgl.GeoJSONSource | undefined;
    const sideSrc = map.getSource('route-progress-side') as mapboxgl.GeoJSONSource | undefined;
    spineSrc?.setData(progress.spine);
    sideSrc?.setData(progress.side);

    stepMarkersRef.current.forEach((marker, index) => {
      const step = steps[index];
      const isActive = index === currentIndex;
      const isPast = index < currentIndex;
      const el = marker.getElement();
      el.style.width = isActive ? '16px' : isPast ? '12px' : '10px';
      el.style.height = el.style.width;
      el.style.background = isActive || isPast ? getStepColor(step) : '#8899AA';
      el.style.border = isActive ? '2px solid #fff' : '2px solid transparent';
      el.style.boxShadow = isActive ? `0 0 0 3px ${getStepColor(step)}55` : 'none';
    });
  }, [mapReady, currentIndex, steps]);

  // Rebuild popup HTML when locale changes
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map || mode === 'idle' || mode === 'intro') return;
    const step = steps[currentIndex];
    if (step && popupRef.current) {
      showPopupForStep(step, map, currentIndex);
    }
  }, [locale, mapReady, mode, currentIndex, steps, showPopupForStep]);

  // Avatar movement + camera — runs when map is ready
  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map || steps.length === 0) return;

    let cancelled = false;

    const run = async () => {
      if (mode === 'idle') {
        cancelAvatarAnimation();
        closePopup();
        introStartedRef.current = false;
        avatarAtIndexRef.current = -1;
        avatarMarkerRef.current?.setLngLat(journey.map.idleCenter);
        return;
      }

      const step = steps[currentIndex];
      if (!step) return;

      if (mode === 'intro' && !introStartedRef.current) {
        introStartedRef.current = true;
        if (reducedMotionRef.current) {
          flyToStep(steps[0], map);
          placeAvatarAtStep(steps[0], 0);
          onIntroDoneRef.current();
          return;
        }
        map.rotateTo(15, { duration: INTRO_ROTATION_MS });
        await new Promise((r) => window.setTimeout(r, INTRO_ROTATION_MS + 200));
        if (cancelled) return;
        flyToStep(steps[0], map);
        placeAvatarAtStep(steps[0], 0);
        onIntroDoneRef.current();
        return;
      }

      if (mode === 'intro') return;

      flyToStep(step, map);

      const fromIndex = avatarAtIndexRef.current;
      if (fromIndex >= 0 && fromIndex !== currentIndex) {
        const path = getPath(fromIndex, currentIndex);
        const hopCount = Math.max(1, path.length - 1);
        await animateAvatarAlongPath(
          path,
          currentIndex,
          journey.map.segmentDurationMs * hopCount,
        );
      } else if (fromIndex !== currentIndex) {
        placeAvatarAtStep(step, currentIndex);
      }

      if (cancelled) return;
      showPopupForStep(step, map, currentIndex);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [
    mapReady,
    currentIndex,
    mode,
    steps,
    journey,
    avatarMarkerSrc,
    avatarMarkerFallback,
    flyToStep,
    getPath,
    animateAvatarAlongPath,
    placeAvatarAtStep,
    cancelAvatarAnimation,
    closePopup,
    showPopupForStep,
  ]);

  return (
    <div className={`relative h-full w-full ${fullScreen ? '' : 'min-h-[320px]'}`}>
      <div ref={containerRef} className={`h-full w-full ${fullScreen ? '' : 'rounded-xl'}`} />
      {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/80 p-4 text-center text-sm text-white">
          Set NEXT_PUBLIC_MAPBOX_TOKEN in .env to enable the map.
        </div>
      )}
    </div>
  );
}
