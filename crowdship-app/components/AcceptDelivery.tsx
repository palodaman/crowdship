import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import React from "react";

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
  distance?: number;
}

interface AcceptDeliveryProps {
  selectedListing: Listing | null;
  setRenderAcceptDelivery: (state: boolean) => void;
}

const AcceptDelivery: React.FC<AcceptDeliveryProps> = ({
  selectedListing,
  setRenderAcceptDelivery,
}) => {
  const [listing, setListing] = useState<Listing>();
  const [loading, setLoading] = useState(true);

  const fetchlisting = async () => {
    try {
      if (!selectedListing) {
        throw new Error("No listing selected");
      }

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("listingid", selectedListing.listingid);

      console.log("DATA", data);

      if (error) {
        throw error;
      }
      setListing(data[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after data fetching
    }
  };

  useEffect(() => {
    fetchlisting();
    console.log("LIsting: ", listing);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    console.log("WE got here: "),
    (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.textContainer}>
            <View style={styles.itemImage}>
              <Text style={styles.itemImageText}>Photo of Item</Text>
            </View>
            <View style={styles.addressContainer}>
              <View style={styles.individualAddressContainer}>
                <Text style={styles.label}>Pickup From:</Text>
                <Text style={styles.data}>{listing?.startingaddress}</Text>
              </View>
              <View style={styles.individualAddressContainer}>
                <Text style={styles.label}>Deliver To:</Text>
                <Text style={styles.data}>{listing?.destinationaddress}</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.label}>You'll Earn:</Text>
              <Text style={styles.price}>${listing?.price}</Text>
            </View>
            <View style={styles.addressContainer}>
              <Text style={styles.itemDescription}>Item Description:</Text>
              <Text style={styles.itemDescription}>
                {listing?.itemdescription}
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.views}>
              <Icon name="eye" size={20} color="black" />
              <Text style={styles.numViews}>{listing?.views}</Text>
            </View>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#FF6961" }]}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#6EC175" }]}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 5,
    backgroundColor: "red",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  itemImage: {
    width: "100%",
    height: 150,
    backgroundColor: "gray",
    borderRadius: 10,
    padding: 63,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  itemImageText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 22,
  },
  addressContainer: {
    width: "100%",
    backgroundColor: "#2C3E50",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "flex-start", // Align items to the left
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  individualAddressContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    justifyContent: "center",
    shadowRadius: 4,
    alignItems: "flex-start", // Align items to the left
  },
  priceContainer: {
    width: "100%",
    backgroundColor: "#50C878",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "flex-start", // Align items to the left
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  label: {
    fontSize: 22,
  },
  data: {
    color: "black",
    fontSize: 16,
  },
  price: {
    color: "white",
    fontSize: 20,
  },
  itemDescription: {
    color: "white",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: "10%",
  },
  views: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  numViews: {
    color: "black",
  },
  button: {
    width: "40%",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  textContainer: {
    alignItems: "center",
  },
});

export default AcceptDelivery;
