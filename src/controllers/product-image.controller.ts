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
  Image,
} from '../models';
import {ProductRepository} from '../repositories';

export class ProductImageController {
  constructor(
    @repository(ProductRepository) protected productRepository: ProductRepository,
  ) { }

  @get('/products/{id}/images', {
    responses: {
      '200': {
        description: 'Array of Product has many Image',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Image)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Image>,
  ): Promise<Image[]> {
    return this.productRepository.images(id).find(filter);
  }

  @post('/products/{id}/images', {
    responses: {
      '200': {
        description: 'Product model instance',
        content: {'application/json': {schema: getModelSchemaRef(Image)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Product.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Image, {
            title: 'NewImageInProduct',
            exclude: ['id'],
            optional: ['productId']
          }),
        },
      },
    }) image: Omit<Image, 'id'>,
  ): Promise<Image> {
    return this.productRepository.images(id).create(image);
  }

  @patch('/products/{id}/images', {
    responses: {
      '200': {
        description: 'Product.Image PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Image, {partial: true}),
        },
      },
    })
    image: Partial<Image>,
    @param.query.object('where', getWhereSchemaFor(Image)) where?: Where<Image>,
  ): Promise<Count> {
    return this.productRepository.images(id).patch(image, where);
  }

  @del('/products/{id}/images', {
    responses: {
      '200': {
        description: 'Product.Image DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Image)) where?: Where<Image>,
  ): Promise<Count> {
    return this.productRepository.images(id).delete(where);
  }
}
