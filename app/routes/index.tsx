import { Link } from '@remix-run/react';
import { useOptionalUser } from '~/utils';
import { clsx } from 'clsx';

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="min-h-screen bg-slate-100 py-24">
      <h1 className="w-full space-y-6 text-center">
        <span className="block text-6xl text-yellow-600 drop-shadow-sm">
          Cleanly
        </span>
        <span className="block text-4xl text-yellow-800 drop-shadow-sm">
          keeping the Lybrand house clean
        </span>
      </h1>
      <div className="flex justify-center pt-20">
        {user ? (
          <Link
            to="/notes"
            className="flex items-center justify-center rounded-md border border-transparent bg-white py-3 px-8 text-base font-medium text-violet-700 shadow-sm hover:bg-violet-50"
          >
            View Notes for {user.email}
          </Link>
        ) : (
          <div className="inline-grid grid-cols-2 gap-8 space-y-0">
            <Link
              to="/join"
              className={clsx(
                linkBaseClassname,
                'border border-transparent bg-white px-8 text-base font-medium text-gray-800 shadow-sm hover:border-gray-200 hover:bg-stone-200'
              )}
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className={clsx(
                linkBaseClassname,
                'bg-yellow-600  font-medium text-white hover:bg-yellow-800'
              )}
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

const linkBaseClassname =
  'flex items-center justify-center rounded-md px-12 py-3';
