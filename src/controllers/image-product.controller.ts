import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {
  Image,
  Product
} from '../models';
import {ImageRepository} from '../repositories';

export class ImageProductController {
  constructor(
    @repository(ImageRepository)
    public imageRepository: ImageRepository,
  ) {}

  @get('/images/{id}/product', {
    responses: {
      '200': {
        description: 'Product belonging to Image',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async getProduct(
    @param.path.string('id') id: typeof Image.prototype.id,
  ): Promise<Product> {
    return this.imageRepository.product(id);
  }

  @authenticate('TokenAdminStrategy')
  @del('/product-image/{id}', {
    responses: {
      '204': {
        description: 'Product Image DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') imageId: string): Promise<void> {
    await this.imageRepository.deleteById(imageId);
  }
}
