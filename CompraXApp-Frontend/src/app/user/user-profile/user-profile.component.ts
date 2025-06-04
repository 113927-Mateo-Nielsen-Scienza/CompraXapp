import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserService, UserProfile, UserUpdateRequest } from '../user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = true;
  isSaving = false;
  successMessage = '';
  errorMessage = '';
  userProfile: UserProfile | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      email: [{value: '', disabled: true}], // Email readonly, no se envía
      name: ['', [Validators.required, Validators.minLength(2)]], // Required
      shippingAddress: [''] // Opcional
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'You must be logged in to view your profile.';
      this.isLoading = false;
      return;
    }
    
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    console.log('Loading user profile...');
    
    this.userService.getMyProfile().subscribe({
      next: (profile) => {
        console.log('Profile loaded successfully:', profile);
        this.userProfile = profile;
        
        // Cargar datos en el formulario
        this.profileForm.patchValue({
          email: profile.email || '',
          name: profile.name || '',
          shippingAddress: profile.shippingAddress || ''
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.errorMessage = err.message || 'Failed to load profile. Please refresh the page.';
        this.isLoading = false;
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formValue = this.profileForm.getRawValue();
    
    // ✅ CORREGIDO: Enviar SIEMPRE name y email como requiere el backend
    const updateRequest: UserUpdateRequest = {
      name: formValue.name.trim(), // ✅ SIEMPRE enviar (requerido)
      email: formValue.email, // ✅ SIEMPRE enviar (requerido, aunque readonly)
      shippingAddress: formValue.shippingAddress?.trim() || undefined // ✅ Opcional
    };

    console.log('Sending update request:', updateRequest);

    this.userService.updateMyProfile(updateRequest).subscribe({
      next: (updatedProfile) => {
        console.log('Profile updated successfully:', updatedProfile);
        this.userProfile = updatedProfile;
        this.successMessage = 'Profile updated successfully!';
        this.isSaving = false;
        
        // Actualizar formulario con datos actualizados
        this.profileForm.patchValue({
          email: updatedProfile.email || '',
          name: updatedProfile.name || '',
          shippingAddress: updatedProfile.shippingAddress || ''
        });
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        
        if (err.message) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = 'Failed to update profile. Please try again.';
        }
        
        this.isSaving = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      this.profileForm.get(key)?.markAsTouched();
    });
  }

  // Getters para validaciones en el template
  get name() { return this.profileForm.get('name'); }
  get shippingAddress() { return this.profileForm.get('shippingAddress'); }
}
