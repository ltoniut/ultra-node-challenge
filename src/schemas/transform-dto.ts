import { Dto, Model, Field } from './model';

const debug = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function log(...args: any[]): void {
  if (!debug) return;
  console.log(...args);
}
export interface TransformDtoOptions {
  include?: string[];
  exclude?: string[];
}
export class DtoTransformer {
  _transformDtoFilterPrefix(
    prefix: string,
    opts: TransformDtoOptions,
  ): TransformDtoOptions {
    const filter = (n: string): boolean =>
      prefix ? n.startsWith(prefix) : n.indexOf('.') === -1;
    const map = (n: string): string => n.slice(prefix.length);
    return {
      include: (opts.include || []).filter(filter).map(map),
      exclude: (opts.exclude || []).filter(filter).map(map),
    };
  }

  _transformDtoFilter(name: string, opts: TransformDtoOptions): boolean {
    log('_transformDtoFilter', { name, opts });
    if (
      opts.exclude &&
      opts.exclude.length > 0 &&
      opts.exclude.indexOf(name) >= 0
    ) {
      return false;
    }
    if (
      opts.include &&
      opts.include.length > 0 &&
      opts.include.indexOf(name) < 0
    ) {
      return false;
    }
    return true;
  }

  _transformDtoAssign(
    model: Model,
    opts: TransformDtoOptions,
    src: Dto,
    dst: Dto,
    field: Field,
    prefix: string,
  ): void {
    log('_transformDtoAssign', {
      model: model.name,
      field,
      value: src[field.fieldName],
    });
    let val = src[field.fieldName];
    if (val === null || val === undefined) {
      return;
    }

    if (model.isProperty(field.fieldName)) {
      if (field.fieldType === 'Date' && val) {
        val = new Date(val);
      }
      dst[field.fieldName] = val;
      return;
    }
    if (model.isType(field.fieldName, 'array') && Array.isArray(val)) {
      // copy array
      dst[field.fieldName] = [...val];
      return;
    }

    prefix = `${prefix}${field.fieldName}.`;

    if (model.isType(field.fieldName, 'relationArray') && Array.isArray(val)) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      dst[field.fieldName] = this.transformDtos(
        field.fkType || '',
        val,
        opts,
        prefix,
      );
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (!val._type) val._type = field.fkType;
    dst[field.fieldName] = this.transformDto(val, opts, prefix);
  }

  transformDto(src: Dto, opts: TransformDtoOptions = {}, prefix = ''): Dto {
    if (!src._type) {
      throw new Error('_type field is not defined');
    }
    const model = Model.getModel(src._type);
    if (!model) {
      throw new Error(`Model '${src._type}' not defined`);
    }
    const dst: Dto = {
      _type: src._type,
    };
    if (src._meta) {
      dst._meta = { ...src._meta };
    }

    const localOpts = this._transformDtoFilterPrefix(prefix, opts);
    log({ opts, localOpts, prefix, fields: Object.keys(model.fields) });

    Object.values(model.fields)
      .filter(f => this._transformDtoFilter(f.fieldName, localOpts))
      .forEach(f => this._transformDtoAssign(model, opts, src, dst, f, prefix));
    return dst;
  }

  transformDtos(
    type: string,
    list: Dto[],
    opts: TransformDtoOptions = {},
    prefix = '',
  ): Dto[] {
    const model = Model.getModel(type);
    if (!model) {
      throw new Error(`Model '${type}' not defined`);
    }

    const localOpts = this._transformDtoFilterPrefix(prefix, opts);
    const fields = Object.values(model.fields).filter(f =>
      this._transformDtoFilter(f.fieldName, localOpts),
    );

    return list.map(src => {
      const dst: Dto = { _type: type };
      if (src._meta) {
        dst._meta = { ...src._meta };
      }
      src._type = type;
      fields.forEach(f =>
        this._transformDtoAssign(model, opts, src, dst, f, prefix),
      );
      return dst;
    });
  }
}

export default new DtoTransformer();
