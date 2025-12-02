# Elden Ring Builds Community

A Django-based web application for the Elden Ring community to share, discover, and discuss character builds. Users can create detailed build guides, grace (like) their favorites, comment on builds, and connect with fellow Tarnished.

---

<!-- Add images into `docs/images/` and replace the paths below -->

![Home Page Screenshot](docs/images/homepage.png)
<!-- Image: Home Page (replace `docs/images/homepage.png` with your screenshot) -->

[Live site (placeholder)](https://example.com)

## Index
1. [Features](#features)
2. [User Stories](#user-stories)
3. [UX Design](#ux-design)
4. [Tech Stack](#tech-stack)
5. [Database](#database)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [AI](#ai)
9. [Tools](#tools)
10. [Acknowledgments](#acknowledgments)

---

## Features

This project focuses on community-driven build sharing with Elden Ring theming and several convenience features:

- Grace System
	- Uses "Grace" instead of standard likes to match Elden Ring lore. Users can "grace" builds to show appreciation and bookmark favorites.
	- Placeholder image: `docs/images/grace.png`

- Smart Autocomplete
	- Autocomplete suggestions powered by the Elden Ring Fan API to speed up entering weapon/armor/talisman names.
	- Placeholder image: `docs/images/autocomplete.png`

- Responsive Design
	- Mobile-first responsive UI built with Bootstrap 5 and custom styling to match the game's dark fantasy aesthetic.

- Build Creation & Management
	- Detailed build forms supporting weapons, armor, talismans, spells, notes, and category tags (PvE, PvP, Boss-Slayer).
	- Multiple image uploads per build (Cloudinary integration) with a primary-image selector.

- Community Interaction
	- Comments with threaded replies and voting on comments.
	- Notifications for comments and engagement.

- Discovery & Search
	- Category filters, search by gear name, and sorting by popularity (graces) or recent activity.

- Theming & Accessibility
	- Dark fantasy color palette, high-contrast accents for actionable UI, and accessibility-first practices (skip link, focus-visible outlines, ARIA attributes).

---

## User Stories

Authentication & User Management
- As a new visitor, I want to register for an account so that I can create and share my own builds.
- As a registered user, I want to log in securely so that I can access my builds and community features.
- As a user, I want to update my profile information so that other community members can learn about me.

Build Creation & Management
- As a Tarnished, I want to create detailed builds with weapons, armor, talismans, and spells so that I can share my character strategies.
- As a build creator, I want autocomplete suggestions for equipment names so that I can quickly and accurately input my gear.
- As a user, I want to upload screenshots of my character so that others can see how my build looks in-game.
- As a build author, I want to categorize my builds (PvP, PvE, Boss Slaying) so that others can find builds for their playstyle.
- As a build creator, I want to edit or delete my published builds so that I can keep content current.

Build Discovery & Browsing
- As a player, I want to browse all community builds so that I can discover new character strategies.
- As a user, I want to filter builds by category and search by weapon or equipment name so that I can find relevant builds.
- As a user, I want to view detailed build information including stats, equipment, and strategies so that I can understand how to recreate the build.

Community Interaction
- As a community member, I want to grace (like) builds that I find helpful so that I can show appreciation and bookmark favorites.
- As a user, I want to comment on builds so that I can ask questions, provide feedback, or share experiences.
- As a build creator, I want to receive notifications when someone interacts with my builds so that I can engage with the community.

User Profiles & Statistics
- As a user, I want to view my profile page so that I can see all my builds and activity in one place.
- As a build creator, I want to see statistics about my builds (views, graces, comments) so that I can understand which content resonates.

Technical & Quality
- As a user, I want the site to load quickly and be reliable.
- As a developer, I want automated tests, linting, and CI so that new changes are safe to deploy.

---

## UX Design

### Wireframes
- Desktop and mobile wireframes are available in the `docs/wireframes/` folder (place images there and reference them above).

### Color Palette (Dark Fantasy)
- Deep Charcoal: `#1a1a1a` — main background
- Rich Black: `#0d0d0d` — navigation and cards
- Golden Grace: `#d4af37` — primary accent (Grace)
- Warm Gold: `#ffd700` — CTA highlights
- Muted Silver: `#c0c0c0` — secondary text
- Crimson Red: `#dc3545` — error/danger

(Place color swatch images in `docs/images/color-palette.png` if desired.)

### Typography
- Headings: `Cinzel` (or a similar serif) for thematic headings
- Body: `Roboto` or `Inter` for readability
- Counters/stats: `Orbitron` or similar accent font

Include Google Fonts imports in the main stylesheet; ensure fallback fonts for accessibility.

### Accessibility
- Skip link to main content
- Visible `:focus-visible` outlines
- `aria-describedby` for form errors and `role="alert"` for important messages
- Contrast checks to meet WCAG AA where possible

---

## Tech Stack

- Backend: Django (Python) — project built on Django apps (accounts, builds, users)
- Database: PostgreSQL (production) / SQLite (development)
- Frontend: Bootstrap 5 + custom CSS/JS
- File storage: Cloudinary for build screenshots
- API integration: Elden Ring Fan API for autocomplete and game data
- Hosting: Heroku (Gunicorn + WhiteNoise)
- Key packages: `django-cloudinary-storage`, `dj-database-url`, `psycopg2-binary`, `pypdf`, `python-dotenv`

---

## Project Structure (example)

```
Elden_Builds/
├── accounts/
├── builds/
│   ├── models.py
│   ├── views.py
│   ├── forms.py
│   └── urls.py
├── users/
├── static/
│   ├── css/
│   ├── js/
│   └── images/
├── templates/
├── utils/
└── eldenring_project/
```

---

## API Integration
- Elden Ring Fan API for weapon/armor/talisman suggestions and metadata.
- Autocomplete endpoints are called client-side for fast, contextual suggestions; results are cached where appropriate.

---

## Database

- Core entities: `User`, `UserProfile`, `Build`, `BuildImage`, `Comment`, `CommentVote`, `Notification`.
- `Build` has Many-to-One to `User`; `BuildImage` stores Cloudinary references; comments support threading via a parent relationship.

(You can add an ER diagram image at `docs/images/er-diagram.png`.)

---

## Testing

- Run Django unit tests:

```bash
python manage.py test
```

- Use `flake8` and `black` for linting and formatting; mock external APIs in tests to keep CI deterministic.

---

## Deployment (Heroku)

1. Ensure `Procfile`, `.python-version`, and `requirements.txt` are present.
2. Set environment variables: `SECRET_KEY`, `DEBUG=0`, `ALLOWED_HOSTS`, `DATABASE_URL`, `CLOUDINARY_URL`.
3. Provision Heroku Postgres and push:

```bash
heroku create <app-name>
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
heroku run python manage.py migrate --app <app-name>
heroku run python manage.py collectstatic --noinput --app <app-name>
heroku run python manage.py createsuperuser --app <app-name>
```

4. Monitor with `heroku logs --tail -a <app-name>`.

---

## AI

- AI-assisted features used for developer productivity (Copilot) and optional UX enhancements such as intelligent filtering and future build recommendations.

---

## Tools

- GitHub (repo & Projects board), GitHub Actions (CI), VS Code, Cloudinary, Heroku, flake8, black, Google Lighthouse.

---

## Acknowledgments

- FromSoftware for creating Elden Ring
- Elden Ring Fan API for providing game data
- Django Community and open-source contributors

*May the Grace guide your builds.*


- **As a job seeker, I want to add a job application so that I can keep track of my applications and next steps.**
	- Acceptance: the Add Job form captures company, role, date, status, and notes; new entry appears on the dashboard.

- **As a job seeker, I want to upload a CV and a cover letter to an application so that documents are stored with the application.**
	- Acceptance: uploaded files appear with filename, and Download/Delete actions are available in the dashboard.

- **As a job seeker, I want to replace or remove uploaded files so that my stored documents stay current.**
	- Acceptance: delete removes the file from storage and the UI; re-upload replaces the stored file and updates the filename.

- **As a job seeker, I want to run the AI Cover Letter Checker so that I can receive feedback to improve my cover letter.**
	- Acceptance: the checker requires a job title/description and a PDF upload, shows a loading spinner while processing, and returns feedback on success.

- **As an accessibility-minded user, I want keyboard navigation and screen-reader support so that the app is usable without a mouse.**
	- Acceptance: skip link exists, focus styles are visible, and key interactive elements include ARIA attributes.

- **As a mobile user, I want the site to be responsive so that I can manage applications from my phone.**
	- Acceptance: layouts adapt to small screens and the collapsed navigation exposes the same actions as desktop.

- **As an administrator, I want to run migrations and create a superuser in production so that I can manage the site.**
	- Acceptance: migrations run without error on production and a superuser can log into Django admin.

# UX Design

This section documents the UX approach used in the application: core goals, main screens, component behavior, accessibility considerations, and common interaction patterns.

Design Goals
- Minimize onboarding friction (auto-login after registration).
- Keep primary actions discoverable from the dashboard (Add Job, file actions, Cover Letter Checker).
- Make AI feedback explicit and explainable (clear inputs, processing state, and readable output).
- Prioritize accessibility and mobile-first responsiveness.

Information Architecture
- **Top nav:** brand, Add Job, Cover Letter Checker, account actions (Dashboard/Profile/Logout).
- **Dashboard:** primary workspace showing job applications, filters, quick-add CTA, and visual summaries (progress bar / charts).
- **Application detail / modal:** fields for company, role, date, status, notes, and file uploads (CV/cover letter).
- **Cover Letter Checker:** small focused flow: job title & description + PDF upload → processing modal → feedback screen.

Major Screens & Components
- **Navbar:** collapsible on small screens; includes a visible skip link and clear account access.
- **Dashboard:** list or grid of application cards with summary metadata, status badges, and file action icons.
- **Add/Edit Job Modal:** compact form with client validation; returns to dashboard on success.
- **File controls:** show filename, Download and Delete actions; provide a confirmation or undo pattern for deletes.
- **Cover Letter Checker UI:** input area for job details, file uploader (PDF-only), submit button, inline spinner, and an accessible loading modal while AI runs.
- **Alerts & Inline Errors:** dismissible top-level alerts for global messages and small inline text for field errors.

Interaction Patterns
- **Single-click file actions:** Download directly downloads; Delete confirms or offers simple undo.
- **Modals:** trap focus while open and restore focus to the originating control on close.
- **Cover letter submission:** disable the submit control on click, show a spinner and modal overlay, and set `aria-busy` for assistive tech.
- **Form validation:** client-side checks for required fields and file types; server-side validation as authoritative.

Accessibility
- Include a keyboard-accessible skip link to jump to main content.
- Use `:focus-visible` and clear focus outlines to support keyboard users.
- Associate error text with fields via `aria-describedby` and provide `role="alert"` for live messages.

Responsive Behavior
- Design mobile-first: stack content and use collapsible navigation on narrow viewports.
- Ensure touch targets meet size recommendations and important actions are reachable without excessive scrolling.

Visual Language
- Primary brand color used for the navbar and progress accents; neutral surfaces for cards and panels.
- Typography emphasizes readability with clear hierarchy for headings, labels, and body text.

Error States & Edge Cases
- Show inline validation errors for missing job description or missing file during AI check.
- Provide a friendly global error if the AI service fails and include retry instructions.

Future UX Opportunities
- Inline AI suggestions with highlighted spans and example rewrites.
- Drag-and-drop file upload on desktop.

# Tech Stack

This project uses a standard Django-based stack with modern frontend tooling and optional AI integration. Below are the main components and why they are used.

- **Python & Django**: Python 3.11+ and Django 5.2.7 provide the backend framework, ORM, and templating.
- **Bootstrap 5**: Responsive CSS framework used for layout, components, and responsive utilities.
- **Font Awesome**: Iconography for common actions (download, delete, edit, spinner).
- **Chart.js**: Optional charts for dashboard visualizations.
- **Mistral AI**: Used for Cover letter checking.
- **Static files**: WhiteNoise serves static assets in production (Heroku) for a simple CDN-like approach.
- **Database**: SQLite for local development (`db.sqlite3`) and PostgreSQL in production (Heroku) via `dj-database-url` for parsing `DATABASE_URL`.
- **File storage**: Local `media/uploads/` for uploaded files; optional Cloudinary integration via `django-cloudinary-storage` for hosted media.
- **Deployment**: Heroku + gunicorn; `Procfile`, `.python-version`, and pinned `requirements.txt` are included for reproducible deployments.
- **Other notable packages**: `pypdf` for PDF parsing, `python-dotenv` for local environment management, and `psycopg2-binary` for Postgres connectivity.

# Database



# Testing 



# AI

# Tools

# Acknowledgements 





