import { addMethod, object, string, number, TypeOf } from "yup";

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
