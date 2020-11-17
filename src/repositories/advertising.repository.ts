import {DefaultCrudRepository} from '@loopback/repository';
import {Advertising, AdvertisingRelations} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class AdvertisingRepository extends DefaultCrudRepository<
  Advertising,
  typeof Advertising.prototype.id,
  AdvertisingRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Advertising, dataSource);
  }
}
