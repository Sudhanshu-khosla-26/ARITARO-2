# Aritaro Pvt Limited — Website Design System v2.0

> Hand this file to any AI coding assistant. It contains everything needed to rebuild the Aritaro website to a professional, industry-grade standard.

---

## Stack

| Tool | Choice |
|---|---|
| Framework | Next.js 14 (App Router) OR plain HTML/CSS/JS |
| Smooth Scroll | `@studio-freight/lenis` ^1.0.42 |
| Animations | GSAP + ScrollTrigger |
| Icons | Lucide React or custom inline SVG |
| Font | Inter (Google Fonts) + JetBrains Mono for stats/code |
| Theme | `data-theme` attribute on `<html>`, persisted in `localStorage` |

**Do NOT use:** Bootstrap, Tailwind neon shadows, FontAwesome, particle.js fullscreen, Orbitron/tech fonts, AI stock illustrations, red color on any public page.

---

## Color System

### CSS Variables

```css
/* === DARK THEME (default) === */
[data-theme="dark"] {
  --bg-base:       #020617;   /* page background */
  --bg-surface:    #0F172A;   /* sections */
  --bg-elevated:   #1E293B;   /* cards */
  --border-subtle: #334155;   /* card borders */
  --text-primary:  #E2E8F0;   /* headings */
  --text-muted:    #94A3B8;   /* body copy */
  --accent:        #22D3EE;   /* cyan — use max 10% of page */
  --cta:           #3B82F6;   /* buttons only */
}

/* === LIGHT THEME === */
[data-theme="light"] {
  --bg-base:       #F8FAFC;
  --bg-surface:    #FFFFFF;
  --bg-elevated:   #F1F5F9;
  --border-subtle: #E2E8F0;
  --text-primary:  #0F172A;
  --text-muted:    #334155;
  --accent:        #3B82F6;
  --cta:           #3B82F6;
}

/* === STATUS COLORS (minimal use) === */
--c-green-400: #4ADE80;   /* checkmarks and success states only */
--c-amber-400: #FBBF24;   /* warnings only */
/* NO RED on any public/marketing page — red signals scam/danger */
```

### Color Rules

- **Blue `#3B82F6`** — CTA buttons only
- **Cyan `#22D3EE`** — one accent word in hero headline, section labels, max 10% of any page
- **Green `#4ADE80`** — feature list checkmarks only
- **Red** — banned from all public pages. Use only inside authenticated dashboard for error states
- **Slate palette** — everything else

---

## Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400&display=swap');

