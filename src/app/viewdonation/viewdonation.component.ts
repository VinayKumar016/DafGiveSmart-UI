import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonationService } from '../services/donation.service';
import { CharityService } from '../services/charity.service';
import { DAFService } from '../services/daf.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-viewdonation',
  templateUrl: './viewdonation.component.html',
  styleUrls: ['./viewdonation.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterModule]
})
export class ViewDonationComponent implements OnInit {
  userId: number = 0;
  userName: string = '';
  dafBalance: number = 0;
  totalDonations: number = 0;
  donations: any[] = [];
  allCharities: any[] = [];
  filteredDonations: any[] = [];
  charitiesDonatedTo: string[] = [];
  uniqueSectors: string[] = [];
  selectedSector: string = '';
  selectedDuration: string = '';

  constructor(
    private donationService: DonationService,
    private charityService: CharityService,
    private dafService: DAFService
  ) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    this.userName = localStorage.getItem('userName') || '';
    this.fetchDAFData();
    this.fetchCharities();
    this.fetchDonations();
    console.log(this.donations);
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

  fetchCharities(): void {
    this.charityService.getAllCharities().subscribe({
      next: (charities) => {
        this.allCharities = charities;
        this.uniqueSectors = [
          ...new Set(charities.map((charity) => charity.category))
        ]; // Extract unique sectors (categories)
      },
      error: () => {
        console.error('Error loading charities');
      }
    });
  }

  fetchDonations(): void {
    this.donationService.getUserDonations(this.userId).subscribe({
      next: (donations) => {
        this.donations = donations.map((donation) => {
          const charity = this.allCharities.find(
            (c) => c.charityId === donation.charityId
          );
          return {
            ...donation,
            charityName: charity ? charity.name : 'Unknown',
            sector: charity ? charity.category : 'Unknown'
          };
        });

        const donatedCharityIds = new Set<number>();
        donations.forEach((donation) => donatedCharityIds.add(donation.charityId));

        this.charitiesDonatedTo = Array.from(donatedCharityIds)
          .map((id) => {
            const charity = this.allCharities.find((c) => c.charityId === id);
            return charity ? charity.name : 'Unknown';
          })
          .filter((name) => name !== 'Unknown');

        
        this.filteredDonations = [...this.donations];
      },
      error: () => {
        console.error('Error fetching donations');
      }
    });
    
  }

  filterTable(): void {
    const today = new Date();

    this.filteredDonations = this.donations.filter((donation) => {
      const donationDate = new Date(donation.date);
      const timeDifference = today.getTime() - donationDate.getTime(); // Time difference in milliseconds
      const monthsDifference =
        (today.getFullYear() - donationDate.getFullYear()) * 12 +
        (today.getMonth() - donationDate.getMonth());

      const matchesSector =
        !this.selectedSector || donation.sector === this.selectedSector;

      const matchesDuration =
        !this.selectedDuration ||
        (this.selectedDuration === '24hours' && timeDifference <= 24 * 60 * 60 * 1000) || // Last 24 hours
        (this.selectedDuration !== '24hours' && monthsDifference <= Number(this.selectedDuration)); // Other durations

      return matchesSector && matchesDuration;
    });
  }

  clearFilters(): void {
    this.selectedSector = '';
    this.selectedDuration = '';
    this.filteredDonations = [...this.donations];
  }

  logout(): void {
    localStorage.clear();
  }
}