import { signOut } from "next-auth/react";

const Header = () => {
  return (
    <header className="h-10 bg-color_text_ocean">
      <nav>
        <div>
          <button onClick={() => signOut()}> Sign Out </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
