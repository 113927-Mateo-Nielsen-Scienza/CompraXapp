import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { 
  AdminService, 
  ProductSalesDTO, 
  SalesReportDTO,
  UserPurchaseStatisticsDTO,
  ReportsSummary
} from '../admin.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  // ⚠️ SIMPLIFICAR: Solo mantener lo que funciona
  activeTab: 'products' | 'sales' | 'users' | 'summary' = 'summary';
  
  // Report data
  productSalesStats: ProductSalesDTO[] = [];
  salesReport: SalesReportDTO | null = null;
  userStatistics: UserPurchaseStatisticsDTO[] = [];
  reportsSummary: any = null;
  
  loading = false;
  
  // Solo formulario de sales report
  salesReportForm!: FormGroup;

  // Sales report options
  salesPeriodOptions = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 },
    { label: 'Custom Range', value: 'custom' }
  ];

  // Messages
  successMessage = '';
  errorMessage = '';

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.initializeSalesReportForm();
  }

  ngOnInit(): void {
    this.loadReportsSummary();
    this.loadProductSalesStats(); // ✅ Sin filtros por ahora
  }

  // ❌ REMOVER: initializeForm() y loadCategories()

  private initializeSalesReportForm(): void {
    this.salesReportForm = this.fb.group({
      period: [30],
      startDate: [''],
      endDate: ['']
    });

    this.salesReportForm.valueChanges.subscribe(() => {
      if (this.activeTab === 'sales') {
        this.loadSalesReport();
      }
    });
  }

  // ✅ SIMPLIFICAR: Sin filtros complejos
  loadProductSalesStats(): void {
    this.loading = true;
    this.clearMessages();

    this.adminService.getProductSalesStatistics().subscribe({
      next: (stats) => {
        this.productSalesStats = stats;
        this.loading = false;
        this.showSuccess(`Loaded ${stats.length} product statistics`);
      },
      error: (error) => {
        console.error('Error loading product sales stats:', error);
        this.loading = false;
        this.showError('Failed to load product statistics. Please check if you are logged in as admin.');
      }
    });
  }

  loadReportsSummary(): void {
    this.loading = true;
    this.adminService.getReportsSummary().subscribe({
      next: (summary) => {
        this.reportsSummary = summary;
        this.loading = false;
        this.showSuccess('Summary loaded successfully');
      },
      error: (error) => {
        console.error('Error loading reports summary:', error);
        this.loading = false;
        this.showError('Failed to load reports summary. Please check your admin permissions.');
      }
    });
  }

  loadSalesReport(): void {
    this.loading = true;
    const formValue = this.salesReportForm.value;
    
    let days: number | undefined;
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (formValue.period === 'custom') {
      if (formValue.startDate) startDate = new Date(formValue.startDate);
      if (formValue.endDate) endDate = new Date(formValue.endDate);
    } else {
      days = formValue.period;
    }

    this.adminService.getSalesReportForPeriod(days, startDate, endDate).subscribe({
      next: (report) => {
        this.salesReport = report;
        this.loading = false;
        this.showSuccess('Sales report loaded successfully');
      },
      error: (error) => {
        console.error('Error loading sales report:', error);
        this.loading = false;
        this.showError('Failed to load sales report');
      }
    });
  }

  loadUserStatistics(): void {
    this.loading = true;
    this.adminService.getUserPurchaseStatistics().subscribe({
      next: (stats) => {
        this.userStatistics = stats;
        this.loading = false;
        this.showSuccess(`Loaded ${stats.length} user statistics`);
      },
      error: (error) => {
        console.error('Error loading user statistics:', error);
        this.loading = false;
        this.showError('Failed to load user statistics');
      }
    });
  }

  switchTab(tab: 'products' | 'sales' | 'users' | 'summary'): void {
    this.activeTab = tab;
    this.clearMessages();

    switch (tab) {
      case 'products':
        if (this.productSalesStats.length === 0) {
          this.loadProductSalesStats();
        }
        break;
      case 'sales':
        this.loadSalesReport();
        break;
      case 'users':
        if (this.userStatistics.length === 0) {
          this.loadUserStatistics();
        }
        break;
      case 'summary':
        if (!this.reportsSummary) {
          this.loadReportsSummary();
        }
        break;
    }
  }

  isSalesCustomRange(): boolean {
    return this.salesReportForm.get('period')?.value === 'custom';
  }

  hasData(): boolean {
    switch (this.activeTab) {
      case 'products':
        return this.productSalesStats && this.productSalesStats.length > 0;
      case 'sales':
        return this.salesReport !== null;
      case 'users':
        return this.userStatistics && this.userStatistics.length > 0;
      case 'summary':
        return this.reportsSummary !== null;
      default:
        return false;
    }
  }

  // ❌ REMOVER: Métodos relacionados con filtros, exportación, etc.
  // buildFilter(), exportStats(), resetFilters(), isCustomRange(), etc.

  // Messages methods
  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 3000);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 5000);
  }

  private clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
