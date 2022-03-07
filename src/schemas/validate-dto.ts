import { Field, Model } from './model';
import { Val, ValFunc, ValModel } from './validator';

function _validationField(model: Model, field: Field): ValFunc | undefined {
  if (field.primary) return undefined; // do not validate primary fields
  const res: ValFunc[] = [];
  if (!field.nullable) res.push(Val.defined());
  switch (field.fieldType) {
    case 'string':
      res.push(Val.typeOf('string'));
      res.push(Val.lengthOf({ max: field.length }));
      break;
    case 'number':
      res.push(Val.typeOf('number'));
      break;
    case 'boolean':
      res.push(Val.typeOf('boolean'));
      break;
    case 'Date':
      res.push(Val.instanceOf(Date));
      break;
  }

  if (res.length === 0) return undefined;
  if (res.length === 1) return res[0];
  return Val.compose(...res);
}

export function validationModel(model: Model): ValModel {
  const res: ValModel = {};
  Object.values(model.fields)
    .filter(f => model.isFieldProperty(f))
    .forEach(f => {
      const val = _validationField(model, f);
      if (val) res[f.fieldName] = val;
    });
  return res;
}
