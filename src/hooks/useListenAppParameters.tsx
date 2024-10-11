import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
import { useAppParametersStore } from "@/store/appParameters/appParameters.store";
import { AppParameters } from "@/types/common.types";

const useListenAppParameters = () => {
  const [isClient, setIsClient] = useState(false);
  const setAppParameters = useAppParametersStore(
    (state) => state.setAppParameters,
  );

  useEffect(() => {
    setIsClient(true);

    const fetchInitialConfig = async () => {
      const { data, error } = await supabase
        .from("app_parameters")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching initial config:", error);
      } else {
        setAppParameters(data);
      }
    };

    if (isClient) {
      fetchInitialConfig();
    }

    const subscription = supabase
      .channel("app_parameters")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "app_parameters",
        },
        (payload) => {
          setAppParameters(payload.new as AppParameters);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [isClient, setAppParameters]);
};

export default useListenAppParameters;
