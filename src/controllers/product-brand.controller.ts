import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Product,
  Brand,
} from '../models';
import {ProductRepository} from '../repositories';

export class ProductBrandController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) { }

  @get('/products/{id}/brand', {
    responses: {
      '200': {
        description: 'Brand belonging to Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Brand)},
          },
        },
      },
    },
  })
  async getBrand(
    @param.path.string('id') id: typeof Product.prototype.id,
  ): Promise<Brand> {
    return this.productRepository.brand(id);
  }
}
