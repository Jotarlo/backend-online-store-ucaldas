import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {Product, ProductRelations, Category, Brand, Image, SaleItem} from '../models';
import {MongoDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CategoryRepository} from './category.repository';
import {BrandRepository} from './brand.repository';
import {ImageRepository} from './image.repository';
import {SaleItemRepository} from './sale-item.repository';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {

  public readonly category: BelongsToAccessor<Category, typeof Product.prototype.id>;

  public readonly brand: BelongsToAccessor<Brand, typeof Product.prototype.id>;

  public readonly images: HasManyRepositoryFactory<Image, typeof Product.prototype.id>;

  public readonly saleItems: HasManyRepositoryFactory<SaleItem, typeof Product.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>, @repository.getter('BrandRepository') protected brandRepositoryGetter: Getter<BrandRepository>, @repository.getter('ImageRepository') protected imageRepositoryGetter: Getter<ImageRepository>, @repository.getter('SaleItemRepository') protected saleItemRepositoryGetter: Getter<SaleItemRepository>,
  ) {
    super(Product, dataSource);
    this.saleItems = this.createHasManyRepositoryFactoryFor('saleItems', saleItemRepositoryGetter,);
    this.registerInclusionResolver('saleItems', this.saleItems.inclusionResolver);
    this.images = this.createHasManyRepositoryFactoryFor('images', imageRepositoryGetter,);
    this.registerInclusionResolver('images', this.images.inclusionResolver);
    this.brand = this.createBelongsToAccessorFor('brand', brandRepositoryGetter,);
    this.registerInclusionResolver('brand', this.brand.inclusionResolver);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
