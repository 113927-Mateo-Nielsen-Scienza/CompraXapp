import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.css'
})
export class AdminReportsComponent implements OnInit {
  isLoading = true;
  
  reports = [
    {
      title: 'Sales Report',
      description: 'Monthly sales analysis and trends',
      icon: '📊',
      color: 'primary',
      data: { total: '$12,345', growth: '+15%' }
    },
    {
      title: 'Product Performance',
      description: 'Best and worst performing products',
      icon: '📈',
      color: 'secondary',
      data: { bestseller: 'Product A', growth: '+23%' }
    },
    {
      title: 'User Analytics',
      description: 'User registration and activity metrics',
      icon: '👥',
      color: 'warning',
      data: { newUsers: '156', retention: '78%' }
    },
    {
      title: 'Inventory Report',
      description: 'Stock levels and reorder recommendations',
      icon: '📦',
      color: 'danger',
      data: { lowStock: '5 items', value: '$8,950' }
    }
  ];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    // Simular carga de datos
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  generateReport(reportType: string): void {
    alert(`Generating ${reportType} report...`);
  }

  exportReport(reportType: string): void {
    alert(`Exporting ${reportType} report...`);
  }
}
