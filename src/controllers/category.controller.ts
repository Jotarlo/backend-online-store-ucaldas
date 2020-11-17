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
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody
} from '@loopback/rest';
import {Category} from '../models';
import {CategoryRepository} from '../repositories';

export class CategoryController {
  constructor(
    @repository(CategoryRepository)
    public categoryRepository: CategoryRepository,
  ) {}

  @authenticate('TokenAdminStrategy')
  @post('/category', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Category)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {
            title: 'NewCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    category: Omit<Category, 'id'>,
  ): Promise<Category> {
    return this.categoryRepository.create(category);
  }

  @get('/category/count', {
    responses: {
      '200': {
        description: 'Category model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {
    return this.categoryRepository.count(where);
  }

  @get('/category', {
    responses: {
      '200': {
        description: 'Array of Category model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Category, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Category) filter?: Filter<Category>,
  ): Promise<Category[]> {
    return this.categoryRepository.find(filter);
  }

  @authenticate('TokenAdminStrategy')
  @patch('/category', {
    responses: {
      '200': {
        description: 'Category PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Category,
    @param.where(Category) where?: Where<Category>,
  ): Promise<Count> {
    return this.categoryRepository.updateAll(category, where);
  }

  @get('/category/{id}', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Category, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Category, {exclude: 'where'}) filter?: FilterExcludingWhere<Category>
  ): Promise<Category> {
    return this.categoryRepository.findById(id, filter);
  }

  @authenticate('TokenAdminStrategy')
  @patch('/category/{id}', {
    responses: {
      '204': {
        description: 'Category PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Category, {partial: true}),
        },
      },
    })
    category: Category,
  ): Promise<void> {
    await this.categoryRepository.updateById(id, category);
  }

  @authenticate('TokenAdminStrategy')
  @put('/category/{id}', {
    responses: {
      '204': {
        description: 'Category PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() category: Category,
  ): Promise<void> {
    await this.categoryRepository.replaceById(id, category);
  }

  @authenticate('TokenAdminStrategy')
  @del('/category/{id}', {
    responses: {
      '204': {
        description: 'Category DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.categoryRepository.deleteById(id);
  }
}
