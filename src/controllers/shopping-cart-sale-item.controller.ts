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
  ShoppingCart,
  SaleItem,
} from '../models';
import {ShoppingCartRepository} from '../repositories';

export class ShoppingCartSaleItemController {
  constructor(
    @repository(ShoppingCartRepository) protected shoppingCartRepository: ShoppingCartRepository,
  ) { }

  @get('/shopping-carts/{id}/sale-items', {
    responses: {
      '200': {
        description: 'Array of ShoppingCart has many SaleItem',
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
    return this.shoppingCartRepository.saleItems(id).find(filter);
  }

  @post('/shopping-carts/{id}/sale-items', {
    responses: {
      '200': {
        description: 'ShoppingCart model instance',
        content: {'application/json': {schema: getModelSchemaRef(SaleItem)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ShoppingCart.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SaleItem, {
            title: 'NewSaleItemInShoppingCart',
            exclude: ['id'],
            optional: ['shoppingCartId']
          }),
        },
      },
    }) saleItem: Omit<SaleItem, 'id'>,
  ): Promise<SaleItem> {
    return this.shoppingCartRepository.saleItems(id).create(saleItem);
  }

  @patch('/shopping-carts/{id}/sale-items', {
    responses: {
      '200': {
        description: 'ShoppingCart.SaleItem PATCH success count',
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
    return this.shoppingCartRepository.saleItems(id).patch(saleItem, where);
  }

  @del('/shopping-carts/{id}/sale-items', {
    responses: {
      '200': {
        description: 'ShoppingCart.SaleItem DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(SaleItem)) where?: Where<SaleItem>,
  ): Promise<Count> {
    return this.shoppingCartRepository.saleItems(id).delete(where);
  }
}
