'use client';

export function createAvatarMarker(
  src: string,
  fallback: string,
  size = 48,
): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'career-map-avatar';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', 'Career journey marker');
  el.style.cssText = `
    width:${size}px;height:${size}px;border-radius:50%;
    border:3px solid #fff;box-shadow:0 0 0 4px rgba(244,130,30,0.35);
    overflow:hidden;background:#1B2A3D;cursor:pointer;
  `;
  const img = document.createElement('img');
  img.src = src;
  img.alt = '';
  img.draggable = false;
  img.style.cssText =
    'width:100%;height:100%;object-fit:cover;object-position:center top;display:block;';
  img.onerror = () => {
    img.src = fallback;
  };
  el.appendChild(img);
  return el;
}

export function createStepMarkerElement(
  color: string,
  isActive: boolean,
  isPast: boolean,
): HTMLDivElement {
  const el = document.createElement('div');
  const size = isActive ? 16 : isPast ? 12 : 10;
  el.style.cssText = `
    width:${size}px;height:${size}px;border-radius:50%;
    background:${isActive ? color : isPast ? color : '#8899AA'};
    border:2px solid ${isActive ? '#fff' : 'transparent'};
    box-shadow:${isActive ? `0 0 0 3px ${color}55` : 'none'};
    cursor:pointer;transition:all 0.2s;
  `;
  return el;
}
