export abstract class BaseService {
  constructor() {
    if (this.constructor === BaseService) {
      throw new Error(`Abstract classes can't be instantiated.`);
    }
  }
}
