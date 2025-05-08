import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.models';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'roles', 'actions'];
  dataSource = new MatTableDataSource<User>([]);
  isLoading = true;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los usuarios';
        this.toastr.error(this.errorMessage, 'Error');
        this.isLoading = false;
      }
    });
  }

  editRoles(userId: number): void {
    this.router.navigate(['/admin/users', userId, 'roles']);
  }
}