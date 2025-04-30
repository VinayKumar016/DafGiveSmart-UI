import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DAFService } from '../services/daf.service';
import { DonationService } from '../services/donation.service';
import { CharityService } from '../services/charity.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userId: number = 0;
  userName: string = '';
  dafBalance: number = 0;
  totalDonations: number = 0;
  charitiesDonatedTo: string[] = [];

  allCharities: any[] = [];
  filteredCharities: any[] = [];
  uniqueCategories: string[] = [];
  uniqueLocations: string[] = [];

  selectedCategory: string = '';
  selectedLocation: string = '';
  searchQuery: string = '';
  router: any;

  constructor(
    private dafService: DAFService,
    private donationService: DonationService,
    private charityService: CharityService
  ) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    this.userName = localStorage.getItem('userName') || '';
    this.loadCharities();
    this.fetchDAFData();
    this.fetchDonations();
  }

  fetchDAFData() {
    this.dafService.getDAFAccount(this.userId).subscribe({
      next: (daf) => {
        this.dafBalance = daf.dafBalance;
        this.totalDonations = daf.totalDonated;
        console.log(daf);
        console.log('DAF Balance:', this.dafBalance);
        
      },
      error: (err) => {
        console.error('Error fetching DAF account:', err);
      }
    });
  }
  
  logout() {
    localStorage.clear();
  }

  fetchDonations() {
    this.donationService.getUserDonations(this.userId).subscribe({
      next: (donations) => {
        // this.totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
        // console.log('Total Donations:', this.totalDonations);
        const donatedCharityIds = new Set<number>();
        donations.forEach(d => donatedCharityIds.add(d.charityId));
  
        // Now match charity IDs to names from allCharities
        this.charitiesDonatedTo = Array.from(donatedCharityIds)
          .map(id => {
            const charity = this.allCharities.find(c => c.charityId === id);
            return charity ? charity.name : 'Unknown';
          })
          .filter(name => name !== 'Unknown');
      }
    });
  }

  loadCharities() {
    this.charityService.getAllCharities().subscribe({
      next: (charities) => {
        this.allCharities = charities;
        this.filteredCharities = [...charities];
        this.uniqueCategories = [...new Set(charities.map(c => c.category))];
        this.uniqueLocations = [...new Set(charities.map(c => c.location))];
      },
      error: () => {
        console.error('Error loading charities');
      }
    });
  }

  applyFilters() {
    this.filteredCharities = this.allCharities.filter(charity =>
      (!this.selectedCategory || charity.category === this.selectedCategory) &&
      (!this.selectedLocation || charity.location === this.selectedLocation) &&
      (!this.searchQuery || charity.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  filterCharities() {
    this.applyFilters();
  }

  navigateToDonate(charityId: number) {
    this.router.navigate(['/add'], { queryParams: { charityId } });
  }
}