# <center>The Job Tracker</center>

## <center>Track your job applications, store CVs & cover letters, and get AI-powered feedback on cover letters.</center>

### <center>Live demo: https://the-job-tracker-a5740dfd83a3.herokuapp.com/ (deployed on Heroku)</center>

## Index:
1. [Features](#features)
2. [User Stories](#user-stories)
3. [UX Design](#ux-design)
4. [Tech Stack](#tech-stack)
5. [Database](#database)
6. [Testing](#testing)
7. [AI](#ai)
8. [Tools](#tools)
9. [Acknowledgments](#acknowledgements)

# Features

Below is a concise list of the application's main features with short explanations.

- **User Registration & Authentication:** Create an account, log in, and log out. New users are automatically logged in after successful registration to streamline onboarding.
- **Dashboard:** Centralized dashboard showing your job applications, their statuses, and quick actions to add, edit or remove applications.
- **Job Application CRUD:** Create, read, update, and delete job application entries — track company, role, application date, status (e.g., Applied, Interviewing, Offer), and notes.
- **File Uploads (CVs & Cover Letters):** Attach CVs and cover letters to job applications. Files can be downloaded or removed from the dashboard with single-click controls.
- **AI Cover Letter Checker:** Upload a cover letter PDF and provide a job title & description; the system returns AI-generated feedback to help improve clarity, tone, and relevance.
- **Client & Server Validation:** The cover-letter checker enforces both client-side and server-side validation (job description required, PDF file type and size limits) to avoid failed AI requests.
- **Accessible UI:** Built with accessibility in mind — skip links, focus-visible styles, ARIA attributes, and keyboard-friendly interactions throughout the app.
- **Responsive Design:** Uses Bootstrap to ensure the app is usable on mobile, tablet, and desktop screens.
- **Static & Media Handling:** WhiteNoise serves static files in production; local media storage keeps uploaded files under `media/uploads/`. Cloudinary support is available as an option.
- **Deployable to Heroku:** Project setup and recommended files (e.g., `Procfile`, pinned Python version, and `requirements.txt`) are included to make Heroku deployment straightforward.
- **Email- and DB-safe Registration:** Registration validates email uniqueness at the form level to prevent database integrity errors and improve UX.
- **Progress Tracking & Visuals:** Visual progress indicators and optional charts (Chart.js) on the dashboard help users see application activity at a glance.

# User Stories

Below are concise user stories in the format "As a <role>, I want <goal> so that <reason>", with brief acceptance criteria.

- **As a new user, I want to register and be automatically logged in so that I can start tracking applications immediately.**
	- Acceptance: registration validates required fields and email uniqueness; user is redirected to the dashboard after signup.

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

## Design Goals
- Minimize onboarding friction (auto-login after registration).
- Keep primary actions discoverable from the dashboard (Add Job, file actions, Cover Letter Checker).
- Make AI feedback explicit and explainable (clear inputs, processing state, and readable output).
- Prioritize accessibility and mobile-first responsiveness.

## Information Architecture
- **Top nav:** brand, Add Job, Cover Letter Checker, account actions (Dashboard/Profile/Logout).
- **Dashboard:** primary workspace showing job applications, filters, quick-add CTA, and visual summaries (progress bar / charts).
- **Application detail / modal:** fields for company, role, date, status, notes, and file uploads (CV/cover letter).
- **Cover Letter Checker:** small focused flow: job title & description + PDF upload → processing modal → feedback screen.

## Major Screens & Components
- **Navbar:** collapsible on small screens; includes a visible skip link and clear account access.
- **Dashboard:** list or grid of application cards with summary metadata, status badges, and file action icons.
- **Add/Edit Job Modal:** compact form with client validation; returns to dashboard on success.
- **File controls:** show filename, Download and Delete actions; provide a confirmation or undo pattern for deletes.
- **Cover Letter Checker UI:** input area for job details, file uploader (PDF-only), submit button, inline spinner, and an accessible loading modal while AI runs.
- **Alerts & Inline Errors:** dismissible top-level alerts for global messages and small inline text for field errors.

## Interaction Patterns
- **Single-click file actions:** Download directly downloads; Delete confirms or offers simple undo.
- **Modals:** trap focus while open and restore focus to the originating control on close.
- **Cover letter submission:** disable the submit control on click, show a spinner and modal overlay, and set `aria-busy` for assistive tech.
- **Form validation:** client-side checks for required fields and file types; server-side validation as authoritative.

## Accessibility
- Include a keyboard-accessible skip link to jump to main content.
- Use `:focus-visible` and clear focus outlines to support keyboard users.
- Associate error text with fields via `aria-describedby` and provide `role="alert"` for live messages.

## Responsive Behavior
- Design mobile-first: stack content and use collapsible navigation on narrow viewports.
- Ensure touch targets meet size recommendations and important actions are reachable without excessive scrolling.

## Visual Language
- Primary brand color used for the navbar and progress accents; neutral surfaces for cards and panels.
- Typography emphasizes readability with clear hierarchy for headings, labels, and body text.

## Error States & Edge Cases
- Show inline validation errors for missing job description or missing file during AI check.
- Provide a friendly global error if the AI service fails and include retry instructions.

## Future UX Opportunities
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

 





