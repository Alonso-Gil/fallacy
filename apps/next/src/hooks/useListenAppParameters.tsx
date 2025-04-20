import { useEffect } from "react";

// import { AppParameters } from "@fallacy/types";
import { useAppParametersStore } from "../store/appParameters/appParameters.store";
import { createClient } from "../utils/supabase/component";

const useListenAppParameters = () => {
  const supabase = createClient();
  const setAppParameters = useAppParametersStore(
    state => state.setAppParameters
  );

  useEffect(() => {
    try {
      // const fetchInitialConfig = async () => {
      //   const { data, error } = await supabase
      //     .from("app_parameters")
      //     .select("*")
      //     .single();
      //   if (error) {
      //     console.error("Error fetching initial config:", error);
      //   } else {
      //     setAppParameters(data);
      //   }
      // };
      // fetchInitialConfig();
      // const subscription = supabase
      //   .channel("app_parameters")
      //   .on(
      //     "postgres_changes",
      //     {
      //       event: "*",
      //       schema: "public",
      //       table: "app_parameters"
      //     },
      //     payload => {
      //       setAppParameters(payload.new as AppParameters);
      //     }
      //   )
      //   .subscribe();
      // return () => {
      //   supabase.removeChannel(subscription);
      // };
    } catch (error) {
      console.log("Error in useListenAppParameters:", error);
    }
  }, [setAppParameters, supabase]);
};

export default useListenAppParameters;
