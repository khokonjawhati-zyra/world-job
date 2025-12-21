import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.projectsService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.projectsService.delete(id);
  }

  @Post(':id/update') // Alternative to PUT if desired, but PUT is standard
  update(@Param('id') id: string, @Body() body: any) {
    return this.projectsService.update(id, body);
  }

  @Get('transactions')
  getRecentTransactions() {
    return this.projectsService.getRecentTransactions();
  }

  @Post(':id/milestones')
  addMilestone(
    @Param('id') id: string,
    @Body() body: { description: string; amount: number },
  ) {
    return this.projectsService.addMilestone(id, body.description, body.amount);
  }

  @Post(':id/milestones/:mid/submit')
  submitMilestone(@Param('id') id: string, @Param('mid') mid: string) {
    return this.projectsService.submitMilestone(id, mid);
  }

  @Post(':id/milestones/:mid/approve')
  approveMilestone(@Param('id') id: string, @Param('mid') mid: string) {
    return this.projectsService.approveMilestone(id, mid);
  }

  @Get('pitches')
  getPitches() {
    return this.projectsService.getPitches();
  }

  @Post(':id/fund/:amount/:investorId')
  fundProject(
    @Param('id') id: string,
    @Param('amount') amount: string,
    @Param('investorId') investorId: string,
  ) {
    return this.projectsService.fundProject(id, Number(amount), investorId);
  }

  @Post(':id/complete')
  completeProject(@Param('id') id: string) {
    return this.projectsService.completeProject(id);
  }



  @Get('admin/pending-releases')
  getPendingReleases() {
    return this.projectsService.getPendingReleases();
  }

  @Post('admin/release/:projectId/:milestoneId')
  releaseMilestone(
    @Param('projectId') projectId: string,
    @Param('milestoneId') milestoneId: string,
  ) {
    return this.projectsService.adminReleaseMilestone(projectId, milestoneId);
  }

  @Post(':id/apply')
  applyForJob(@Param('id') id: string, @Body() body: { workerId: string }) {
    return this.projectsService.apply(id, body.workerId);
  }
}
