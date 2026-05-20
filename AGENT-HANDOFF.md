# Agent Handoff — Portfolio Karol Naze (Career Map v2)

> Document de contexte pour reprendre le projet sans l'historique de conversation.
> **Dépôt :** `/home/karol-linux/projects/portfolio`
> **Live :** [karolnaze.dev](https://karolnaze.dev)
> **Dernière mise à jour doc :** 2026-05-20

---

## 1. Vue d'ensemble

Site portfolio **chat-first** (Next.js 15) où les visiteurs découvrent le profil de **Karol Naze** via un assistant IA. Tout le contenu est piloté par un seul fichier JSON : `portfolio-config.json`.

La fonctionnalité principale récemment développée est la **Career Map v2** : une carte Mapbox interactive à `/journey` qui raconte le parcours professionnel/académique en 8 étapes, avec animation d'un avatar (tête 3D), popups, timeline et panneau de détail.

Un **teaser** sur la homepage (`CareerMapTeaser`) mène vers `/journey`.

---

## 2. Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styles | Tailwind CSS v4, shadcn/ui, Radix UI, Framer Motion |
| Carte | Mapbox GL JS v3 (`mapbox-gl`) |
| IA chat | Vercel AI SDK + Google Gemini 1.5 Flash |
| Thème | `next-themes` |
| Analytics | Vercel Analytics |
| Config | `portfolio-config.json` (import statique via `config-loader.ts`) |

---

## 3. Commandes & environnement

```bash
cd /home/karol-linux/projects/portfolio
npm install
cp .env.example .env.local   # puis remplir les clés
npm run dev                  # http://localhost:3000
npm run build
npm run lint
```

### Variables d'environnement

| Variable | Usage |
|----------|-------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Chat IA (Gemini) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Carte Mapbox (homepage teaser + `/journey`) |

Sans token Mapbox, la carte ne s'affiche pas (token lu dans `CareerMap.tsx` et `CareerGlobePreview.tsx`).

---

## 4. Architecture des routes

| Route | Rôle | Thème |
|-------|------|-------|
| `/` | Homepage : chat, projets, skills, teaser Career Map | **Clair** (`defaultTheme="light"`) |
| `/journey` | Career Map plein écran | **Sombre forcé** via `journey/layout.tsx` (`className="dark"`) |
| `/api/chat` | Endpoint streaming Gemini + tools | — |

---

## 5. Career Map v2 — Concept narratif

### Modèle hub-and-spoke

- **Hub central :** `paris-studies` (École Denis Diderot, Paris Cité)
- **3 side-trips** (stages) partent du hub et **y reviennent** avant l'étape suivante :
  1. Créteil — EC Data (1ère année)
  2. Madrid — TYPSA (2ème année)
  3. Puteaux — CGI/EDF (3ème année)
- Puis **spine** continue : freelance Paris → Devoteam Puteaux

Les trajets hub ↔ stage sont en **ligne pointillée** sur la carte. Le spine principal (Ouaga → Fès → Paris → freelance → Devoteam) est en **ligne pleine**.

### Les 8 étapes (`careerJourney.steps`)

| order | id | type | sideTrip | Ville | Période |
|-------|-----|------|----------|-------|---------|
| 0 | `ouaga-bac` | education | — | Ouagadougou | 2016–2019 |
| 1 | `fez-insa` | education | — | Fès | 2019–2021 |
| 2 | `paris-studies` | education | — | Paris (hub) | 2021–2024 |
| 3 | `creteil-ecdata` | internship | ✅ | Créteil | Jul–Sep 2022 |
| 4 | `madrid-typsa` | internship | ✅ | Madrid | Jun–Sep 2023 |
| 5 | `puteaux-cgi` | internship | ✅ | Puteaux | Mar–Sep 2024 |
| 6 | `paris-freelance` | freelance | — | Paris | Sep 2024–Present |
| 7 | `puteaux-devoteam` | job | — | Puteaux | Jan 2026–Present |

### Champs importants d'une `CareerStep`

```typescript
interface CareerStep {
  id: string;
  order: number;
  type: 'education' | 'internship' | 'job' | 'freelance' | 'student_job';
  city: string;
  country: LocalizedString;  // { fr, en }
  lat: number;
  lng: number;
  period: string;
  title: LocalizedString;
  organization: string;
  summary: LocalizedString;
  detail: { description, highlights[], technologies?, images? };
  cvRef?: { section: 'education' | 'experience', index: number };
  sideTrip?: boolean;
  sideTripFromId?: string;      // ex: "paris-studies"
  returnsToHubId?: string;      // ex: "paris-studies"
  hideMarker?: boolean;
  nestedExperiences?: NestedExperience[];
  recruiterSkills?: string[];
  emoji?: string;               // NON UTILISÉ en prod (avatar image à la place)
}
```

### Jobs étudiants — hors map

**STAND UP** et **Compétences Tutorat** restent dans `experience[]` du CV (`portfolio-config.json`) mais **ne sont pas** des étapes de la Career Map (décision produit explicite).

---

## 6. Témoignages & PDFs

Config dans `careerJourney.testimonials[]`. Affichés dans `CareerStepDetail.tsx` (panneau détail).

### Type `Testimonial`

```typescript
interface Testimonial {
  id: string;
  stepId: string;           // id de l'étape liée
  quote: LocalizedString;   // peut être placeholder si documentUrl présent
  author: string;
  role: LocalizedString;
  company?: string;
  documentUrl?: string;     // PDF affiché en iframe
  documentLabel?: LocalizedString;
}
```

### Logique de visibilité (`src/lib/career-journey.ts`)

- `isPlaceholderQuote()` : détecte `[À compléter]` ou chaîne vide
- `isTestimonialVisible()` : visible si `documentUrl` **OU** quote non-placeholder
- `getTestimonialsForStep(journey, stepId)` : filtre par étape + visibilité

### Contenu actuel (2026-05-20)

| id | stepId | Type | Contenu |
|----|--------|------|---------|
| `testi-ecdata` | `creteil-ecdata` | PDF | `/recommendations/ecdata-stage-1a-2022.pdf` — Elie Chemaly, EC Data |
| `testi-typsa` | `madrid-typsa` | PDF | `/recommendations/stage-2a-2022-2023.pdf` — auteur générique « Grupo TYPSA » |
| `testi-cgi` | `puteaux-cgi` | LinkedIn | Rabeh BEL HADAOUI, Vice-Président CGI (FR + EN) |
| `testi-devoteam` | `puteaux-devoteam` | LinkedIn | Frederic Simons, Lean Startup/Devoteam (FR + EN) |

### Fichiers PDF sources (Windows → copiés en prod)

```
Source EC Data 1A:
  C:\Users\Samir Nazé\Documents\COURSES\EIDD 1A\STAGE\
  VF-Grille Evaluation rapport stage 1A-2021-2022-CDS - ECHEMALY 20220808[3996].pdf

Source stage 2A:
  C:\Users\Samir Nazé\Downloads\NAZE- Grille_evaluation_rapport_stage_2A_2022-2023.pdf

Copie WSL/portfolio:
  public/recommendations/ecdata-stage-1a-2022.pdf
  public/recommendations/stage-2a-2022-2023.pdf
```

**Décision produit :** les PDFs sont affichés **tels quels** (iframe), pas extraits en texte.

### Amélioration possible

- Remplacer l'auteur TYPSA par le nom exact lu sur le PDF (évaluateur stage)
- Ajouter photos d'étapes (`detail.images[]`) — discours major, stage TYPSA — « plus tard » selon Karol

---

## 7. Fichiers clés — Career Map

```
portfolio-config.json              # Source de vérité (steps, testimonials, map config)
src/types/portfolio.ts             # Types CareerStep, Testimonial, CareerJourney
src/lib/career-journey.ts          # GeoJSON, chemins animation, i18n, testimonials
src/lib/career-map-constants.ts    # Couleurs par type, durées, PLACEHOLDER_QUOTE
src/lib/config-loader.ts           # Charge portfolio-config.json

src/app/journey/
  page.tsx                         # Metadata SEO
  layout.tsx                       # Force dark theme
  JourneyView.tsx                  # Wrapper → CareerMapSection

src/components/career-map/
  CareerMapSection.tsx             # Orchestrateur principal (/journey)
  CareerMap.tsx                    # Mapbox : layers, avatar, popups, animation
  CareerMapAvatar.tsx              # createAvatarMarker() + step markers
  CareerMapPopup.tsx               # HTML popup + CTA "Voir le détail complet"
  CareerDetailSheet.tsx            # Sheet modal z-70 avec CareerStepDetail
  CareerStepDetail.tsx             # Description, highlights, tech, témoignages, PDF iframe
  CareerTimeline.tsx               # Dots cliquables en bas
  CareerPlayerControls.tsx         # Play/pause/restart/skip intro
  useCareerPlayer.ts               # State machine (reducer) du player
  CareerMapTeaser.tsx              # Section homepage → lien /journey
  CareerGlobePreview.tsx           # Globe Mapbox statique (teaser, non interactif)

  # CODE MORT (plus importé sur /journey) :
  CareerFloatingPanel.tsx
  CareerResumeSync.tsx
```

### Styles CSS

Popup et détail : `src/app/globals.css` (classes `.career-map-popup__*`).

---

## 8. Flux utilisateur `/journey`

```
idle → [Start] → intro (rotation globe) → playing
  → avatar anime hub→stage→hub entre étapes
  → popup Mapbox à l'arrivée sur une étape
  → clic popup / bouton → CareerDetailSheet (mode detail)
  → timeline : sélection directe d'une étape (paused)
  → fin → mode completed
```

### State machine (`useCareerPlayer.ts`)

Modes : `idle | intro | playing | paused | detail | completed`

Actions : `START`, `SKIP_INTRO`, `INTRO_DONE`, `PLAY`, `PAUSE`, `PREV`, `NEXT`, `RESTART`, `GO_TO_STEP`, `OPEN_DETAIL`, `CLOSE_DETAIL`, `COMPLETE`, `SET_LOCALE`

**Locale par défaut du player : `en`** (toggle FR/EN en header).

Raccourcis clavier : `Espace` play/pause, `←/→` étapes, `Escape` fermer détail.

---

## 9. Logique carte & animation

### GeoJSON (`career-journey.ts`)

| Fonction | Rôle |
|----------|------|
| `buildSpineRouteGeoJSON` | Ligne pleine entre étapes non-sideTrip |
| `buildSideTripsGeoJSON` | Aller + retour pointillés hub ↔ stage |
| `buildProgressRouteGeoJSON` | Segments colorés selon `currentIndex` |
| `resolveAnimationPath` | Waypoints entre deux indices (gère retour hub) |
| `buildAnimationPath` | Chemin complet multi-segments |
| `getTransitionHopCount` | Nombre de sauts pour calculer le délai auto-play |
| `interpolateLngLat` | Position avatar entre deux steps |

### Marqueur avatar

- Image : `careerJourney.avatarMarkerSrc` → `/avatar.png` (tête 3D)
- Fallback : `config.personal.fallbackAvatar`
- **Pas d'emojis Unicode** sur la carte (décision produit)

### Bug fix important (popup)

Les handlers du bouton « Voir le détail complet » sont attachés **immédiatement après** `popup.addTo(map)` dans `CareerMap.tsx` (pas via `popup.once('open')` qui causait une race condition).

---

## 10. Thème clair / sombre

| Zone | Comportement |
|------|--------------|
| Root `layout.tsx` | `ThemeProvider defaultTheme="light" enableSystem={false}` |
| `/journey/layout.tsx` | `<div className="dark min-h-[100dvh] bg-slate-950">` force le dark |
| Chat homepage | Avatar header en `sticky` (plus `fixed` global) — `src/components/chat/chat.tsx` |

---

## 11. Homepage & reste du site

```
src/app/page.tsx          # ProLanding + sections + CareerMapTeaser
src/components/chat/      # Interface chat IA
src/app/api/chat/         # route.ts, prompt.ts, tools/ (getResume, getProjects, etc.)
src/lib/config-parser.ts  # Génère prompts, preset replies depuis le JSON
```

Le chat utilise les tools pour lire CV, projets, skills, contact depuis `portfolio-config.json`.

---

## 12. Assets publics

```
public/
  avatar.png                    # Marqueur Career Map (tête 3D)
  profile.jpg, profile2.png
  Karol_Naze_resume.pdf
  karol_resume_preview.png
  recommendations/
    ecdata-stage-1a-2022.pdf
    stage-2a-2022-2023.pdf
  favicon.ico, manifest.json, robots.txt, sitemap.xml
```

---

## 13. État d'avancement & polish restant

### ✅ Fait

- 8 étapes hub-and-spoke
- Avatar image sur la carte
- Popups + detail sheet
- Timeline + auto-play
- Teaser homepage avec globe preview
- Témoignages LinkedIn (CGI, Devoteam)
- PDFs stages (EC Data, TYPSA) en iframe
- Thème clair accueil / sombre journey
- `npm run build` OK
- Jobs étudiants retirés de la map

### 🔧 Polish optionnel (non bloquant)

1. **Test manuel** complet mobile + desktop sur `/journey`
2. **Locale FR par défaut** dans `useCareerPlayer.ts` (actuellement `en`)
3. **Teaser homepage** : texte « 8 steps · Burkina → Morocco… » en dur — pourrait être dynamique ou FR
4. **Supprimer code mort** : `CareerFloatingPanel.tsx`, `CareerResumeSync.tsx`
5. **Nom évaluateur TYPSA** sur le PDF 2A
6. **Photos** dans `detail.images[]` pour certaines étapes
7. **Relecture FR/EN** des textes des 8 étapes par Karol
8. **Déploiement** si pas encore poussé en prod

### 🚫 Hors scope (demandé explicitement ou plan initial)

- Route `/match` (lien hero inexistant)
- Intégration TrackCargo / projets sur la carte
- Refonte chat IA
- Toggle clair/sombre manuel utilisateur
- Emojis / stickers sur la map

---

## 14. Comment modifier le contenu (sans toucher au code)

1. Éditer `portfolio-config.json` section `careerJourney`
2. Pour une nouvelle étape : ajouter un objet dans `steps[]` avec `order`, coords, `cvRef` si lien CV
3. Side-trip : `sideTrip: true`, `sideTripFromId`, `returnsToHubId`
4. Témoignage texte : remplir `quote.fr` et `quote.en` (éviter `[À compléter]`)
5. Témoignage PDF : ajouter fichier dans `public/recommendations/`, référencer `documentUrl`
6. Relancer `npm run dev` ou rebuild

---

## 15. Comment étendre (code)

| Besoin | Où intervenir |
|--------|----------------|
| Nouveau type d'étape | `CareerStepType` + `STEP_COLORS` + labels |
| Nouveau layer carte | `CareerMap.tsx` (sources/layers Mapbox) |
| Changer durées animation | `careerJourney.map.segmentDurationMs`, `stepPauseMs` |
| Afficher témoignages ailleurs | `getTestimonialsForStep()` |
| Lier clic CV → étape map | `getStepByCvRef()` |
| i18n | Tous les champs `LocalizedString` + `resolveLocalized()` |

---

## 16. Pièges connus

- **Mapbox token manquant** → carte vide, pas d'erreur visible claire
- **PDF iframe mobile** : rendu variable selon navigateur ; lien « Ouvrir le PDF » en fallback
- **Config JSON invalidé** → fallback minimal dans `config-loader.ts` (site dégradé)
- **Workspace Cursor actuel** peut être `Trackcargo` alors que le projet portfolio est dans `/home/karol-linux/projects/portfolio` (dépôt séparé)
- **Permissions fichiers** : certains fichiers `public/` peuvent être owned root si copiés avec sudo

---

## 17. Historique conversation (résumé)

1. Implémentation Career Map v2 : 5 chapitres → **8 étapes hub-and-spoke**
2. Retrait jobs étudiants de la map
3. Remplacement emoji par **avatar 3D** `/avatar.png`
4. Thème light homepage + dark `/journey`
5. Fix popup « Voir le détail complet »
6. Fix avatar chat sticky
7. Témoignages : PDFs affichés natifs + recommandations LinkedIn Rabeh (CGI) et Frederic (Devoteam)

Transcript complet :  
`/home/karol-linux/.cursor/projects/home-karol-linux-projects-Trackcargo/agent-transcripts/377ad25a-24ca-4ab6-a7b3-f75c97976e85/377ad25a-24ca-4ab6-a7b3-f75c97976e85.jsonl`

---

## 18. Contacts & liens profil (config)

- Site : https://karolnaze.dev
- GitHub : https://github.com/WendyamKarol
- LinkedIn : https://linkedin.com/in/karol-naze

---

## 19. Checklist reprise agent

- [ ] `cd /home/karol-linux/projects/portfolio && npm run dev`
- [ ] Vérifier `.env` : `NEXT_PUBLIC_MAPBOX_TOKEN`, `GOOGLE_GENERATIVE_AI_API_KEY`
- [ ] Tester `/journey` : play, popup, détail, PDFs EC Data + TYPSA, citations CGI + Devoteam
- [ ] Tester teaser homepage → lien `/journey`
- [ ] Lire `portfolio-config.json` → `careerJourney` pour tout changement contenu
- [ ] `npm run build` avant PR/deploy
