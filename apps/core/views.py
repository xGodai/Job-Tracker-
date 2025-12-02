from django.shortcuts import render, redirect, get_object_or_404
from apps.users.forms import ProfileUpdateForm
from apps.core.forms import JobApplicationForm
from apps.core.models import JobApplication
from datetime import date, timedelta
from django.db.models import Q
from django.contrib import messages
from django.core.paginator import Paginator
import json


def home(request):
    """
    Home view that serves:
    - Landing page for unauthenticated users
    - Dashboard for authenticated users
    """
    if not request.user.is_authenticated:
        # Show landing page for unauthenticated users
        return render(request, 'home.html')

    # Dashboard logic for authenticated users
    profile_form = None
    job_application_form = None
    editing_application_id = None
    show_job_form = False

    if request.method == 'POST':
        # Delete a job application (from the edit modal)
        if 'delete_job_application' in request.POST:
            application_id = request.POST.get('application_id')
            application = get_object_or_404(JobApplication, id=application_id, user=request.user)
            # remove uploaded files from storage before deleting the DB row
            try:
                if application.cv:
                    application.cv.delete(save=False)
            except Exception:
                pass
            try:
                if application.cover_letter:
                    application.cover_letter.delete(save=False)
            except Exception:
                pass
            application.delete()
            messages.success(
                request,
                f'Job application for {application.position_title} at '
                f'{application.company_name} has been deleted.'
            )
            return redirect('home')

        if 'update_profile' in request.POST:
            profile_form = ProfileUpdateForm(request.POST, instance=request.user)
            if profile_form.is_valid():
                profile_form.save()
                messages.success(request, 'Your profile has been updated successfully!')
                return redirect('home')
        elif 'add_job_application' in request.POST:
            job_application_form = JobApplicationForm(request.POST, request.FILES)
            if job_application_form.is_valid():
                job_application = job_application_form.save(commit=False)
                # If the user did not provide an application_date, default to today
                if not job_application.application_date:
                    job_application.application_date = date.today()
                job_application.user = request.user
                job_application.save()
                messages.success(
                    request,
                    f'Job application for {job_application.position_title} at '
                    f'{job_application.company_name} has been added!'
                )
                return redirect('home')
            else:
                # show the job application form again with validation errors
                show_job_form = True
        elif 'edit_job_application' in request.POST:
            application_id = request.POST.get('application_id')
            application = get_object_or_404(JobApplication, id=application_id, user=request.user)
            # include FILES when editing so uploaded files are processed
            job_application_form = JobApplicationForm(request.POST, request.FILES, instance=application)
            if job_application_form.is_valid():
                job_application = job_application_form.save(commit=False)
                # handle removal flags for files
                if request.POST.get('remove_cv'):
                    if job_application.cv:
                        try:
                            job_application.cv.delete(save=False)
                        except Exception:
                            pass
                    job_application.cv = None
                if request.POST.get('remove_cover_letter'):
                    if job_application.cover_letter:
                        try:
                            job_application.cover_letter.delete(save=False)
                        except Exception:
                            pass
                    job_application.cover_letter = None
                job_application.save()
                messages.success(
                    request,
                    f'Job application for {application.position_title} at '
                    f'{application.company_name} has been updated!'
                )
                return redirect('home')
            else:
                editing_application_id = application_id
                show_job_form = True

    # Check if we're editing an existing application or opening a new blank form
    if request.GET.get('edit'):
        application_id = request.GET.get('edit')
        application = get_object_or_404(JobApplication, id=application_id, user=request.user)
        job_application_form = JobApplicationForm(instance=application)
        editing_application_id = application_id
        show_job_form = True
    elif request.GET.get('new'):
        # User explicitly requested to create a new application; show blank form
        # Pre-fill application_date with today for convenience
        job_application_form = JobApplicationForm(initial={'application_date': date.today()})
        editing_application_id = None
        show_job_form = True

    # Initialize forms if not set by POST processing
    if profile_form is None:
        profile_form = ProfileUpdateForm(instance=request.user)
    if job_application_form is None:
        job_application_form = JobApplicationForm()

    return render(
        request,
        'home.html',
        get_dashboard_context(
            request, profile_form, job_application_form,
            editing_application_id, show_job_form
        )
    )


