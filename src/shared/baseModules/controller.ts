export abstract class BaseController {
  constructor() {
    if (this.constructor === BaseController) {
      throw new Error(`Abstract classes can't be instantiated.`);
    }
  }
}
