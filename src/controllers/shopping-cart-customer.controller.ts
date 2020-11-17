import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ShoppingCart,
  Customer,
} from '../models';
import {ShoppingCartRepository} from '../repositories';

export class ShoppingCartCustomerController {
  constructor(
    @repository(ShoppingCartRepository)
    public shoppingCartRepository: ShoppingCartRepository,
  ) { }

  @get('/shopping-carts/{id}/customer', {
    responses: {
      '200': {
        description: 'Customer belonging to ShoppingCart',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Customer)},
          },
        },
      },
    },
  })
  async getCustomer(
    @param.path.string('id') id: typeof ShoppingCart.prototype.id,
  ): Promise<Customer> {
    return this.shoppingCartRepository.customer(id);
  }
}
