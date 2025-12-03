# <center>The Job Tracker</center>

![Image of Job Tracker AMIRESPONSIVE](/documentation/job%20tracker%20responsive.PNG)

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

## Features -

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

## User Stories -

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

## UX Design -

### Wireframes:

![Wireframe Desktop](/documentation/job%20tracker%20wireframes.PNG)

The wireframes outline the core layout and flow of the project before any styling or development takes place. They focus on structure rather than visuals, showing how each page is organised, how users move between sections, and where key features sit on the screen.

These early sketches help define navigation, spacing, and content hierarchy while keeping the design flexible. By mapping everything out visually at this stage, the build process becomes smoother and decisions stay consistent as the project grows.

### Color Scheme:

The project uses a simple, high-contrast palette built around one accent colour:

Primary Accent: #F05324
A vivid orange-red used for highlights, buttons, and interactive elements.

Neutrals:

Black — for typography and strong contrast

White — for backgrounds and clean spacing

This combination keeps the interface bold, readable, and visually consistent across light and dark elements.

### Typography:

This project uses Bootstrap 5.1.3’s default font stack, which automatically selects the best system font based on the user’s platform. That means no extra font downloads, faster rendering, and a native feel across devices.

Bootstrap’s default font-family:
								font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
											"Noto Sans", "Liberation Sans", Arial, sans-serif,
											"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

In practice, this resolves to the following on each platform:

Windows: Segoe UI
macOS / iOS: San Francisco
Android: Roboto
Linux: system-ui (varies by distro)

This setup keeps the UI consistent, performant, and aligned with native operating system typography.

## Tech Stack

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

 ## Database
 See the full schema in `documentation/database_schema.md`.
 
 ### Core Entities
 - `CustomUser` — extends Django's `AbstractUser` with unique email and profile flags.
 - `JobApplication` — links to a user and stores application details, status, contacts, notes, and uploaded files.

## Testing -

### Lighthouse

![Lighthouse Score](/documentation/validation/job%20tracker%20lighthouse.PNG)

