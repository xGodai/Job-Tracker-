from django import forms
from .models import JobApplication
from django.core.exceptions import ValidationError


class JobApplicationForm(forms.ModelForm):
    """Form for creating and updating job applications"""
    
    class Meta:
        model = JobApplication
        fields = [
            'company_name', 'position_title', 'job_description', 'application_date',
            'status', 'job_url', 'contact_person', 'contact_email', 'contact_phone',
            'salary_range', 'location', 'notes',
            # file uploads
            'cv', 'cover_letter'
        ]
        widgets = {
            'application_date': forms.DateInput(attrs={'type': 'date'}),
            'job_description': forms.Textarea(attrs={'rows': 3}),
            'notes': forms.Textarea(attrs={'rows': 3}),
            'cv': forms.FileInput(attrs={'accept': 'application/pdf,.pdf'}),
            'cover_letter': forms.FileInput(attrs={'accept': 'application/pdf,.pdf'}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Add CSS classes and IDs for styling and accessibility
        for field_name, field in self.fields.items():
            # Set explicit ID for proper label association
            field.widget.attrs['id'] = f'id_{field_name}'
            # Clear help_text to prevent aria-describedby from being added
            field.help_text = ''
            
            if isinstance(field.widget, forms.CheckboxInput):
                field.widget.attrs['class'] = 'form-check-input'
            elif isinstance(field.widget, forms.Select):
                field.widget.attrs['class'] = 'form-select'
            else:
                # For file inputs we want the plain input appearance; Bootstrap's
                # file input works with form-control in many setups, keep it consistent.
                field.widget.attrs['class'] = field.widget.attrs.get('class', '') + ' form-control'
        
        # Set placeholders for better UX
        self.fields['company_name'].widget.attrs['placeholder'] = 'e.g., Google, Microsoft, Startup Inc.'
        self.fields['position_title'].widget.attrs['placeholder'] = 'e.g., Software Engineer, Data Scientist'
        self.fields['job_url'].widget.attrs['placeholder'] = 'https://...'
        self.fields['contact_person'].widget.attrs['placeholder'] = 'e.g., John Smith (HR Manager)'
        self.fields['contact_email'].widget.attrs['placeholder'] = 'recruiter@company.com'
        self.fields['contact_phone'].widget.attrs['placeholder'] = '+44 1234 567890'
        self.fields['salary_range'].widget.attrs['placeholder'] = 'e.g., £40,000 - £55,000'
        self.fields['location'].widget.attrs['placeholder'] = 'e.g., New York, NY or Remote'
        self.fields['notes'].widget.attrs['placeholder'] = 'Any additional notes or thoughts about this application...'
        # Allow the view to default application_date if user leaves it blank.
        # The model requires application_date, but making the form field optional
        # lets us set a sensible default (today) server-side before saving.
        if 'application_date' in self.fields:
            self.fields['application_date'].required = False

    def clean_cv(self):
        file = self.cleaned_data.get('cv')
        if file:
            # Validate content type and size
            content_type = getattr(file, 'content_type', '')
            if content_type != 'application/pdf' and not str(file.name).lower().endswith('.pdf'):
                raise ValidationError('CV must be a PDF file.')
            max_size = 5 * 1024 * 1024  # 5 MB
            if file.size > max_size:
                raise ValidationError('CV file size must be 5 MB or smaller.')
        return file

    def clean_cover_letter(self):
        file = self.cleaned_data.get('cover_letter')
        if file:
            content_type = getattr(file, 'content_type', '')
            if content_type != 'application/pdf' and not str(file.name).lower().endswith('.pdf'):
                raise ValidationError('Cover letter must be a PDF file.')
            max_size = 5 * 1024 * 1024  # 5 MB
            if file.size > max_size:
                raise ValidationError('Cover letter file size must be 5 MB or smaller.')
        return file