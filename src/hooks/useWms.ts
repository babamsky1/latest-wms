import { useContext } from "react";
import { WmsContext } from "@/context/WmsContextType";

export const useWms = () => {
  const context = useContext(WmsContext);
  if (context === undefined) {
    throw new Error("useWms must be used within a WmsProvider");
  }
  return context;
};
