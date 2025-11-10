from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from pypdf import PdfReader
import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential


@login_required
def cv_checker(request):
    if request.method == "POST":
        # placeholder logic for AI
        pass
    if request.method == "GET":
        return render(request, "cv_checker.html")


@login_required
def cover_letter_checker(request):
    if request.method == "POST":
        call_ai()
        pass

    if request.method == "GET":
        return render(request, "cover_letter_checker.html")


def read_pdf(pdf):
    reader = PdfReader(pdf)
    pages = []
    text = ""
    for page in reader.pages:
        pages.append(page)
        text += page.extract_text()
    return text


def call_ai(cover_letter, job_description):
    API_key = os.getenv("API_KEY")
    API_address = "https://models.github.ai/inference"
    model = "mistral-ai/mistral-small-2503"
    client = ChatCompletionsClient(endpoint=API_address, credential=AzureKeyCredential(API_key),)

    response = client.complete(
        messages=[
            SystemMessage("here is a cover letter and the provided job description, " +
                          "give feedback on how to improve the cover letter and give it a score out of 10"),
            UserMessage(f"cover letter: {cover_letter} \n job description: + {job_description}")],
        temperature=0.8,
        top_p=0.1,
        max_tokens=2048,
        model=model
    )
    return response
