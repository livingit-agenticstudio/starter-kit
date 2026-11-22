import { createAuthClient } from 'better-auth/svelte';

/** better-auth in the browser, on the app's own origin. A way to sign in adds its client plugin here. */
export const authClient = createAuthClient();
