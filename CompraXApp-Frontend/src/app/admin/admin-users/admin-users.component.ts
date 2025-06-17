import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { AuthService } from '../../auth/auth.service';
import { UserDTO } from '../admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: UserDTO[] = [];
  isLoading = true;
  errorMessage = '';
  searchKeyword = '';

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users: UserDTO[]) => {
        // ✅ FIX: Normalizar roles para asegurarnos de que sean arrays de strings
        this.users = users.map(user => ({
          ...user,
          roles: this.normalizeRoles(user.roles)
        }));
        this.isLoading = false;
        console.log('✅ Users loaded:', this.users);
      },
      error: (err: any) => {
        this.errorMessage = 'Error loading users';
        this.isLoading = false;
        console.error('❌ Error loading users:', err);
      }
    });
  }

  // ✅ FIX: Normalizar roles independientemente del formato que venga del backend
  private normalizeRoles(roles: any): string[] {
    if (!roles) return [];
    
    if (Array.isArray(roles)) {
      return roles.map(role => {
        if (typeof role === 'string') {
          return role;
        } else if (typeof role === 'object' && role.name) {
          return role.name; // Si es un objeto con propiedad 'name'
        } else if (typeof role === 'object' && role.authority) {
          return role.authority; // Si es un objeto con propiedad 'authority'
        } else {
          return String(role); // Convertir a string como último recurso
        }
      });
    }
    
    return [String(roles)]; // Si no es array, convertir a array de un elemento
  }

  // ✅ FIX: Método seguro para formatear roles
  formatRole(role: any): string {
    const roleStr = typeof role === 'string' ? role : String(role);
    return roleStr.replace('ROLE_', '');
  }

  // ✅ FIX: Método seguro para obtener clase CSS de rol
  getRoleClass(role: any): string {
    const roleStr = typeof role === 'string' ? role : String(role);
    const cleanRole = roleStr.toLowerCase().replace('role_', '');
    return `role-${cleanRole}`;
  }

  updateUserRoles(user: UserDTO, newRoles: string[]): void {
    this.adminService.updateUserRoles(user.id, newRoles).subscribe({
      next: () => {
        user.roles = newRoles;
        console.log('✅ User roles updated successfully');
      },
      error: (err: any) => {
        console.error('❌ Error updating user roles:', err);
      }
    });
  }

  grantAdminRole(user: UserDTO): void {
    const newRoles = user.roles.slice();
    newRoles.push('ROLE_ADMIN');
    this.updateUserRoles(user, newRoles);
  }

  removeAdminRole(user: UserDTO): void {
    const newRoles = user.roles.filter(role => {
      const roleStr = typeof role === 'string' ? role : String(role);
      return roleStr !== 'ROLE_ADMIN';
    });
    this.updateUserRoles(user, newRoles);
  }

  deleteUser(user: UserDTO): void {
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          console.log('✅ User deleted successfully');
        },
        error: (err: any) => {
          console.error('❌ Error deleting user:', err);
        }
      });
    }
  }

  hasRole(user: UserDTO, roleName: string): boolean {
    return user.roles.some(role => {
      const roleStr = typeof role === 'string' ? role : String(role);
      return roleStr === roleName;
    });
  }

  isCurrentUser(user: UserDTO): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? currentUser.email === user.email : false;
  }

  get filteredUsers(): UserDTO[] {
    if (!this.searchKeyword) {
      return this.users;
    }
    return this.users.filter(user => 
      user.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
  }
}
