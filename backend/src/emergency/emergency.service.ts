import { Injectable } from '@nestjs/common';

@Injectable()
export class EmergencyService {
  private activeEmergencies = [
    {
      id: 1,
      title: 'Flood Response - Region A',
      location: 'Region A',
      severity: 'Critical',
      status: 'Active',
      requiredSkills: ['Rescue', 'First Aid', 'Logistics'],
      deployedWorkers: 45,
      agencies: ['Red Cross', 'Local Govt'],
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Power Outage Support - City Center',
      location: 'City Center',
      severity: 'High',
      status: 'Active',
      requiredSkills: ['Electrical', 'General Labor'],
      deployedWorkers: 12,
      agencies: ['PowerCorp'],
      timestamp: new Date().toISOString(),
    },
  ];

  createAlert(data: any) {
    const newAlert = {
      id: this.activeEmergencies.length + 1,
      ...data,
      status: 'Active',
      deployedWorkers: 0,
      timestamp: new Date().toISOString(),
    };
    this.activeEmergencies.push(newAlert);
    return newAlert;
  }

  getActiveEmergencies() {
    return this.activeEmergencies;
  }

  deployWorkers(data: any) {
    // Logic to find and notify workers would go here
    return {
      success: true,
      message: `Deploying ${data.count} workers to ${data.emergencyId}`,
    };
  }

  getTrackingData() {
    // Mock GPS data for workers
    return [
      { workerId: 101, lat: 34.0522, lng: -118.2437, status: 'On Site' },
      { workerId: 102, lat: 34.0525, lng: -118.244, status: 'In Transit' },
      { workerId: 103, lat: 34.052, lng: -118.2435, status: 'On Site' },
    ];
  }
}
