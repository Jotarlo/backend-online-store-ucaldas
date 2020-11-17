import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Brand,
  Product,
} from '../models';
import {BrandRepository} from '../repositories';

export class BrandProductController {
  constructor(
    @repository(BrandRepository) protected brandRepository: BrandRepository,
  ) { }

  @get('/brands/{id}/products', {
    responses: {
      '200': {
        description: 'Array of Brand has many Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.brandRepository.products(id).find(filter);
  }

  @post('/brands/{id}/products', {
    responses: {
      '200': {
        description: 'Brand model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Brand.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProductInBrand',
            exclude: ['id'],
            optional: ['brandId']
          }),
        },
      },
    }) product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.brandRepository.products(id).create(product);
  }

  @patch('/brands/{id}/products', {
    responses: {
      '200': {
        description: 'Brand.Product PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Partial<Product>,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    return this.brandRepository.products(id).patch(product, where);
  }

  @del('/brands/{id}/products', {
    responses: {
      '200': {
        description: 'Brand.Product DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    return this.brandRepository.products(id).delete(where);
  }
}
