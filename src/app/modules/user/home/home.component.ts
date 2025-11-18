import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  user: any;
  isLoading = false;
  error: string | null = null;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [50, 100, 500];
  sortModel: any[] = [];
  filterModel: any = {};
  globalSearch = '';
  selectedEntity: string = '';

  active_integration = [
    { value: 'github', label: 'GitHub' },
  ]
  entities = [
    { value: 'organizations', label: 'Organizations' },
    { value: 'repos', label: 'Repositories' },
    { value: 'commits', label: 'Commits' },
    { value: 'pulls', label: 'Pull Requests' },
    { value: 'issues', label: 'Issues' },
    { value: 'users', label: 'Users' },
  ];

  processed_entities = [
    { value: 'processed_commits', label: 'Processed Commits' },
  ]

  data: any[] = [];
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  connectedAt: any;
status=false;
  constructor(private auth: AuthService, private router: Router) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    if (this.entities.length > 0) {
      this.selectedEntity = this.entities[0].value;
      this.getInfo();
      this.connectedAt=this.auth.getConnectionTime();
      this.status=this.auth.isLogin();
    }
  }

  getInfo(entity?: string) {
    if (entity) {
      this.selectedEntity = entity;
    }

    if (!this.selectedEntity) return;

    this.isLoading = true;
    this.error = null;

    const body = {
      startRow: this.currentPage * this.pageSize,
      endRow: (this.currentPage + 1) * this.pageSize,
      sortModel: this.sortModel,
      filterModel: this.filterModel,
      globalSearch: this.globalSearch,
    };

    this.auth.post('query/' + this.selectedEntity, body).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.data = res.data.rows || [];
          this.totalRows = res.data.lastRow || 0;

          if (this.data.length) {
            const sample = this.data[0];
            this.displayedColumns = Object.keys(sample).filter(
              key => key !== 'author' && key !== 'committer'
            );

            // Add nested columns manually
            if (sample.author) this.displayedColumns.push('author.name');
            if (sample.committer) this.displayedColumns.push('committer.name');
          }

          if (this.paginator) this.paginator.length = this.totalRows;
        } else {
          this.error = res.message || 'Failed to fetch data. Please try again.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Data fetch failed:', err);
        this.error = 'An error occurred while fetching data.';
        this.isLoading = false;
      },
    });
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : null), obj);
  }


  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getInfo();
  }

  sortData(column: string) {
    if (this.sortModel.length && this.sortModel[0].colId === column) {
      this.sortModel[0].sort = this.sortModel[0].sort === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortModel = [{ colId: column, sort: 'asc' }];
    }

    this.getInfo();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.globalSearch = filterValue.trim().toLowerCase();

    // Reset  page
    this.paginator.pageIndex = 0;
    this.currentPage = 0;
    this.getInfo();
  }

  logout() {
    this.auth.removeIntegration().subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          localStorage.clear();
          this.auth.setLoginStatus(false);
          this.router.navigate(['/']);
        }
      }
    })
  }

  sync() {
    this.isLoading = true;
    this.error = null;

    this.auth.get('github/sync').subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.getInfo();
        } else {
          this.error = res.message || 'Sync failed. Please try again.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Sync failed:', err);
        this.error = 'An error occurred during the sync.';
        this.isLoading = false;
      },
    });
  }
}
