import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Image, ImageRelations, Product} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProductRepository} from './product.repository';

export class ImageRepository extends DefaultCrudRepository<
  Image,
  typeof Image.prototype.id,
  ImageRelations
> {

  public readonly product: BelongsToAccessor<Product, typeof Image.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Image, dataSource);
    this.product = this.createBelongsToAccessorFor('product', productRepositoryGetter,);
    this.registerInclusionResolver('product', this.product.inclusionResolver);
  }
}
