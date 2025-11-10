from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from pypdf import PdfReader
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
from dotenv import load_dotenv
import os


@login_required
def cv_checker(request):
    if request.method == "POST":
        # placeholder logic for AI
        pass
    if request.method == "GET":
        return render(request, "ai_checker/cv_checker.html")


@login_required
def cover_letter_checker(request):
    if request.method == "POST":
        job_description = request.POST.get('job_description')
        cover_letter = request.FILES.get('cover_letter')
        cover_letter_as_text = read_pdf(cover_letter)
        feedback = call_ai(cover_letter_as_text, job_description)
        return render(request, "ai_checker/cover_letter_feedback.html", {"feedback": feedback})

    if request.method == "GET":
        return render(request, "ai_checker/cover_letter_checker.html")


def read_pdf(pdf):
    try:
        reader = PdfReader(pdf)
    except Exception as e:
        return f"an error has occured with the pdf reader {e} please contact support"
    pages = []
    text = ""
    for page in reader.pages:
        pages.append(page)
        text += page.extract_text()
    return text


def call_ai(cover_letter, job_description):
    # Read the API key from Django settings (settings.py defines `API_key`)
    load_dotenv()
    API_key = os.getenv('AI_API_KEY')
    if not API_key:
        # Helpful runtime error if the key isn't configured
        raise RuntimeError("AI API key is not configured. Set API_KEY in environment or settings.")

    API_address = "https://models.github.ai/inference"
    model = "mistral-ai/mistral-small-2503"
    client = ChatCompletionsClient(endpoint=API_address, credential=AzureKeyCredential(API_key))

    prompt = (
        "Here is a cover letter and the job description. "
        "Give feedback on how to improve the cover letter and give it a score out of 10.\n\n"
        f"Cover letter:\n{cover_letter}\n\nJob description:\n{job_description}"
    )
    try:
        response = client.complete(
            messages=[
                SystemMessage("You are an assistant that provides constructive feedback."),
                UserMessage(prompt)],
            temperature=0.8,
            top_p=0.1,
            max_tokens=2048,
            model=model
        )
    except Exception as e:
        return f"error: Something has gone wrong with the AI, {e} please contact support"

    try:
        feedback = response.choices[0].message.content
    except Exception:
        feedback = str(response)
    return feedback
