import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Product} from './product.model';

@model()
export class Image extends Entity {
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
  path: string;

  @property({
    type: 'number',
    required: true,
  })
  order: number;

  @belongsTo(() => Product)
  productId: string;

  constructor(data?: Partial<Image>) {
    super(data);
  }
}

export interface ImageRelations {
  // describe navigational properties here
}

export type ImageWithRelations = Image & ImageRelations;
