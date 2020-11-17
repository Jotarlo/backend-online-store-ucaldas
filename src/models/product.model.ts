import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Category} from './category.model';
import {Brand} from './brand.model';
import {Image} from './image.model';
import {SaleItem} from './sale-item.model';

@model()
export class Product extends Entity {
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
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'string',
    default: 'Product description.',
  })
  description?: string;

  @property({
    type: 'number',
    default: 0,
  })
  stock?: number;

  @property({
    type: 'number',
    default: 0,
  })
  rate?: number;

  @belongsTo(() => Category)
  categoryId: string;

  @belongsTo(() => Brand)
  brandId: string;

  @hasMany(() => Image)
  images: Image[];

  @hasMany(() => SaleItem)
  saleItems: SaleItem[];

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
