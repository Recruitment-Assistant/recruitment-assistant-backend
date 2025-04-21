import { ROLE } from '@common/constants/entity.enum';
import { OffsetPaginationDto } from '@common/dto/offset-pagination/offset-pagination.dto';
import { PageOptionsDto } from '@common/dto/offset-pagination/page-options.dto';
import { OffsetPaginatedDto } from '@common/dto/offset-pagination/paginated.dto';
import { Uuid } from '@common/types/common.type';
import { AdminQueryUserReqDto } from '@modules/user/dto/request/admin-query-user.req.dto';
import { UserResDto } from '@modules/user/dto/response/user.res.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Brackets, DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async getListUser(filterOptions: AdminQueryUserReqDto) {
    const queryBuilder = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('userSub.id')
          .from('user', 'userSub')
          .innerJoin('userSub.roles', 'roleSub')
          .where('roleSub.name = :adminRole')
          .getQuery();

        return `user.id NOT IN ${subQuery}`;
      })
      .setParameter('adminRole', ROLE.ADMIN)
      .withDeleted()
      .select([
        'user.id',
        'user.email',
        'user.phone_number',
        'user.date_of_birth',
        'user.name',
        'user.avatar',
        'user.gender',
        'user.createdAt',
        'user.updatedAt',
        'user.deletedAt',
      ]);

    if (filterOptions.role && filterOptions.role.length > 0) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          for (const [index, role] of filterOptions.role.entries()) {
            qb.orWhere(`role.name ILIKE :role${index}`, {
              [`role${index}`]: `%${role}%`,
            });
          }
        }),
      );
    }

    if (filterOptions.keywords) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          for (const field of ['user.email', 'user.name']) {
            qb.orWhere(`${field} ILIKE :keywords`, {
              keywords: `%${filterOptions.keywords}%`,
            });
          }
        }),
      );
    }
    if (filterOptions.onlyDeleted) {
      queryBuilder.andWhere('user.deletedAt IS NOT NULL');
    }
    queryBuilder
      .orderBy('user.createdAt', filterOptions.order)
      .take(filterOptions.limit)
      .skip(
        filterOptions.page ? (filterOptions.page - 1) * filterOptions.limit : 0,
      );

    const [users, totalRecords] = await queryBuilder.getManyAndCount();

    const meta = new OffsetPaginationDto(totalRecords, filterOptions);
    return new OffsetPaginatedDto(users, meta);
  }

  async getRoleAndUserAssigned(roleId: Uuid, filterOptions: PageOptionsDto) {
    const searchCriteria = ['user.email', 'user.name'];
    const queryBuilder = this.createQueryBuilder('user')
      .leftJoin('user.roles', 'role')
      .where('role.id = :roleId', { roleId })
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.avatar',
        'user.phone_number',
        'user.date_of_birth',
        'user.gender',
        'user.createdAt',
        'user.updatedAt',
        'user.deletedAt',
      ]);

    if (filterOptions.keywords) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          for (const field of searchCriteria) {
            qb.orWhere(`${field} ILIKE :keywords`, {
              keywords: `%${filterOptions.keywords}%`,
            });
          }
        }),
      );
    }

    queryBuilder
      .take(filterOptions.limit)
      .skip(
        filterOptions.page ? (filterOptions.page - 1) * filterOptions.limit : 0,
      )
      .orderBy('user.createdAt', filterOptions.order);

    const [users, totalRecords] = await queryBuilder.getManyAndCount();

    const meta = new OffsetPaginationDto(totalRecords, filterOptions);
    return new OffsetPaginatedDto(
      plainToInstance(UserResDto, users, { excludeExtraneousValues: true }),
      meta,
    );
  }

  async getPermissionsOfUser(userId: Uuid) {
    const user: UserEntity = await this.createQueryBuilder('user')
      .leftJoin('user.roles', 'role')
      .leftJoin('role.permissions', 'permission')
      .where('user.id = :userId', { userId })
      .groupBy('user.id')
      .select([
        'user.id as id',
        'user.email as email',
        'user.phone_number as phone_number',
        'user.name as name',
        'user.avatar as avatar',
        'user.date_of_birth as date_of_birth',
        'user.gender as gender',
        'user.created_at as created_at',
        'user.updated_at as updated_at',
        'user.deleted_at as deleted_at',
        `json_agg(DISTINCT jsonb_build_object(
          'id', permission.id,
          'name', permission.name,
          'resource', permission.resource,
          'action', permission.action
        )) as permissions`,
        `json_agg(DISTINCT jsonb_build_object(
          'id', role.id,
          'name', role.name,
          'description', role.description
        )) as roles`,
      ])
      .getRawOne();

    return user;
  }
}
