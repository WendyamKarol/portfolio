import {
  getStepTypeLabel,
  resolveLocalized,
} from '@/lib/career-journey';
import type { CareerStep, Locale } from '@/types/portfolio';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildCareerMapPopupHtml(step: CareerStep, locale: Locale): string {
  const title = escapeHtml(resolveLocalized(step.title, locale));
  const org = escapeHtml(step.organization);
  const period = escapeHtml(step.period);
  const summary = escapeHtml(resolveLocalized(step.summary, locale));
  const skills = (step.recruiterSkills ?? []).slice(0, 3);
  const nested = step.nestedExperiences ?? [];

  const skillsHtml = skills
    .map(
      (skill) =>
        `<span class="career-map-popup__chip">${escapeHtml(skill)}</span>`,
    )
    .join('');

  const nestedHtml = nested
    .map((exp) => {
      const typeLabel = escapeHtml(getStepTypeLabel(exp.type, locale));
      const label = escapeHtml(resolveLocalized(exp.title, locale));
      const location = exp.location ? ` · ${escapeHtml(exp.location)}` : '';
      return `<li class="career-map-popup__nested-item">
        <span class="career-map-popup__nested-type">${typeLabel}</span>
        <span><strong>${escapeHtml(exp.period)}</strong> · ${label}${location}</span>
      </li>`;
    })
    .join('');

  const typeLabel = escapeHtml(getStepTypeLabel(step.type, locale));
  const detailCta =
    locale === 'fr' ? 'Voir le détail complet →' : 'View full details →';

  return `
    <div class="career-map-popup__inner career-map-popup__inner--clickable" role="button" tabindex="0">
      <p class="career-map-popup__type">${typeLabel}</p>
      <h3 class="career-map-popup__title">${title}</h3>
      <p class="career-map-popup__meta">${org} · ${period}</p>
      <p class="career-map-popup__summary">${summary}</p>
      ${skillsHtml ? `<div class="career-map-popup__skills">${skillsHtml}</div>` : ''}
      ${nestedHtml ? `<ul class="career-map-popup__nested">${nestedHtml}</ul>` : ''}
      <button type="button" class="career-map-popup__detail-btn">${escapeHtml(detailCta)}</button>
    </div>
  `;
}
