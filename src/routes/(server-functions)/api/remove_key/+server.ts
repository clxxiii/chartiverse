import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { StatusCodes } from "$lib/StatusCodes";
import { prisma } from "$lib/server/prisma";

export const POST: RequestHandler = async ({ request }) => {
  const { id } = await request.json()
  if (!id) throw error(StatusCodes.BAD_REQUEST)

  try {
    await prisma.oauthToken.deleteMany({
      where: {
        "key_id": id
      }
    })
    await prisma.key.delete({
      where: {
        id
      },
      "include": {
        "token": true
      }
    })
  } catch (e) {
    console.log(e);
    throw error(StatusCodes.BAD_REQUEST)
  }

  return new Response()
}