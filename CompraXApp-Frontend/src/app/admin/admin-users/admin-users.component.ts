import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { AuthService } from '../../auth/auth.service';

interface User {
  id: number;
  email: string;
  username: string;
  enabled: boolean;
  createdAt: Date;
  roles: { name: string }[];
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
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
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
      }
    });
  }

  toggleUserRole(user: User, roleName: string): void {
    const hasRole = user.roles.some(role => role.name === roleName);
    let newRoles: string[];
    
    if (hasRole) {
      // Remover rol
      newRoles = user.roles
        .filter(role => role.name !== roleName)
        .map(role => role.name);
    } else {
      // Agregar rol
      newRoles = [...user.roles.map(role => role.name), roleName];
    }

    if (roleName === 'ROLE_ADMIN' && hasRole) {
      if (!confirm('Are you sure you want to remove admin privileges from this user?')) {
        return;
      }
    }

    this.adminService.updateUserRoles(user.id, newRoles).subscribe({
      next: () => {
        this.loadUsers(); // Recargar para mostrar cambios
      },
      error: (err) => {
        alert('Failed to update user roles: ' + (err.error?.error || 'Please try again'));
        console.error('Error updating roles:', err);
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user "${user.email}"? This action cannot be undone.`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          alert('User deleted successfully');
          this.loadUsers();
        },
        error: (err) => {
          alert('Failed to delete user: ' + (err.error?.error || 'Please try again'));
          console.error('Error deleting user:', err);
        }
      });
    }
  }

  hasRole(user: User, roleName: string): boolean {
    return user.roles.some(role => role.name === roleName);
  }

  isCurrentUser(user: User): boolean {
    return this.authService.currentUserValue?.email === user.email;
  }

  get filteredUsers(): User[] {
    if (!this.searchKeyword) return this.users;
    
    return this.users.filter(user => 
      user.email.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
      user.username.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
  }
}
