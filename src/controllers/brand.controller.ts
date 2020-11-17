import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef,



  HttpErrors, param,
  patch, post,
  put,
  requestBody
} from '@loopback/rest';
import {Brand} from '../models';
import {BrandRepository} from '../repositories';
export class BrandController {
  constructor(
    @repository(BrandRepository)
    public brandRepository: BrandRepository
  ) {}

  @authenticate('TokenAdminStrategy')
  @post('/brand', {
    responses: {
      '200': {
        description: 'Brand model instance',
        content: {'application/json': {schema: getModelSchemaRef(Brand)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brand, {
            title: 'NewBrand',
            exclude: ['id'],
          }),
        },
      },
    })
    brand: Omit<Brand, 'id'>,
  ): Promise<Brand> {
    console.log(brand.name);
    let currentBrand = await this.brandRepository.findOne({where: {name: brand.name}});
    console.log(currentBrand);

    if (currentBrand) {
      throw new HttpErrors[401]("A brand with this name already exists!");
    } else {
      return this.brandRepository.create(brand);
    }
  }

  @get('/brand/count', {
    responses: {
      '200': {
        description: 'Brand model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Brand) where?: Where<Brand>,
  ): Promise<Count> {
    return this.brandRepository.count(where);
  }

  @get('/brand', {
    responses: {
      '200': {
        description: 'Array of Brand model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Brand, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Brand) filter?: Filter<Brand>,
  ): Promise<Brand[]> {
    return this.brandRepository.find(filter);
  }

  @authenticate('TokenAdminStrategy')
  @patch('/brand', {
    responses: {
      '200': {
        description: 'Brand PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brand, {partial: true}),
        },
      },
    })
    brand: Brand,
    @param.where(Brand) where?: Where<Brand>,
  ): Promise<Count> {
    return this.brandRepository.updateAll(brand, where);
  }

  @get('/brand/{id}', {
    responses: {
      '200': {
        description: 'Brand model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Brand, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Brand, {exclude: 'where'}) filter?: FilterExcludingWhere<Brand>
  ): Promise<Brand> {
    return this.brandRepository.findById(id, filter);
  }

  @authenticate('TokenAdminStrategy')
  @patch('/brand/{id}', {
    responses: {
      '204': {
        description: 'Brand PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Brand, {partial: true}),
        },
      },
    })
    brand: Brand,
  ): Promise<void> {
    await this.brandRepository.updateById(id, brand);
  }

  @authenticate('TokenAdminStrategy')
  @put('/brand/{id}', {
    responses: {
      '204': {
        description: 'Brand PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() brand: Brand,
  ): Promise<void> {
    await this.brandRepository.replaceById(id, brand);
  }

  @authenticate('TokenAdminStrategy')
  @del('/brand/{id}', {
    responses: {
      '204': {
        description: 'Brand DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.brandRepository.deleteById(id);
  }
}
