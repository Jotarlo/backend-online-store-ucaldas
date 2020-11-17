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
  Product,
  SaleItem,
} from '../models';
import {ProductRepository} from '../repositories';

export class ProductSaleItemController {
  constructor(
    @repository(ProductRepository) protected productRepository: ProductRepository,
  ) { }

  @get('/products/{id}/sale-items', {
    responses: {
      '200': {
        description: 'Array of Product has many SaleItem',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SaleItem)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<SaleItem>,
  ): Promise<SaleItem[]> {
    return this.productRepository.saleItems(id).find(filter);
  }

  @post('/products/{id}/sale-items', {
    responses: {
      '200': {
        description: 'Product model instance',
        content: {'application/json': {schema: getModelSchemaRef(SaleItem)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Product.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SaleItem, {
            title: 'NewSaleItemInProduct',
            exclude: ['id'],
            optional: ['productId']
          }),
        },
      },
    }) saleItem: Omit<SaleItem, 'id'>,
  ): Promise<SaleItem> {
    return this.productRepository.saleItems(id).create(saleItem);
  }

  @patch('/products/{id}/sale-items', {
    responses: {
      '200': {
        description: 'Product.SaleItem PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SaleItem, {partial: true}),
        },
      },
    })
    saleItem: Partial<SaleItem>,
    @param.query.object('where', getWhereSchemaFor(SaleItem)) where?: Where<SaleItem>,
  ): Promise<Count> {
    return this.productRepository.saleItems(id).patch(saleItem, where);
  }

  @del('/products/{id}/sale-items', {
    responses: {
      '200': {
        description: 'Product.SaleItem DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(SaleItem)) where?: Where<SaleItem>,
  ): Promise<Count> {
    return this.productRepository.saleItems(id).delete(where);
  }
}
