import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {Customer, CustomerRelations, User, ShoppingCart} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';
import {ShoppingCartRepository} from './shopping-cart.repository';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {

  public readonly user: HasOneRepositoryFactory<User, typeof Customer.prototype.id>;

  public readonly shoppingCart: HasOneRepositoryFactory<ShoppingCart, typeof Customer.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ShoppingCartRepository') protected shoppingCartRepositoryGetter: Getter<ShoppingCartRepository>,
  ) {
    super(Customer, dataSource);
    this.shoppingCart = this.createHasOneRepositoryFactoryFor('shoppingCart', shoppingCartRepositoryGetter);
    this.registerInclusionResolver('shoppingCart', this.shoppingCart.inclusionResolver);
    this.user = this.createHasOneRepositoryFactoryFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
