import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongo',
  connector: 'mongodb',
  url: 'mongodb+srv://online_store_user_db:S9DlsN90WAYDeUn2@cluster0-lqcr6.mongodb.net/ProductSalesDB?retryWrites=true&w=majority',
  host: 'cluster0-lqcr6.mongodb.net',
  port: 27017,
  user: 'online_store_user_db',
  password: 'S9DlsN90WAYDeUn2',
  database: 'ProductSalesDB',
  useNewUrlParser: true
};


/*
const config = {
  name: 'mongo',
  connector: 'mongodb',
  url: 'mongodb://localhost/ProductSalesDB',
  host: 'localhost',
  port: 27017,
  user: '',
  password: '',
  database: 'ProductSalesDB',
  useNewUrlParser: true
};
*/
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongoDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongo';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongo', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
