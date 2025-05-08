import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { UserProfileResponse } from '../../../models/user.models';
import { TokenService } from '../../../services/token.service';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfileResponse | null = null;
  isLoading = true;
  errorMessage = '';
  
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userId = this.tokenService.getUserId();
    
    if (!userId) {
      this.toastr.error('Sesión no válida', 'Error');
      this.router.navigate(['/login']);
      return;
    }
    
    this.userService.getUserProfile(userId).subscribe({
      next: (data) => {
        this.userProfile = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'No se pudo cargar la información del perfil';
        this.isLoading = false;
        this.toastr.error(this.errorMessage, 'Error');
      }
    });
  }

  navigateToEditProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  navigateToDeleteAccount(): void {
    this.router.navigate(['/profile/delete']);
  }

  navigateToPurchaseHistory(): void {
    this.router.navigate(['/profile/purchase-history']);
  }
}