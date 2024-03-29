import { createRecord } from '$lib/prisma';
import { MODULE } from '$lib/utils/constants.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { name, userId } = await request.json();

  await createRecord(MODULE, {
    name,
    user: { connect: { id: userId } }
  });

  return new Response(undefined, { status: 201 });
}
