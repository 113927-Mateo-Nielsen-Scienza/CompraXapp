import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { TokenService } from '../../../services/token.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-account',
  imports: [],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css'
})
export class DeleteAccountComponent {
  isDeleting = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  confirmDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar eliminación',
        message: '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar cuenta',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAccount();
      }
    });
  }

  deleteAccount(): void {
    const userId = this.tokenService.getUserId();
    
    if (!userId) {
      this.toastr.error('Sesión no válida', 'Error');
      this.router.navigate(['/login']);
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.tokenService.signOut();
        this.toastr.success('Tu cuenta ha sido eliminada', 'Éxito');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Error al eliminar la cuenta';
        this.toastr.error(this.errorMessage, 'Error');
        this.isDeleting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}