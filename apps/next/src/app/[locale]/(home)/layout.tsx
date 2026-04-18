import { type ReactNode } from "react";

const HomeLayout = ({
  children
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <div className="flex h-full flex-col">
      <main className="flex flex-1">{children}</main>
    </div>
  );
};

export default HomeLayout;
