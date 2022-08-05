import type { Handle } from "@sveltejs/kit";

// I don't really need this since this is only used during dev,
// but it increases performance and reciprocates what build renders
export const handle: Handle = ({ event, resolve }) =>
  resolve(event, { ssr: false });
