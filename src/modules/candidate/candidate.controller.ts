import { Controller } from '@nestjs/common';
import { CandidateService } from './candidate.service';

@Controller({ path: 'candidates', version: '1' })
export class CandidateController {
  constructor(private readonly service: CandidateService) {}
}
