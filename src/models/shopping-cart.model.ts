import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Customer} from './customer.model';
import {SaleDocument} from './sale-document.model';
import {SaleItem} from './sale-item.model';

@model()
export class ShoppingCart extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  createdDate: Date;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @hasMany(() => SaleItem)
  saleItems: SaleItem[];

  @belongsTo(() => Customer)
  customerId: string;

  @hasMany(() => SaleDocument)
  saleDocuments: SaleDocument[];

  constructor(data?: Partial<ShoppingCart>) {
    super(data);
  }
}

export interface ShoppingCartRelations {
  // describe navigational properties here
}

export type ShoppingCartWithRelations = ShoppingCart & ShoppingCartRelations;
