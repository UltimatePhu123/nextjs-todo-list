/* eslint-disable @next/next/no-img-element */
import { signIn, signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1 text-3xl font-bold pl-5">
        {sessionData?.user?.name ? `Todo list for ${sessionData.user.name}` : ""}
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
            {sessionData?.user ? (
                <label
                    tabIndex={0}
                    className="avatar btn-ghost btn btn-circle"
                    onClick={() => void signOut()}
                >
                    <img className=" w-20 rounded-full" src={sessionData?.user?.image ?? ""} alt="User Avatar" />
                </label>
            ) : (
                <button onClick={() => void signIn()}>
                    Sign In
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Header;
