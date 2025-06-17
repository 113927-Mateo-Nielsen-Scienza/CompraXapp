import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, UserProfileResponse, UserUpdateRequest } from '../user.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfileResponse | null = null;
  isEditing = false;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  profileForm: FormGroup;
  originalFormValues: any = {};

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      name: [{value: '', disabled: true}, [Validators.required, Validators.minLength(2)]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      shippingAddress: [{value: '', disabled: true}]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getMyProfile().subscribe({
      next: (profile: UserProfileResponse) => {
        this.userProfile = profile;
        
        const formData = {
          name: profile.name,
          email: profile.email,
          shippingAddress: profile.shippingAddress || ''
        };
        
        this.profileForm.patchValue(formData);
        this.originalFormValues = { ...formData };
        // Enable form if it was loaded successfully and user might want to edit
        // this.toggleEdit(false); // Or based on some other logic
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Error loading profile. Please try again.';
        this.isLoading = false;
        console.error('Error loading profile:', err);
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData: UserUpdateRequest = {
      name: this.profileForm.value.name.trim(),
      email: this.profileForm.value.email.trim(),
      shippingAddress: this.profileForm.value.shippingAddress?.trim() || ''
    };

    this.userService.updateMyProfile(updateData).subscribe({
      next: (updatedProfile: any) => {
        if (this.userProfile) {
          this.userProfile.name = updatedProfile.name || updateData.name;
          this.userProfile.email = updatedProfile.email || updateData.email;
          this.userProfile.shippingAddress = updatedProfile.shippingAddress || updateData.shippingAddress;
        }
        
        this.originalFormValues = { ...this.profileForm.value };
        
        this.successMessage = 'Profile updated successfully';
        this.isEditing = false;
        this.toggleEditState(false); // Disable form after saving
        this.isSaving = false;
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err: any) => {
        this.errorMessage = 'Error updating profile. Please try again.';
        this.isSaving = false;
        console.error('Error updating profile:', err);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.clearMessages();
    this.toggleEditState(this.isEditing);
  }

  private toggleEditState(enable: boolean): void {
    if (enable) {
      this.profileForm.get('name')?.enable();
      this.profileForm.get('email')?.enable();
      this.profileForm.get('shippingAddress')?.enable();
    } else {
      this.profileForm.get('name')?.disable();
      this.profileForm.get('email')?.disable();
      this.profileForm.get('shippingAddress')?.disable();
      if (!this.isEditing) { // If toggling off editing, restore original values
          this.profileForm.patchValue(this.originalFormValues);
          this.profileForm.markAsUntouched();
      }
    }
  }


  cancelEdit(): void {
    this.isEditing = false;
    this.toggleEditState(false);
    this.profileForm.patchValue(this.originalFormValues);
    this.profileForm.markAsUntouched();
    this.clearMessages();
  }

  // ✅ MÉTODO para validar campos del formulario
  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // ✅ MÉTODO para obtener errores de campos
  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `This field is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email';
      }
      if (field.errors['minlength']) {
        return `Must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  // ✅ MÉTODO para marcar todos los campos como tocados
  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  // ✅ MÉTODO para limpiar mensajes
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // ✅ MÉTODO para solicitar cambio de contraseña
  requestPasswordReset(): void {
    if (this.userProfile?.email) {
      this.authService.requestPasswordReset(this.userProfile.email).subscribe({
        next: () => {
          this.successMessage = 'A password reset link has been sent to your email.';
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (err: any) => {
          this.errorMessage = 'Error requesting password reset.';
          console.error('Error requesting password reset:', err);
        }
      });
    }
  }

  // ✅ MÉTODO para eliminar cuenta
  deleteAccount(): void {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      const doubleConfirmed = confirm(
        'WARNING: All your data will be permanently deleted. Continue?'
      );
      
      if (doubleConfirmed) {
        this.userService.deleteMyAccount().subscribe({
          next: () => {
            alert('Your account has been successfully deleted.');
            this.authService.logout();
            this.router.navigate(['/']);
          },
          error: (err: any) => {
            this.errorMessage = 'Error deleting account.';
            console.error('Error deleting account:', err);
          }
        });
      }
    }
  }
}
