import {
  AuthenticationBindings,
  AuthenticationMetadata
} from '@loopback/authentication';
import {inject, Provider, ValueOrPromise} from '@loopback/context';
import {repository} from '@loopback/repository';
import {Strategy} from 'passport';
import {BasicStrategy} from 'passport-http';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import {ShoppingCartRepository, UserRepository} from '../repositories';
import {AuthService} from '../services/auth.service';

export class MyAuthStrategyProvider implements Provider<Strategy | undefined> {
  authService: AuthService;
  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(ShoppingCartRepository)
    public shoppingCartRepository: ShoppingCartRepository

  ) {
    this.authService = new AuthService(userRepository, shoppingCartRepository)
  }

  value(): ValueOrPromise<Strategy | undefined> {
    // The function was not decorated, so we shouldn't attempt authentication
    if (!this.metadata) {
      return undefined;
    }

    const name = this.metadata.strategy;
    switch (name) {
      case 'LoginStrategy':
        return new BasicStrategy(this.VerifyUser.bind(this));
        break;
      case 'TokenAdminStrategy':
        return new BearerStrategy(this.VerifyAdminToken.bind(this));
      case 'TokenCustomerStrategy':
        return new BearerStrategy(this.VerifyCustomerToken.bind(this));
      default:
        return Promise.reject(`The strategy ${name} is not available.`);
        break;
    }
  }

  async VerifyUser(
    username: string,
    password: string,
    cb: (err: Error | null, user?: object | false) => void,
  ) {
    let user = this.authService.Identify(username, username);
    return cb(null, user);
  }


  VerifyAdminToken(
    token: string,
    cb: (err: Error | null, user?: object | false) => void,
  ) {
    //console.log(token);
    this.authService.VerifyToken(token).then(info => {
      //console.log(info);
      if (info && info.data.role == 2) {
        //console.log("I'm administrator");
        return cb(null, info);
      }
      //console.log("not");
      return cb(null, false);
    });
  }



  VerifyCustomerToken(
    token: string,
    cb: (err: Error | null, user?: object | false) => void,
  ) {
    this.authService.VerifyToken(token).then(info => {
      if (info && info.data.role == 1) {
        return cb(null, info);
      }
      return cb(null, false);
    });
  }
}
