import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { UserProfileComponent } from './components/profile/user-profile/user-profile.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';
import { DeleteAccountComponent } from './components/profile/delete-account/delete-account.component';
import { PurchaseHistoryComponent } from './components/profile/purchase-history/purchase-history.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { EditUserRolesComponent } from './components/admin/edit-user-roles/edit-user-roles.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';


const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { 
      path: 'profile', 
      component: UserProfileComponent, 
      canActivate: [AuthGuard] 
    },
    { 
      path: 'profile/edit', 
      component: EditProfileComponent, 
      canActivate: [AuthGuard] 
    },
    { 
      path: 'profile/delete', 
      component: DeleteAccountComponent, 
      canActivate: [AuthGuard] 
    },
    { 
      path: 'profile/purchase-history', 
      component: PurchaseHistoryComponent, 
      canActivate: [AuthGuard] 
    },
    { 
      path: 'admin',
      redirectTo: '/admin/users',
      pathMatch: 'full'
    },
    { 
      path: 'admin/users', 
      component: UserManagementComponent, 
      canActivate: [AuthGuard, AdminGuard] 
    },
    { 
      path: 'admin/users/:id/roles', 
      component: EditUserRolesComponent, 
      canActivate: [AuthGuard, AdminGuard] 
    },
    { path: '**', redirectTo: '/login' }
  ];
  