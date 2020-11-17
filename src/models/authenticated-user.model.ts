import {Model, model, property} from '@loopback/repository';

@model()
export class AuthenticatedUser extends Model {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  customerId: string;

  @property({
    type: 'number',
    required: true,
  })
  role: number;

  @property({
    type: 'string',
    required: true,
  })
  cartId: string;


  constructor(data?: Partial<AuthenticatedUser>) {
    super(data);
  }
}

export interface AuthenticatedUserRelations {
  // describe navigational properties here
}

export type AuthenticatedUserWithRelations = AuthenticatedUser & AuthenticatedUserRelations;