:root {
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

| Token | Size | Weight | Usage |
|---|---|---|---|
| `--text-xs` | 11px | 400 | Labels, badges, fine print |
| `--text-sm` | 13px | 400 | Card body, captions |
| `--text-base` | 15px | 400 | Body copy, nav items |
| `--text-lg` | 18px | 500 | Card titles |
| `--text-xl` | 24px | 500 | Sub-headings |
| `--text-2xl` | 36px | 600 | Section headings |
| `--text-3xl` | 52px | 600 | Hero headline |
| `--text-4xl` | 68px | 600 | Large hero (≥1280px only) |

**Rules:**
- Hero headline: 52px weight 600. One word wrapped in `<em>` styled with `var(--accent)` and `font-style: normal`
- Section labels: 11px, uppercase, `letter-spacing: 0.12em`, inside a pill with `border: 1px solid var(--border-subtle)`
- Stats/numbers: `font-variant-numeric: tabular-nums`, use JetBrains Mono
- Never use Orbitron, Rajdhani, or any "tech" decorative font — looks student-grade

---

## Navbar

### Behavior
- **At scroll 0:** fully transparent, no border, no background
- **After scroll > 10px:** frosted glass effect kicks in

```css
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: 64px;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  transition: background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;

  /* Default — borderless */
  background: transparent;
  border-bottom: 1px solid transparent;
}

.navbar.scrolled {
  background: rgba(2, 6, 23, 0.85);
  border-bottom: 1px solid rgba(51, 65, 85, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

[data-theme="light"] .navbar.scrolled {
  background: rgba(248, 250, 252, 0.9);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}
```

```js
// Add .scrolled class
window.addEventListener('scroll', () => {
  document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 10);
});
```

### Logo Fix
Use a single logo file. Apply `filter: brightness(0) invert(1)` for dark mode if needed. The footer and navbar must use the exact same logo asset — no color inconsistency.

### Services Mega-Dropdown (hover)

```css
.mega-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: -200px;
  width: 680px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;

  opacity: 0;
  transform: translateY(-8px);
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.nav-services:hover .mega-menu {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
}

.mega-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.15s;
}
.mega-item:hover { background: var(--bg-surface); }

.mega-icon {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.12);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
```

**Services in dropdown (8 items, 2 columns):**
- MDR (Managed Detection & Response)
- Cloud Security
- Red Team Operations
- Identity & Access Management
- AI Business Process Automation
- Chatbot Development
- AI Agents for Workflows
- GPT Enterprise Tools

---

## Page Sections (in order)

1. Hero
2. Stats Bar
3. Services / Capabilities
4. Why Choose Us
5. About
6. Testimonials
7. Membership / Pricing
8. Contact
9. Footer

---

## Hero Section

**Philosophy:** Typography-first. No oversized illustrations. Reference: CrowdStrike, Wiz.io, Palo Alto Networks hero pages.

```html
<section class="hero">
  <div class="section-label">AI-POWERED CYBERSECURITY</div>

  <h1>
    The security platform<br>
    enterprises <em>trust.</em>
  </h1>

  <p class="hero-sub">
    Military-grade threat detection, zero-trust architecture, and AI-driven 
    automation — built for India's most critical businesses.
  </p>

  <div class="hero-actions">
    <button class="btn-primary">Start Free Audit →</button>
    <button class="btn-ghost">Watch Demo</button>
  </div>

  <div class="trust-bar">
    <span>SOC 2 Certified</span>
    <span>ISO 27001</span>
    <span>500+ Enterprises</span>
    <span>40 Countries</span>
  </div>
</section>
```

```css
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 8rem 2rem 4rem;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%,
      rgba(59, 130, 246, 0.15) 0%, transparent 60%),
    var(--bg-base);
}

.hero h1 {
  font-size: clamp(40px, 6vw, 68px);
  font-weight: 600;
  line-height: 1.1;
  color: var(--text-primary);
  max-width: 800px;
}

.hero em {
  font-style: normal;
  color: var(--accent);
}

.hero-sub {
  font-size: 17px;
  color: var(--text-muted);
  max-width: 580px;
  line-height: 1.7;
  margin: 1.5rem 0 2.5rem;
}

.trust-bar {
  margin-top: 3rem;
  display: flex;
  gap: 2rem;
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

---

## Smooth Scroll — Lenis

```html
<!-- CDN -->
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
```

```js
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Navbar scroll state
lenis.on('scroll', ({ scroll }) => {
  document.querySelector('.navbar').classList.toggle('scrolled', scroll > 10);
});
```

---

## Animation System — GSAP

```js
// Scroll reveal — apply data-reveal to every section
gsap.utils.toArray('[data-reveal]').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%' },
    opacity: 0,
    y: 24,
    duration: 0.7,
    ease: 'power2.out',
  });
});

// Stagger cards
gsap.from('.service-card', {
  scrollTrigger: { trigger: '.services-grid', start: 'top 80%' },
  opacity: 0,
  y: 32,
  stagger: 0.1,
  duration: 0.6,
  ease: 'power2.out',
});

