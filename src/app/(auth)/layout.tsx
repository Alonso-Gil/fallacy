import { LayoutProps as Props } from "@/app/types";

const AuthLayout: React.FC<Props> = (props) => {
  const { children } = props;

  return <main className="flex flex-1">{children}</main>;
};

export default AuthLayout;