The application was evaluated using [Google Lighthouse](https://developers.google.com/web/tools/lighthouse), an automated tool for improving the quality of web pages. The Lighthouse audit covers key areas such as **Performance**, **Accessibility**, **Best Practices**, and **SEO**.

- **Performance:** The site loads quickly and efficiently, with optimized images and minimized JavaScript/CSS for a smooth user experience on both desktop and mobile devices.
- **Accessibility:** The application follows accessibility best practices, including proper color contrast, semantic HTML, and keyboard navigation support, making it usable for all players.
- **Best Practices:** The codebase adheres to modern web standards, ensuring security, reliability, and maintainability.
- **SEO:** Pages are structured for discoverability, with appropriate meta tags and content organization to help new users find builds through search engines.

A high Lighthouse score demonstrates the project's commitment to delivering a fast, accessible, and user-friendly experience for the

### HTML Validation

![HTML Validation](/documentation/validation/job%20tracker%20html.PNG)

The HTML code for the application was validated using the [W3C Markup Validation Service](https://validator.w3.org/). This tool checks for syntax errors, missing tags, and structural issues in the HTML markup.  
- **Result:** The site’s HTML passed validation with no critical errors, ensuring semantic structure and cross-browser compatibility.
- **Benefits:** Clean HTML improves accessibility, SEO, and maintainability, and reduces the risk of rendering issues across different browsers and devices.

### CSS Validation

![CSS Validation](/documentation/validation/job%20tracker%20css.PNG)

The CSS was validated using the [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/). This tool checks for errors, unsupported properties, and best practices in the stylesheet.
- **Result:** The CSS passed validation with no major errors, confirming that the stylesheets follow modern standards and are compatible with all major browsers.
- **Benefits:** Valid CSS ensures consistent appearance, faster load times, and easier maintenance.

### PEP8 Validation

![PEP8](/documentation/validation/job%20tracker%20pep8.PNG)

Python code was checked for PEP8 compliance using tools like `flake8` and `autopep8`.  
- **Result:** The codebase is PEP8-compliant, with all long lines, indentation, and style issues fixed as part of the automated linting process.
- **Benefits:** Adhering to PEP8 makes the code more readable, maintainable, and less prone to bugs. Automated linting is integrated into the workflow to catch issues early and ensure consistent code quality.

---

These validation steps are part of the continuous integration and quality assurance process, helping to deliver a robust, accessible, and professional

## AI -

### Cover Letter Checking:
	The project includes a fully implemented AI-powered Cover Letter Checker. Users can upload or paste their cover letter and receive instant feedback on tone, structure, clarity, and relevance to a job description.
	The system analyses the content, highlights areas for improvement, and provides actionable suggestions to help users create a more polished, convincing cover letter. This makes the application process smoother and gives users a clearer sense of how their writing will be interpreted.

### Development & Code Generation:
	GitHub Copilot: Used throughout development for:
	Code completion and intelligent suggestions for Django models, views, and templates
	Bug detection and code optimization recommendations
	Documentation generation for inline comments and docstrings
	Test case creation for comprehensive application testing

### Future AI Intergrations:
	A planned enhancement for this project is an AI-driven CV Checker. This feature will allow users to upload their CV and receive automated insights on structure, clarity, and keyword alignment. The goal is to provide meaningful, personalised feedback that helps users strengthen their applications and match industry expectations.
	This integration will combine natural language processing with best-practice hiring criteria, turning the project into a more helpful and intelligent tool over time.

### Ethical AI Usage:
	Transparency: All AI-generated code is reviewed and tested by human developer
	Community-First: AI enhances but never replaces community-driven content
	Privacy Protection: User data is never shared with external AI services

### Benefits Achieved:
	Faster development cycle with AI-assisted coding
	Improved code quality through automated suggestions
	Enhanced user experience via intelligent autocomplete
	Reduced bugs through AI-powered code review
	Better documentation with consistent AI-generated comments

## Tools Used

### Development & Design Tools
- **[Visual Studio Code](https://code.visualstudio.com/)** - Primary code editor with Python and Django extensions
- **[GitHub Copilot](https://github.com/features/copilot)** - AI-powered code completion and suggestions
- **[Git](https://git-scm.com/)** - Version control system for tracking code changes
- **[GitHub](https://github.com/)** - Code repository hosting and collaboration platform

### Frontend Technologies
- **[Bootstrap 5.1.3](https://getbootstrap.com/)** - Responsive CSS framework for layout and components
- **[Font Awesome 6.0.0](https://fontawesome.com/)** - Icon library for UI elements
- **[Chart.js](https://www.chartjs.org/)** - JavaScript charting library for dashboard visualizations

### Backend Technologies
- **[Python 3.11+](https://www.python.org/)** - Programming language
- **[Django 5.2.7](https://www.djangoproject.com/)** - High-level Python web framework
- **[Gunicorn 20.1.0](https://gunicorn.org/)** - WSGI HTTP server for production deployment
- **[WhiteNoise](https://whitenoise.readthedocs.io/)** - Static file serving for Django applications

### Database & Storage
- **[SQLite](https://www.sqlite.org/)** - Lightweight database for local development
- **[PostgreSQL](https://www.postgresql.org/)** - Production database on Heroku
- **[Cloudinary](https://cloudinary.com/)** - Optional cloud-based media storage (with django-cloudinary-storage 0.3.0)

### Python Packages
- **[pypdf 6.2.0](https://pypi.org/project/pypdf/)** - PDF file parsing for cover letter uploads
- **[python-dotenv 1.2.1](https://pypi.org/project/python-dotenv/)** - Environment variable management
- **[psycopg2-binary 2.9.10](https://pypi.org/project/psycopg2-binary/)** - PostgreSQL database adapter
- **[dj-database-url 1.2.0](https://pypi.org/project/dj-database-url/)** - Database URL parser for Heroku
- **[requests 2.32.5](https://pypi.org/project/requests/)** - HTTP library for API calls
- **[flake8](https://flake8.pycqa.org/)** - Python code linter for PEP8 compliance

### AI & Machine Learning
- **[Mistral AI](https://mistral.ai/)** - AI model for cover letter analysis and feedback
- **[Azure AI Inference 1.0.0b9](https://pypi.org/project/azure-ai-inference/)** - Azure AI integration library

### Deployment & Hosting
- **[Heroku](https://www.heroku.com/)** - Cloud platform for application deployment
- **[Heroku Postgres](https://www.heroku.com/postgres)** - Managed PostgreSQL database service

### Testing & Validation Tools
- **[W3C Markup Validator](https://validator.w3.org/)** - HTML validation service
- **[W3C CSS Validator](https://jigsaw.w3.org/css-validator/)** - CSS validation service
- **[Google Lighthouse](https://developers.google.com/web/tools/lighthouse)** - Performance, accessibility, and SEO auditing
- **[flake8](https://flake8.pycqa.org/)** - Python PEP8 style guide enforcement

### Design Resources
- **[Favicon Generator](https://favicon.io/)** - Favicon creation and generation tool
- **[Am I Responsive?](https://ui.dev/amiresponsive)** - Multi-device mockup generator for screenshots

### Documentation Tools
- **[Markdown](https://www.markdownguide.org/)** - Documentation formatting language
- **[GitHub Markdown](https://docs.github.com/en/get-started/writing-on-github)** - Enhanced markdown for README and documentation

## Acknowledgements

**Django Community** for the excellent Web Framework
**Bootstrap Team** for the responsive CSS Framework


