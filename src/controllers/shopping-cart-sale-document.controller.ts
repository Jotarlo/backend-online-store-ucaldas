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
  SaleDocument,
} from '../models';
import {ShoppingCartRepository} from '../repositories';

export class ShoppingCartSaleDocumentController {
  constructor(
    @repository(ShoppingCartRepository) protected shoppingCartRepository: ShoppingCartRepository,
  ) { }

  @get('/shopping-carts/{id}/sale-documents', {
    responses: {
      '200': {
        description: 'Array of ShoppingCart has many SaleDocument',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(SaleDocument)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<SaleDocument>,
  ): Promise<SaleDocument[]> {
    return this.shoppingCartRepository.saleDocuments(id).find(filter);
  }

  @post('/shopping-carts/{id}/sale-documents', {
    responses: {
      '200': {
        description: 'ShoppingCart model instance',
        content: {'application/json': {schema: getModelSchemaRef(SaleDocument)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ShoppingCart.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SaleDocument, {
            title: 'NewSaleDocumentInShoppingCart',
            exclude: ['id'],
            optional: ['shoppingCartId']
          }),
        },
      },
    }) saleDocument: Omit<SaleDocument, 'id'>,
  ): Promise<SaleDocument> {
    return this.shoppingCartRepository.saleDocuments(id).create(saleDocument);
  }

  @patch('/shopping-carts/{id}/sale-documents', {
    responses: {
      '200': {
        description: 'ShoppingCart.SaleDocument PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SaleDocument, {partial: true}),
        },
      },
    })
    saleDocument: Partial<SaleDocument>,
    @param.query.object('where', getWhereSchemaFor(SaleDocument)) where?: Where<SaleDocument>,
  ): Promise<Count> {
    return this.shoppingCartRepository.saleDocuments(id).patch(saleDocument, where);
  }

  @del('/shopping-carts/{id}/sale-documents', {
    responses: {
      '200': {
        description: 'ShoppingCart.SaleDocument DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(SaleDocument)) where?: Where<SaleDocument>,
  ): Promise<Count> {
    return this.shoppingCartRepository.saleDocuments(id).delete(where);
  }
}
