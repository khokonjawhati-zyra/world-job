import { Controller, Get, Param } from '@nestjs/common';

@Controller('metadata')
export class MetadataController {
  private readonly metaDataMap = {
    worker: {
      title: 'Remote Jobs & Freelance Projects | World Job Market',
      description:
        'Find high-paying remote jobs and freelance projects. Get verified, track time, and get paid securely via Escrow.',
      keywords:
        'freelance, remote jobs, work from home, escrow payments, gig economy',
      ogImage: 'https://worldjob.market/images/worker-og.jpg',
    },
    employer: {
      title: 'Hire Top Global Talent | World Job Market',
      description:
        'Post jobs and hire verified professionals. Smart AI matching, secure payments, and liability-free project management.',
      keywords:
        'hire freelancers, post jobs, remote talent, project management, secure hiring',
      ogImage: 'https://worldjob.market/images/employer-og.jpg',
    },
    investor: {
      title: 'Invest in High ROI Projects | World Job Market',
      description:
        'Discover pre-vetted investment opportunities with secure NDA protection and automated profit splitting.',
      keywords:
        'startup investment, project funding, high ROI, passive income, business angel',
      ogImage: 'https://worldjob.market/images/investor-og.jpg',
    },
    landing: {
      title: 'World Job Market | The Hybrid Investment Platform',
      description:
        "The world's first platform combining freelance work with direct project investment. Secure, Transparent, Profitable.",
      keywords:
        'hybrid platform, freelance investment, world job market, escrow, gig economy',
      ogImage: 'https://worldjob.market/images/main-og.jpg',
    },
  };

  @Get(':role')
  getMetadata(@Param('role') role: string) {
    const key = role.toLowerCase();
    return this.metaDataMap[key] || this.metaDataMap['landing'];
  }

  @Get()
  getDefaultMetadata() {
    return this.metaDataMap['landing'];
  }
}
