"use client";
import { HomeProps as Props } from "./Home.types";
// import LogOutButton from "@/components/auth/LogOutButton";

const Home: React.FC<Props> = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex h-16 w-full items-center justify-center bg-blue-500">
        Notificaciones - h 64px
      </div>
      <div className="flex h-full w-full">
        <div className="hidden min-w-72 flex-1 flex-col items-center justify-center md:flex">
          <div className="flex h-full w-full items-center justify-center bg-red-500">
            Lobby users - w 288px
          </div>
          <div className="flex h-28 w-full items-center justify-center bg-gray-500">
            User Info - h 112px
          </div>
        </div>
        <div className="flex w-full items-center justify-center bg-green-500">
          Lobby info
        </div>
      </div>
    </div>
  );
};

export default Home;
