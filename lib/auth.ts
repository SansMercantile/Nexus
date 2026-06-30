import { getSession } from '@auth0/nextjs-auth0';

/**
 * Auth0 Session Verification
 * The primary method for verifying user identity in the production environment.
 */
export async function verifyAuth0Session(req: any, res: any) {
  const session = await getSession(req, res);
  if (!session || !session.user) {
    return null;
  }
  return session.user;
}