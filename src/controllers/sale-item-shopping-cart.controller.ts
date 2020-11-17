import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  SaleItem,
  ShoppingCart,
} from '../models';
import {SaleItemRepository} from '../repositories';

export class SaleItemShoppingCartController {
  constructor(
    @repository(SaleItemRepository)
    public saleItemRepository: SaleItemRepository,
  ) { }

  @get('/sale-items/{id}/shopping-cart', {
    responses: {
      '200': {
        description: 'ShoppingCart belonging to SaleItem',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ShoppingCart)},
          },
        },
      },
    },
  })
  async getShoppingCart(
    @param.path.string('id') id: typeof SaleItem.prototype.id,
  ): Promise<ShoppingCart> {
    return this.saleItemRepository.shoppingCart(id);
  }
}
