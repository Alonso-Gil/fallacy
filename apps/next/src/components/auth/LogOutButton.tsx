"use client";
import { useRouter } from "next/navigation";

import { createClient } from "utils/supabase/component";

const LogOutButton = () => {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      type="button"
      className="mb-2 me-2 inline-flex items-center rounded-lg bg-[#24292F] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#24292F]/90 focus:outline-none focus:ring-4 focus:ring-[#24292F]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-gray-500"
      onClick={handleSignOut}
    >
      Log out
    </button>
  );
};

export default LogOutButton;
