import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {SaleItem, SaleItemRelations, Product, ShoppingCart} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProductRepository} from './product.repository';
import {ShoppingCartRepository} from './shopping-cart.repository';

export class SaleItemRepository extends DefaultCrudRepository<
  SaleItem,
  typeof SaleItem.prototype.id,
  SaleItemRelations
> {

  public readonly product: BelongsToAccessor<Product, typeof SaleItem.prototype.id>;

  public readonly shoppingCart: BelongsToAccessor<ShoppingCart, typeof SaleItem.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>, @repository.getter('ShoppingCartRepository') protected shoppingCartRepositoryGetter: Getter<ShoppingCartRepository>,
  ) {
    super(SaleItem, dataSource);
    this.shoppingCart = this.createBelongsToAccessorFor('shoppingCart', shoppingCartRepositoryGetter,);
    this.registerInclusionResolver('shoppingCart', this.shoppingCart.inclusionResolver);
    this.product = this.createBelongsToAccessorFor('product', productRepositoryGetter,);
    this.registerInclusionResolver('product', this.product.inclusionResolver);
  }
}
