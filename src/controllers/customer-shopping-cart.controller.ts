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
  Customer,
  ShoppingCart,
} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerShoppingCartController {
  constructor(
    @repository(CustomerRepository) protected customerRepository: CustomerRepository,
  ) { }

  @get('/customers/{id}/shopping-cart', {
    responses: {
      '200': {
        description: 'Customer has one ShoppingCart',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ShoppingCart),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<ShoppingCart>,
  ): Promise<ShoppingCart> {
    return this.customerRepository.shoppingCart(id).get(filter);
  }

  @post('/customers/{id}/shopping-cart', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: {'application/json': {schema: getModelSchemaRef(ShoppingCart)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ShoppingCart, {
            title: 'NewShoppingCartInCustomer',
            exclude: ['id'],
            optional: ['customerId']
          }),
        },
      },
    }) shoppingCart: Omit<ShoppingCart, 'id'>,
  ): Promise<ShoppingCart> {
    return this.customerRepository.shoppingCart(id).create(shoppingCart);
  }

  @patch('/customers/{id}/shopping-cart', {
    responses: {
      '200': {
        description: 'Customer.ShoppingCart PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ShoppingCart, {partial: true}),
        },
      },
    })
    shoppingCart: Partial<ShoppingCart>,
    @param.query.object('where', getWhereSchemaFor(ShoppingCart)) where?: Where<ShoppingCart>,
  ): Promise<Count> {
    return this.customerRepository.shoppingCart(id).patch(shoppingCart, where);
  }

  @del('/customers/{id}/shopping-cart', {
    responses: {
      '200': {
        description: 'Customer.ShoppingCart DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(ShoppingCart)) where?: Where<ShoppingCart>,
  ): Promise<Count> {
    return this.customerRepository.shoppingCart(id).delete(where);
  }
}
