import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Brand, BrandRelations, Product} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProductRepository} from './product.repository';

export class BrandRepository extends DefaultCrudRepository<
  Brand,
  typeof Brand.prototype.id,
  BrandRelations
> {

  public readonly products: HasManyRepositoryFactory<Product, typeof Brand.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Brand, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor('products', productRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
