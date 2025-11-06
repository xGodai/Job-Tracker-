from django.shortcuts import render
from django.contrib.auth.decorators import login_required


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
        # placeholder logic for AI
        pass
    if request.method == "GET":
        return render(request, "cover_letter_checker.html")
