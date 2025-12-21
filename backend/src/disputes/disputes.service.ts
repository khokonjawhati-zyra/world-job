import { Injectable } from '@nestjs/common';
import { Dispute } from './dispute.model';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class DisputesService {
  private disputes: Dispute[] = [];

  constructor(private projectsService: ProjectsService) {}

  create(data: any) {
    // Validate Project Exists
    const project = this.projectsService.findOne(data.projectId);
    if (!project) throw new Error('Project not found');

    const dispute = new Dispute(
      Date.now().toString(),
      data.projectId,
      data.initiatorId,
      data.reason,
      'open',
      new Date(),
    );
    this.disputes.push(dispute);

    // Flag project as disputed
    this.projectsService.flagDispute(data.projectId);

    return dispute;
  }

  findAll() {
    return this.disputes;
  }
}
