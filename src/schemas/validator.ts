/* eslint-disable @typescript-eslint/no-explicit-any */
export type ValArg = {
  model: Record<string, any>;
  name: string;
  value: any;
};
export type ValFunc = (arg: ValArg) => string;
export type ValMsg = string | ValFunc;

export type ValResult = {
  valid: boolean;
  errors: {
    [key: string]: string;
  };
};

export interface ValModel {
  [key: string]: ValFunc;
}

export class Val {
  constructor(readonly model: ValModel) {}

  validate(model: Record<string, any>): ValResult {
    const res: ValResult = { valid: true, errors: {} };
    Object.entries(this.model).forEach(([key, val]) => {
      if (key !== 'id') {
        const msg = val({ model, name: key, value: model[key] });
        if (msg) {
          res.errors[key] = msg;
          res.valid = false;
        }
      }
    });
    return res;
  }

  static getMessage(arg: ValArg, msg: ValMsg): string {
    if (typeof msg === 'string') return msg;
    return msg(arg);
  }

  static compose(...validators: ValFunc[]): ValFunc {
    return function And(value: ValArg): string {
      for (let k = 0, n = validators.length; k < n; k++) {
        const val = validators[k];
        const msg = val(value);
        if (msg) return msg;
      }
      return '';
    };
  }

  static truthy(message?: ValMsg): ValFunc {
    return arg =>
      arg.value
        ? ''
        : Val.getMessage(
            arg,
            message || `Field '${arg.name}' should be truthy`,
          );
  }
  static defined(message?: ValMsg): ValFunc {
    return arg =>
      arg.value === null || arg.value === undefined
        ? Val.getMessage(
            arg,
            message || `Field '${arg.name}' should have a value`,
          )
        : '';
  }

  static typeOf(aType: string, message?: ValMsg): ValFunc {
    return arg =>
      typeof arg.value === aType
        ? ''
        : Val.getMessage(
            arg,
            message || `Field '${arg.name}' should be of type '${aType}'`,
          );
  }

  static range(
    {
      min,
      max,
      throwNotNumber,
    }: { min?: number; max?: number; throwNotNumber?: boolean },
    message?: ValMsg,
  ): ValFunc {
    return arg => {
      if (typeof arg.value !== 'number')
        return throwNotNumber ? `Field '${arg.name}' is not a number` : '';
      if (
        typeof min === 'number' &&
        typeof max === 'number' &&
        (arg.value < min || arg.value > max)
      )
        return Val.getMessage(
          arg,
          message || `Field '${arg.name}' should be between ${min} and ${max}`,
        );

      if (typeof min === 'number' && arg.value < min)
        return Val.getMessage(
          arg,
          message || `Field '${arg.name}' minimum required is ${min}`,
        );
      if (typeof max === 'number' && arg.value > max)
        return Val.getMessage(
          arg,
          message || `Field '${arg.name}' maximum required is ${max}`,
        );
      return '';
    };
  }

  static anyOf(list: any[], message?: ValMsg): ValFunc {
    return arg =>
      list.includes(arg.value)
        ? ''
        : Val.getMessage(
            arg,
            message ||
              `Field '${arg.name}' is not inluded in [${list.join(', ')}]`,
          );
  }

  static lengthOf(
    { min, max }: { min?: number; max?: number },
    message?: ValMsg,
  ): ValFunc {
    return arg => {
      if (!arg.value) return '';
      if (arg.value.length === undefined) return '';
      const length = arg.value.length;
      if (typeof length !== 'number')
        return `Field length of '${arg.name}' is not a number`;
      if (
        typeof min === 'number' &&
        typeof max === 'number' &&
        (length < min || length > max)
      )
        return Val.getMessage(
          arg,
          message || `Field '${arg.name}' should be between ${min} and ${max}`,
        );

      if (typeof min === 'number' && length < min)
        return Val.getMessage(
          arg,
          message || `Field '${arg.name}' minimum required is ${min}`,
        );
      if (typeof max === 'number' && length > max)
        return Val.getMessage(
          arg,
          message || `Field '${arg.name}' maximum required is ${max}`,
        );
      return '';
    };
  }

  static instanceOf(classType: Function, message?: ValMsg): ValFunc {
    return arg =>
      arg.value instanceof classType
        ? ''
        : Val.getMessage(
            arg,
            message ||
              `Field '${arg.name}' is not an instance of ${classType.name}`,
          );
  }
}
