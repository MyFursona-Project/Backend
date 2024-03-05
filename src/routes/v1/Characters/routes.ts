import type { FastifyInstance } from "fastify"
import {
  createCharacter,
  deleteCharacter,
  getCharacterById,
  getCharacterByName,
  getCharacters,
  updateCharacter
} from "./controllers"
import {
  CREATE_CHARACTER_SCHEMA,
  GET_CHARACTER_BY_ID_SCHEMA,
  GET_CHARACTER_BY_NAME_SCHEMA
} from "./schema"

export async function characterRoutes(server: FastifyInstance) {
  server.get("/", { preHandler: [server.auth] }, getCharacters)
  server.get("/id/:id", { schema: GET_CHARACTER_BY_ID_SCHEMA }, getCharacterById)
  server.get(
    "/name/:ownerHandle/:name",
    { schema: GET_CHARACTER_BY_NAME_SCHEMA },
    getCharacterByName
  )
  server.post(
    "/create",
    { preHandler: [server.auth], schema: CREATE_CHARACTER_SCHEMA },
    createCharacter
  )
  server.put("/update/:id", { preHandler: [server.auth] }, updateCharacter)
  server.delete("/delete/:id", { preHandler: [server.auth] }, deleteCharacter)
}
