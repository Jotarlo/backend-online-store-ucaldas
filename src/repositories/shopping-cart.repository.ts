import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {ShoppingCart, ShoppingCartRelations, SaleItem, Customer, SaleDocument} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {SaleItemRepository} from './sale-item.repository';
import {CustomerRepository} from './customer.repository';
import {SaleDocumentRepository} from './sale-document.repository';

export class ShoppingCartRepository extends DefaultCrudRepository<
  ShoppingCart,
  typeof ShoppingCart.prototype.id,
  ShoppingCartRelations
> {

  public readonly saleItems: HasManyRepositoryFactory<SaleItem, typeof ShoppingCart.prototype.id>;

  public readonly customer: BelongsToAccessor<Customer, typeof ShoppingCart.prototype.id>;

  public readonly saleDocuments: HasManyRepositoryFactory<SaleDocument, typeof ShoppingCart.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('SaleItemRepository') protected saleItemRepositoryGetter: Getter<SaleItemRepository>, @repository.getter('CustomerRepository') protected customerRepositoryGetter: Getter<CustomerRepository>, @repository.getter('SaleDocumentRepository') protected saleDocumentRepositoryGetter: Getter<SaleDocumentRepository>,
  ) {
    super(ShoppingCart, dataSource);
    this.saleDocuments = this.createHasManyRepositoryFactoryFor('saleDocuments', saleDocumentRepositoryGetter,);
    this.registerInclusionResolver('saleDocuments', this.saleDocuments.inclusionResolver);
    this.customer = this.createBelongsToAccessorFor('customer', customerRepositoryGetter,);
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);
    this.saleItems = this.createHasManyRepositoryFactoryFor('saleItems', saleItemRepositoryGetter,);
    this.registerInclusionResolver('saleItems', this.saleItems.inclusionResolver);
  }
}
