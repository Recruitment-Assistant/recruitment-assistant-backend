import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { CandidateEntity } from './entities/candidate.entity';
import { CandidateRepository } from './repositories/candidate.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateEntity])],
  controllers: [CandidateController],
  providers: [CandidateService, CandidateRepository],
})
export class CandidateModule {}