// Counter animation on stats
document.querySelectorAll('[data-count]').forEach(el => {
  const target = +el.dataset.count;
  gsap.from({ val: 0 }, {
    val: target,
    duration: 2,
    ease: 'power1.out',
    scrollTrigger: { trigger: el, start: 'top 80%' },
    onUpdate() {
      el.textContent = Math.round(this.targets()[0].val);
    }
  });
});
```

**Rules:**
- No spinning loaders, no neon glow keyframes, no floating particles on hero
- Max animation duration: 0.8s
- All easing: `power2.out` or `power1.out`
- Stagger max: 0.15s between items

---

## Membership / Pricing Panel

Three tiers. Center card is featured.

```css
.pricing-grid {
  display: grid;
  grid-template-columns: 1fr 1.05fr 1fr;
  gap: 1.5rem;
  align-items: center;
  max-width: 960px;
  margin: 0 auto;
}

.pricing-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 14px;
  padding: 2rem;
}

.pricing-card.featured {
  background: var(--bg-elevated);
  border: 1px solid #3B82F6;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  position: relative;
}

.pricing-card.featured::before {
  content: 'MOST POPULAR';
  position: absolute;
  top: -12px; left: 50%;
  transform: translateX(-50%);
  background: #3B82F6;
  color: white;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  padding: 4px 14px;
  border-radius: 20px;
}

.feature-item .check {
  color: #4ADE80;  /* only acceptable green use */
}
```

**Tier Content:**

| | Starter | Professional | Enterprise |
|---|---|---|---|
| Price | Free | ₹X/month | Custom |
| Highlight | Security assessment | Full MDR + AI | Dedicated team |
| Key features | Free audit, basic scan, report | All Starter + SOC 24/7, AI automation, chatbot, red team | All Pro + custom GPT tools, SLA, on-site |
| CTA | Start Free Audit | Get Protected | Contact Sales |

---

## Component Specs

| Component | Value |
|---|---|
| Card border radius | 12–16px |
| Button border radius | 6–8px |
| Pill border radius | 9999px |
| Card border | `1px solid var(--border-subtle)` |
| Card padding | 24px (standard) / 32px (featured) |
| Section padding | `96px 0` desktop / `64px 0` mobile |
| Max content width | 1200px centered |
| Button primary | bg `#3B82F6`, white text, 12px 24px padding, radius 6px |
| Button ghost | transparent bg, `1px solid var(--border-subtle)`, hover bg-elevated |
| Transition default | `all 0.2s ease` |
| Focus ring | `box-shadow: 0 0 0 3px rgba(59,130,246,0.35)` |

---

## Footer Fix

```css
.footer {
  border-top: 1px solid var(--border-subtle);
  /* No different background — same as --bg-base */
  background: var(--bg-base);
  padding: 4rem 2rem 2rem;
}

/* Logo in footer — must match navbar logo color */
/* If SVG: set fill="currentColor" so it inherits theme text color */
/* If PNG: use same filter approach as navbar */

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 2rem;
}
```

**Columns:** Logo + tagline ("Elite cybersecurity for enterprises that can't afford to fail") | Services | Company | Resources | Legal

---

## What to Remove

- Oversized hero shield/robot illustration
- Second duplicate "Ready to secure your organization?" CTA section (keep only one)
- All red color from public pages
- Numbered service cards (01, 02, 03…) — looks like a free template
- Neon glow borders on cards
- Current green color on footer logo (fix to match brand blue/white)

---

## Theme Toggle

```js
const toggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Load saved theme
html.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');

toggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Smooth theme transition
html.style.transition = 'background 0.3s ease, color 0.3s ease';
```

Use a sun/moon SVG icon, 32px, top-right of navbar. No border, no background.

---

## Reference Sites (study these)

- https://www.crowdstrike.com — hero structure, stat bars, trust signals
- https://www.wiz.io — clean dark theme, mega menu, card components
- https://www.darktrace.com — typography-first, no decorative illustrations
- https://www.pandasecurity.com — dual theme done right

---

*End of design system. Version 2.0 — Aritaro Pvt Limited*