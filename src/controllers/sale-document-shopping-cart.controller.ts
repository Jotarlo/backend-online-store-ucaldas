import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  SaleDocument,
  ShoppingCart,
} from '../models';
import {SaleDocumentRepository} from '../repositories';

export class SaleDocumentShoppingCartController {
  constructor(
    @repository(SaleDocumentRepository)
    public saleDocumentRepository: SaleDocumentRepository,
  ) { }

  @get('/sale-documents/{id}/shopping-cart', {
    responses: {
      '200': {
        description: 'ShoppingCart belonging to SaleDocument',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ShoppingCart)},
          },
        },
      },
    },
  })
  async getShoppingCart(
    @param.path.string('id') id: typeof SaleDocument.prototype.id,
  ): Promise<ShoppingCart> {
    return this.saleDocumentRepository.shoppingCart(id);
  }
}
