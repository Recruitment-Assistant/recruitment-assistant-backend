import { Injectable } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FilterApplicationDto } from '../dto/filter-application.dto';
import { ApplicationRepository } from '../repositories/application.repository';

export class FilterApplicationQuery implements IQuery {
  constructor(public readonly filterOptions: FilterApplicationDto) {}
}

@Injectable()
@QueryHandler(FilterApplicationQuery)
export class FilterApplicationHandler
  implements IQueryHandler<FilterApplicationQuery>
{
  constructor(private readonly repository: ApplicationRepository) {}

  async execute(query: FilterApplicationQuery) {
    return query.filterOptions;
  }
}
