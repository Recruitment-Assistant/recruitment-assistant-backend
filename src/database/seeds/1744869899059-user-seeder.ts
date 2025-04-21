import { ROLE } from '@common/constants/entity.enum';
import { RoleEntity } from '@modules/role/entities/role.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class UserSeeder1744869899059 implements Seeder {
  track = false;
  private userRepository: Repository<UserEntity>;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    this.userRepository = dataSource.getRepository(UserEntity);

    const adminUser = await this.userRepository.findOneBy({
      email: 'admin@gmail.com',
    });
    if (!adminUser) {
      await this.userRepository.insert([
        new UserEntity({
          email: 'admin@gmail.com',
          password: 'nestboilerplate@2025',
          name: 'admin',
          isActive: true,
          isConfirmed: true,
        }),
        new UserEntity({
          email: 'moderator@gmail.com',
          password: 'nestboilerplate@2025',
          name: 'moderator',
          isActive: true,
          isConfirmed: true,
        }),
      ]);
    }

    const countRecord = await this.userRepository.count();
    if (countRecord === 2) {
      const userFactory = factoryManager.get(UserEntity);
      await userFactory.saveMany(5);
    }

    await this.assignRoleForUser(dataSource);
  }

  private async assignRoleForUser(dataSource: DataSource) {
    const roleRepository = dataSource.getRepository(RoleEntity);
    const [adminRole, moderatorRole, basicRole] = await Promise.all([
      roleRepository.findOneBy({ name: ROLE.ADMIN }),
      roleRepository.findOneBy({ name: ROLE.MODERATOR }),
      roleRepository.findOneBy({ name: ROLE.USER }),
    ]);

    const users = await this.userRepository.find();

    const usersUpdate = users.map((user) => {
      if (user.email === 'admin@gmail.com') {
        user.roles = [adminRole];
      } else if (user.email === 'moderator@gmail.com') {
        user.roles = [moderatorRole];
      } else {
        user.roles = [basicRole];
      }

      return user;
    });

    await this.userRepository.save(usersUpdate).then(() => {
      console.log(
        'Update data for user table: ',
        usersUpdate.length,
        ' record',
      );
    });
  }
}