def get_dashboard_context(
        request, profile_form, job_application_form,
        editing_application_id=None, show_job_form=False):
    """Helper function to get dashboard context for authenticated users"""
    # Get user's job applications for dashboard stats
    job_applications_qs = request.user.job_applications.all()

    # Apply optional filters/sorting from GET params
    sort = request.GET.get('sort', 'recent')  # 'recent' or 'alpha'
    status_filter = request.GET.get('status', 'all')  # status key or 'all'

    if status_filter and status_filter != 'all':
        job_applications_qs = job_applications_qs.filter(status=status_filter)

    if sort == 'alpha':
        # Alphabetical by company_name then position_title
        job_applications_qs = job_applications_qs.order_by('company_name', 'position_title')
    else:
        # Default: most recent by application_date then created_at (descending)
        job_applications_qs = job_applications_qs.order_by('-application_date', '-created_at')

    job_applications = job_applications_qs

    # Pagination - show 5 per page by default
    page_number = request.GET.get('page', 1)
    paginator = Paginator(job_applications, 5)
    page_obj = paginator.get_page(page_number)
    stats = {
        'total_applications': job_applications.count(),
        'interviews_scheduled': job_applications.filter(status='interview_scheduled').count(),
        'offers_received': job_applications.filter(status='offer_received').count(),
        'interview_completed': job_applications.filter(status='interview_completed').count(),
    }
    # Targets and progress calculations
    # Default targets: 2 per day, 10 per week
    DAILY_TARGET = 2
    WEEKLY_TARGET = 10

    today = date.today()
    # Week start (Monday)
    week_start = today - timedelta(days=today.weekday())

    # Count applications by application_date, but also include recently created records
    # where application_date may be missing or set incorrectly. We include created_at date
    # as a fallback so newly added applications count toward today's/this week's targets.
    daily_count = job_applications.filter(
        Q(application_date=today) | Q(created_at__date=today)
    ).count()

    weekly_count = job_applications.filter(
        Q(application_date__gte=week_start, application_date__lte=today)
        | Q(created_at__date__gte=week_start, created_at__date__lte=today)
    ).count()

    def pct(count, target):
        if target <= 0:
            return 0
        return min(100, int((count / target) * 100))

    targets = {
        'daily_target': DAILY_TARGET,
        'weekly_target': WEEKLY_TARGET,
        'daily_count': daily_count,
        'weekly_count': weekly_count,
        'daily_progress_pct': pct(daily_count, DAILY_TARGET),
        'weekly_progress_pct': pct(weekly_count, WEEKLY_TARGET),
        'week_start': week_start,
        'next_reset': week_start + timedelta(days=7),
    }
    # Build per-day series for the week (Mon-Sun) and cumulative counts
    days = [week_start + timedelta(days=i) for i in range(7)]
    daily_counts = []
    for d in days:
        cnt = job_applications.filter(
            Q(application_date=d) | Q(created_at__date=d)
        ).count()
        daily_counts.append(cnt)

    cumulative_counts = []
    running = 0
    for v in daily_counts:
        running += v
        cumulative_counts.append(running)

    cumulative_target = [(i + 1) * DAILY_TARGET for i in range(7)]

    # Prepare a Python dict for the weekly chart data so the template can
    # safely embed it using Django's json_script tag.
    targets['weekly_chart_data'] = {
        'labels': [d.strftime('%a') for d in days],
        'cumulativeCounts': cumulative_counts,
        'cumulativeTarget': cumulative_target,
        'dailyTarget': DAILY_TARGET,
    }
    # Also provide a JSON string so templates that don't have json_script
    # can safely embed the data in a <script type="application/json"> tag.
    targets['weekly_chart_json'] = json.dumps(targets['weekly_chart_data'])

    # Pass available status choices for the filter UI
    status_choices = JobApplication.STATUS_CHOICES

    # how many matched after filter (before pagination)
    matched_count = job_applications_qs.count()

    return {
        'user': request.user,
        'profile_form': profile_form,
        'job_application_form': job_application_form,
        'editing_application': (
            get_object_or_404(JobApplication, id=editing_application_id, user=request.user)
            if editing_application_id else None
        ),
        'job_applications': page_obj,  # paginated page object (iterable)
        'page_obj': page_obj,
        'paginator': paginator,
        'job_applications_count': matched_count,
        'stats': stats,
        'targets': targets,
        'is_dashboard': True,  # Flag to indicate dashboard mode
        'editing_application_id': editing_application_id,
        'show_job_form': show_job_form,
        'status_choices': status_choices,
        'active_sort': sort,
        'active_status': status_filter,
    }
