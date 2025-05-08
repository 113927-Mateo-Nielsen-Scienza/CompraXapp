import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { TokenService } from '../../../services/token.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile',
  imports: [],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  updateForm: FormGroup;
  isSubmitting = false;
  isLoading = true;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.updateForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: [{ value: '', disabled: true }],
      shippingAddress: ['', Validators.maxLength(255)]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userId = this.tokenService.getUserId();
    
    if (!userId) {
      this.toastr.error('Sesión no válida', 'Error');
      this.router.navigate(['/login']);
      return;
    }
    
    this.userService.getUserProfile(userId).subscribe({
      next: (data) => {
        this.updateForm.patchValue({
          name: data.name,
          email: data.email,
          shippingAddress: data.shippingAddress || ''
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'No se pudo cargar la información del perfil';
        this.isLoading = false;
        this.toastr.error(this.errorMessage, 'Error');
      }
    });
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const userId = this.tokenService.getUserId();
    
    if (!userId) {
      this.toastr.error('Sesión no válida', 'Error');
      this.router.navigate(['/login']);
      return;
    }

    const updateData = {
      name: this.updateForm.get('name')?.value,
      shippingAddress: this.updateForm.get('shippingAddress')?.value
    };

    this.userService.updateUser(userId, updateData).subscribe({
      next: (data) => {
        this.toastr.success('Perfil actualizado correctamente', 'Éxito');
        // Actualizar el usuario en el almacenamiento local
        const user = this.tokenService.getUser();
        user.name = data.name;
        this.tokenService.saveUser(user);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Error al actualizar el perfil';
        this.toastr.error(this.errorMessage, 'Error');
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}