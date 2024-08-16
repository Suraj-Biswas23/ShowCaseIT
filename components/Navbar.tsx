import { NavLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import AuthProviders from './AuthProviders';

const Navbar = () => {
  const session = {};
  return (
    <>
      {/* Add the "In Development" text */}
      <div className="w-full text-center py-2 bg-yellow-200 text-gray-800">
        In Development
      </div>

      <nav className="flexBetween navbar">
        <div className="flex-1 flexStart gap-10">
          <Link href="/">
            <Image 
              src="/logo.svg"
              width={150}
              height={43}
              alt="ShowCaseIt"
            />
          </Link>
          <ul className="xl:flex hidden text-small gap-7">
            {NavLinks.map((link) => (
              <Link href={link.href} key={link.key}>
                {link.text}
              </Link>
            ))}
          </ul>
        </div>

        <div className="flexCenter gap-4">
          {session ? (
            <>
              UserPhoto
              <Link href="/create-poject">
                Share Work
              </Link>
            </>
          ) : (
            <AuthProviders/>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
