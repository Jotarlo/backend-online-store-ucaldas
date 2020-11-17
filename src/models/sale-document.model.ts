import {Entity, model, property, belongsTo} from '@loopback/repository';
import {ShoppingCart} from './shopping-cart.model';

@model()
export class SaleDocument extends Entity {
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
  createdDate: string;

  @property({
    type: 'number',
  })
  code?: number;

  @property({
    type: 'array',
    itemType: 'string',
  })
  productsInformation?: string[];

  @property({
    type: 'number',
    default: 0,
  })
  total?: number;

  @belongsTo(() => ShoppingCart)
  shoppingCartId: string;

  constructor(data?: Partial<SaleDocument>) {
    super(data);
  }
}

export interface SaleDocumentRelations {
  // describe navigational properties here
}

export type SaleDocumentWithRelations = SaleDocument & SaleDocumentRelations;
