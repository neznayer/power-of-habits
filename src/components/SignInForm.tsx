import { signIn } from "next-auth/react";
import Image from "next/image";
import { FaRegEnvelope } from "react-icons/fa";
import { Button } from "./Button";
import { Card } from "./Card";
import Divider from "./Divider";
import { Input } from "./Input";

export const SignInForm = () => {
  return (
    <>
      <Card className="relative h-fit w-[250px] gap-[12px] overflow-hidden pt-[120px] text-[12px]">
        <Image
          src="sail.svg"
          alt="a boat seiling towards big waves"
          width={300}
          height={200}
          className="absolute top-0 left-0"
        />
        <Input type={"email"} placeholder="Email" />
        <Input type={"password"} placeholder="Password" />
        <Button onClick={() => signIn("email")}>
          <FaRegEnvelope />
          <span>Sign in</span>
        </Button>
        <Divider text="or" />
        <Button onClick={() => signIn("google")}>
          <Image
            width={24}
            height={24}
            alt="google logo"
            src="google_logo.svg"
          />
          <span className="inline-block">Signin with Google</span>
        </Button>
      </Card>
    </>
  );
};
