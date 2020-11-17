import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {SaleDocument, SaleDocumentRelations, ShoppingCart} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ShoppingCartRepository} from './shopping-cart.repository';

export class SaleDocumentRepository extends DefaultCrudRepository<
  SaleDocument,
  typeof SaleDocument.prototype.id,
  SaleDocumentRelations
> {

  public readonly shoppingCart: BelongsToAccessor<ShoppingCart, typeof SaleDocument.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('ShoppingCartRepository') protected shoppingCartRepositoryGetter: Getter<ShoppingCartRepository>,
  ) {
    super(SaleDocument, dataSource);
    this.shoppingCart = this.createBelongsToAccessorFor('shoppingCart', shoppingCartRepositoryGetter,);
    this.registerInclusionResolver('shoppingCart', this.shoppingCart.inclusionResolver);
  }
}
