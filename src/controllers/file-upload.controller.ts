import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  HttpErrors, param, post,
  Request,
  requestBody,
  Response,
  RestBindings
} from '@loopback/rest';
import multer from 'multer';
import path from 'path';
import {UploadFilesKeys} from '../keys/upload-files-keys';
import {Customer, Image, Product} from '../models';
import {AdvertisingRepository, CustomerRepository, ImageRepository} from '../repositories';


/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export class FileUploadController {

  /**
   *
   * @param customerRepository
   * @param imageRepository
   * @param advertisingRepository
   */
  constructor(
    @repository(CustomerRepository)
    private customerRepository: CustomerRepository,
    @repository(ImageRepository)
    private imageRepository: ImageRepository,
    @repository(AdvertisingRepository)
    private advertisingRepository: AdvertisingRepository,
  ) {}

  /**
   * Add or replace the profile photo of a customer by customerId
   * @param request
   * @param customerId
   * @param response
   */
  @post('/customerProfilePhoto', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Customer Photo',
      },
    },
  })
  async customerPhotoUpload(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.string('customerId') customerId: string,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const customerPhotoPath = path.join(__dirname, UploadFilesKeys.CUSTOMER_PROFILE_PHOTO_PATH);
    let res = await this.StoreFileToPath(customerPhotoPath, UploadFilesKeys.CUSTOMER_PROFILE_PHOTO_FIELDNAME, request, response, UploadFilesKeys.IMAGE_ACCEPTED_EXT);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        let c: Customer = await this.customerRepository.findById(customerId);
        if (c) {
          c.profilePhoto = filename;
          this.customerRepository.replaceById(customerId, c);
          return {filename: filename};
        }
      }
    }
    return res;
  }

  /**
   *
   * @param response
   * @param advertisingId
   * @param request
   */
  @post('/advertisingImage', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Advertising Image',
      },
    },
  })
  async advertisingImageUpload(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const advertisingImagePath = path.join(__dirname, UploadFilesKeys.ADVERTISING_IMAGE_PATH);
    let res = await this.StoreFileToPath(advertisingImagePath, UploadFilesKeys.ADVERTISING_IMAGE_FIELDNAME, request, response, UploadFilesKeys.IMAGE_ACCEPTED_EXT);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        return {filename: filename};
      }
    }
    return res;
  }

  /**
   * Add a new image or replace another one that exists of a product
   * @param request
   * @param response
   * @param productId
   * @param imageId if this parameter is empty then the images will be added, on the contrary it will be replaced
   */
  @post('/productImage', {
    responses: {
      200: {
        content: {
          'application/json': {
          },
        },
        description: 'Product Image',
      },
    },
  })
  async productImageUpload(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.string('productId') productId: typeof Product.prototype.id,
    @param.query.number('order') order: number,
    @param.query.string('imageId') imageId: typeof Image.prototype.id,
    @requestBody.file() request: Request,
  ): Promise<object | false> {
    const productPath = path.join(__dirname, UploadFilesKeys.PRODUCT_IMAGE_PATH);
    let res = await this.StoreFileToPath(productPath, UploadFilesKeys.PRODUCT_IMAGE_FIELDNAME, request, response, UploadFilesKeys.IMAGE_ACCEPTED_EXT);
    if (res) {
      const filename = response.req?.file.filename;
      if (filename) {
        let img: Image;
        if (imageId) {
          img = await this.imageRepository.findById(imageId);
          img.path = filename;
          img.order = order;
          await this.imageRepository.replaceById(imageId, img);
        } else {
          img = new Image({
            path: filename,
            order: order,
            productId: productId ?? ''
          });
          await this.imageRepository.create(img);
        }
        return {filename: filename};
      }
    }
    return res;
  }

  /**
   * Return a config for multer storage
   * @param path
   */
  private GetMulterStorageConfig(path: string) {
    var filename: string = '';
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path)
      },
      filename: function (req, file, cb) {
        filename = `${Date.now()}-${file.originalname}`
        cb(null, filename);
      }
    });
    return storage;
  }

  /**
   * store the file in a specific path
   * @param storePath
   * @param request
   * @param response
   */
  private StoreFileToPath(storePath: string, fieldname: string, request: Request, response: Response, acceptedExt: string[]): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      const storage = this.GetMulterStorageConfig(storePath);
      const upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
          var ext = path.extname(file.originalname).toUpperCase();
          if (acceptedExt.includes(ext)) {
            return callback(null, true);
          }
          return callback(new HttpErrors[400]('This format file is not supported.'));
        },
        limits: {
          fileSize: UploadFilesKeys.MAX_FILE_SIZE
        }
      },
      ).single(fieldname);
      upload(request, response, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

}
