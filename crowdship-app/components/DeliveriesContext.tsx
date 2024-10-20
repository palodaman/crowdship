import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface Listing {
  listingid: string;
  senderid: string;
  status: string;
  price: number;
  views: string;
  startingaddress: string;
  destinationaddress: string;
  itemdescription: string;
  itemimageurl: string | null;
}

interface DeliveriesContextType {
  activeDeliveries: Listing[];
  pastDeliveries: Listing[];
  fetchActiveDeliveries: () => void;
  fetchPastDeliveries: () => void;
}

const DeliveriesContext = createContext<DeliveriesContextType | undefined>(
  undefined
);

interface DeliveriesProviderProps {
  children: React.ReactNode;
}

export const DeliveriesProvider: React.FC<DeliveriesProviderProps> = ({
  children,
}) => {
  const [activeDeliveries, setActiveDeliveries] = useState<Listing[]>([]);
  const [pastDeliveries, setPastDeliveries] = useState<Listing[]>([]);

  const fetchActiveDeliveries = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active");
    if (error) {
      console.error(error);
    } else {
      setActiveDeliveries(data);
    }
  };

  const fetchPastDeliveries = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "delivered");
    if (error) {
      console.error(error);
    } else {
      setPastDeliveries(data);
    }
  };

  useEffect(() => {
    fetchActiveDeliveries();
    fetchPastDeliveries();
  }, []);

  return (
    <DeliveriesContext.Provider
      value={{
        activeDeliveries,
        pastDeliveries,
        fetchActiveDeliveries,
        fetchPastDeliveries,
      }}
    >
      {children}
    </DeliveriesContext.Provider>
  );
};

export const useDeliveries = () => {
  const context = useContext(DeliveriesContext);
  if (!context) {
    throw new Error("useDeliveries must be used within a DeliveriesProvider");
  }
  return context;
};
