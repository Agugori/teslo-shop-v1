import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.inserUsers();
    await this.insertNewProduct(adminUser);

    return 'Seed Executed';
  }

  //Metodos
  private async deleteTables() {
    await this.productService.deleteAllProduct();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }
  private async inserUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach((user) => users.push(this.userRepository.create(user)));
    const dbUsers = await this.userRepository.save(seedUsers);

    await this.userRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async insertNewProduct(user: User) {
    await this.productService.deleteAllProduct(); // delete a TODA la info!

    const productSeed = initialData.products;

    const insertPromises = [];

    productSeed.forEach((product) => {
      insertPromises.push(this.productService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
