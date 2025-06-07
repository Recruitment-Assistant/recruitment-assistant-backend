import { StageEntity } from '@modules/stage/entities/stage.entity';

export const DEFAULT_PIPELINE_NAME = 'Standard Hiring Process';

export const DEFAULT_STAGES_CONFIG: Partial<StageEntity>[] = [
  {
    name: 'Sourced / Applied',
    stage_order: 1,
    is_terminal: false,
  },
  {
    name: 'Screening',
    stage_order: 2,
    sla_days: 3,
    is_terminal: false,
  },
  {
    name: 'Technical Interview',
    stage_order: 3,
    sla_days: 7,
    is_terminal: false,
  },
  {
    name: 'HR Interview',
    stage_order: 4,
    sla_days: 5,
    is_terminal: false,
  },
  {
    name: 'Offer',
    stage_order: 5,
    sla_days: 2,
    is_terminal: false,
  },
  { name: 'Hired', stage_order: 6, is_terminal: true },
  {
    name: 'Rejected',
    stage_order: 100,
    is_terminal: true,
  },
];
