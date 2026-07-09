from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from .forms import UserSignupForm, ProfileUpdateForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages

def signup_view(request):
    if request.user.is_authenticated:
        return redirect('home')
    if request.method == 'POST':
        form = UserSignupForm(request.POST)
        if form.is_value := form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            login(request, user)
            messages.success(request, f"Welcome to Ink & Paper, {user.first_name}!")
            return redirect('home')
    else:
        form = UserSignupForm()
    return render(request, 'accounts/signup.html', {'form': form})


def login_view(request):
    if request.user.is_authenticated:
        return redirect('home')
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f"Welcome back, {user.first_name}!")
                return redirect('home')
    else:
        form = AuthenticationForm()
    return render(request, 'accounts/login.html', {'form': form})


def logout_view(request):
    logout(request)
    messages.info(request, "You have logged out successfully.")
    return redirect('home')


@login_required
def profile_view(request):
    if request.method == 'POST':
        p_form = ProfileUpdateForm(request.POST, instance=request.user.profile)
        if p_form.is_valid():
            p_form.save()
            messages.success(request, "Your default delivery settings have been saved!")
            return redirect('accounts:profile')
    else:
        p_form = ProfileUpdateForm(instance=request.user.profile)
    
    context = {
        'p_form': p_form
    }
    return render(request, 'accounts/profile.html', context)
