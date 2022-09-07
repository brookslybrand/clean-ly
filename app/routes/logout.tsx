import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { logout } from '~/session.server';

export async function action({ request }: ActionArgs) {
  return logout(request);
}

// TODO: Don't logout from a loader, do it from the action
export async function loader({ request }: LoaderArgs) {
  return logout(request);
  // return redirect('/');
}
