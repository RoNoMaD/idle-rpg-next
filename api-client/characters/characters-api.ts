import { httpClient } from "../http-client";

type EditCharacterBody = {
  health: number;
  attack: number;
  defense: number;
  magik: number;
};

export async function createCharacter(name: string): Promise<Response> {
  return await httpClient(`characters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
}

export async function editCharacter(
  id: number,
  body: EditCharacterBody
): Promise<Response> {
  return await httpClient(`characters/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function deleteCharacter(id: number): Promise<Response> {
  return await httpClient(`characters/${id}`, {
    method: "DELETE",
  });
}
