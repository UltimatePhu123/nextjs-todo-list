/* eslint-disable @next/next/no-img-element */
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

const Header = () => {
  const { data: sessionData } = useSession();
  const [darkTheme, setDarkTheme] = useState<boolean>(false);

  useEffect(() => {
    const themeChange = () => {
      const themeData = document.querySelector("html");
      if (darkTheme) {
        themeData?.setAttribute("data-theme", "night");
      } else {
        themeData?.setAttribute("data-theme", "winter");
      }
    };

    themeChange();
  }, [darkTheme]);

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1 pl-5 text-3xl font-bold">
        {sessionData?.user?.name
          ? `Todo list for ${sessionData.user.name}`
          : ""}
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="swap swap-rotate pr-4">
            <input
              type="checkbox"
              onChange={() => setDarkTheme(!darkTheme)}
            />
            <FaMoon size={"3rem"} className="swap-on" />
            <FaSun size={"3rem"} className="swap-off" />
          </label>
          {sessionData?.user ? (
            <label
              tabIndex={0}
              className="btn-ghost btn-circle avatar btn"
              onClick={() => void signOut()}
            >
              <img
                className="w-20 rounded-full"
                src={sessionData?.user?.image ?? ""}
                alt="User Avatar"
              />
            </label>
          ) : (
            <button onClick={() => void signIn()}>Sign In</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
