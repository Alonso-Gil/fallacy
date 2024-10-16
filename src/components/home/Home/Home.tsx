"use client";
import { HomeProps as Props } from "./Home.types";
import LogOutButton from "@/components/auth/LogOutButton";

const Home: React.FC<Props> = () => {
  return (
    <div className="flex h-full w-full bg-red-500">
      <LogOutButton />
    </div>
  );
};

export default Home;
