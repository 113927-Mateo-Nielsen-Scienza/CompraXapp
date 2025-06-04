import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router'; 
import { NavbarComponent } from './layout/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule, RouterModule], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CompraXApp-Frontend';
  currentYear = new Date().getFullYear();
}
