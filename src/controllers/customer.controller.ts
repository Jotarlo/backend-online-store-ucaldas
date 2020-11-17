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
import {NotificationKeys} from '../keys/notification-keys';
import {ServiceKeys as keys} from '../keys/service-keys';
import {Customer, EmailNotification, ShoppingCart, User} from '../models';
import {CustomerRepository, ShoppingCartRepository, UserRepository} from '../repositories';
import {AuthService} from '../services/auth.service';
import {EncryptDecrypt} from '../services/encrypt-decrypt.service';
import {NotificationService} from '../services/notification.service';

export class CustomerController {
  authService: AuthService;

  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(ShoppingCartRepository)
    public shoppingCartRepository: ShoppingCartRepository
  ) {
    this.authService = new AuthService(this.userRepository, shoppingCartRepository);
  }

  @post('/customer', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: {'application/json': {schema: getModelSchemaRef(Customer)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {
            title: 'NewCustomer',
            exclude: ['id'],
          }),
        },
      },
    })
    customer: Omit<Customer, 'id'>,
  ): Promise<Customer> {
    let userExits = await this.customerRepository.findOne({where: {document: customer.document}});
    if (userExits) {
      throw new HttpErrors[403];
    }
    let c: Customer = await this.customerRepository.create(customer);
    let password1 = await this.authService.GenerateRandomPassword();
    console.log(password1);
    let encrypter = new EncryptDecrypt(keys.LOGIN_CRYPT_METHOD);
    let password2 = encrypter.Encrypt(encrypter.Encrypt(password1));
    let user: User = new User({
      username: customer.document,
      password: password2,
      role: 1,
      customerId: c.id
    });
    user = await this.userRepository.create(user);

    let shoppingCart = new ShoppingCart({
      code: `${this.authService.GenerateRandomPassword()}-${Date.now()}`,
      createdDate: new Date(),
      customerId: c.id
    });
    await this.shoppingCartRepository.create(shoppingCart);

    let emailData: EmailNotification = new EmailNotification({
      subject: NotificationKeys.subjectRegister,
      textBody: `${NotificationKeys.registerPasswordBody} ${password1}`,
      htmlBody: `${NotificationKeys.registerPasswordBody} ${password1}`,
      to: customer?.email
    });
    //console.log(password1);
    let sent = await new NotificationService().EmailNotification(emailData);
    //console.log(sent);
    user.password = "";
    c.user = user;
    return c;
  }

  @get('/customer/count', {
    responses: {
      '200': {
        description: 'Customer model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Customer) where?: Where<Customer>,
  ): Promise<Count> {
    return this.customerRepository.count(where);
  }

  @get('/customer', {
    responses: {
      '200': {
        description: 'Array of Customer model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Customer, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Customer) filter?: Filter<Customer>,
  ): Promise<Customer[]> {
    return this.customerRepository.find(filter);
  }

  @patch('/customer', {
    responses: {
      '200': {
        description: 'Customer PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {partial: true}),
        },
      },
    })
    customer: Customer,
    @param.where(Customer) where?: Where<Customer>,
  ): Promise<Count> {
    return this.customerRepository.updateAll(customer, where);
  }

  @get('/customer/{id}', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Customer, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Customer, {exclude: 'where'}) filter?: FilterExcludingWhere<Customer>
  ): Promise<Customer> {
    return this.customerRepository.findById(id, filter);
  }

  @patch('/customer/{id}', {
    responses: {
      '204': {
        description: 'Customer PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {partial: true}),
        },
      },
    })
    customer: Customer,
  ): Promise<void> {
    let u = await this.userRepository.findOne({where: {customerId: customer.id}});
    if (u != null) {
      u.username = customer.document
      await this.userRepository.replaceById(u.id, u);
    }
    await this.customerRepository.updateById(id, customer);
  }

  @put('/customer/{id}', {
    responses: {
      '204': {
        description: 'Customer PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() customer: Customer,
  ): Promise<void> {

    let u = await this.userRepository.findOne({where: {customerId: customer.id}});
    if (u != null) {
      u.username = customer.document
      await this.userRepository.replaceById(u.id, u);
    }
    await this.customerRepository.replaceById(id, customer);
  }

  @del('/customer/{id}', {
    responses: {
      '204': {
        description: 'Customer DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.customerRepository.deleteById(id);
  }
}
