import { GENDER } from '@common/constants/entity.enum';
import {
  EnumFieldOptional,
  StringField,
  StringFieldOptional,
} from '@common/decorators/field.decorators';
import { Uuid } from '@common/types/common.type';
import { FileEntity } from '@database/entities/file.entity';
import { Expose } from 'class-transformer';
import { CANDIDATE_SOURCE } from '../constant';

@Expose()
export class CreateCandidateDto {
  organizationId: Uuid;

  createdBy: Uuid;

  @StringField({ name: 'full_name' })
  @Expose({ name: 'full_name' })
  fullName!: string;

  @StringField()
  @Expose()
  email!: string;

  @StringField({ name: 'phone_number' })
  @Expose({ name: 'phone_number' })
  phoneNumber!: string;

  @StringField()
  @Expose()
  address?: string;

  @EnumFieldOptional(() => GENDER)
  @Expose()
  gender?: string;

  @StringFieldOptional({ name: 'date_of_birth' })
  @Expose({ name: 'date_of_birth' })
  dateOfBirth?: Date;

  @StringFieldOptional({ name: 'linkedin_profile' })
  @Expose({ name: 'linkedin_profile' })
  linkedinProfile?: string;

  @StringFieldOptional({ name: 'portfolio_url' })
  @Expose({ name: 'portfolio_url' })
  portfolioUrl?: string;

  education?: Array<{
    school: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
  }>;

  workExperience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;

  @StringFieldOptional({ isArray: true, each: true })
  @Expose()
  skills?: string[];

  @StringFieldOptional({ isArray: true, each: true })
  @Expose()
  languages?: string[];

  @StringFieldOptional({ isArray: true, each: true })
  @Expose()
  certifications?: string[];

  @StringFieldOptional()
  @Expose()
  summary?: string;

  @StringFieldOptional()
  @Expose()
  resume?: FileEntity;

  @EnumFieldOptional(() => CANDIDATE_SOURCE)
  @Expose()
  source?: CANDIDATE_SOURCE;

  @StringFieldOptional()
  @Expose()
  notes?: string;
}
