import { addMethod, object, string, number, TypeOf, BaseSchema } from "yup";
import { AssertsShape, ObjectShape, TypeOfShape } from "yup/lib/object";
import { AnyObject, Maybe, Optionals } from "yup/lib/types";

declare module "yup" {
  interface ObjectSchema<
    TShape extends ObjectShape,
    TContext extends AnyObject = AnyObject,
    TIn extends Maybe<TypeOfShape<TShape>> = TypeOfShape<TShape>,
    TOut extends Maybe<AssertsShape<TShape>> =
      | AssertsShape<TShape>
      | Optionals<TIn>
  > extends BaseSchema<TIn, TContext, TOut> {
    atLeastOneOf(params: string[]): ObjectSchema<TShape, TContext, TIn>;
  }
}

addMethod(object, "atLeastOneOf", function (list) {
  return this.test({
    name: "atLeastOneOf",
    message: "${path} must have at least one of these keys: ${keys}",
    exclusive: true,
    params: { keys: list.join(", ") },
    test: (value) => value == null || list.some((f) => !!value[f]),
  });
});

export const createCharacterSchema = object({
  name: string().required().min(2),
});

export const updateCharacterSchema = object({
  health: number().positive(),
  attack: number().positive(),
  defense: number().positive(),
  magik: number().positive(),
}).atLeastOneOf(["health", "attack", "defense", "magik"]);

export const characterIdSchema = number().required();

export type CreateCharacter = TypeOf<typeof createCharacterSchema>;
