import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import React from 'react';
import { View, ScrollView, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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

const AcceptDelivery = () => {
    const [listings, setListings] = useState<Listing[]>([])
    const [loading, setLoading] = useState(true);


    const fetchListings = async () => {
        try {
            const {data, error} = await supabase.from('listings').select('*');
            if (error) {
                throw error;
            }
            setListings(data);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false); // Set loading to false after data fetching
        }
    }  

   useEffect(() => {
        fetchListings();
        console.log(listings[0])
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.textContainer}>
          <View style={styles.itemImage}>
            <Text style={styles.itemImageText}>Photo of Item</Text>
          </View>
          <View style={styles.addressContainer}>
            <View style={styles.individualAddressContainer}>
              <Text style={styles.label}>Pickup From:</Text>
              <Text style={styles.data}>{listings[1].startingaddress}</Text>
            </View>
            <View style={styles.individualAddressContainer}>
              <Text style={styles.label}>Deliver To:</Text>
              <Text style={styles.data}>{listings[1].destinationaddress}</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.label}>You'll Earn:</Text>
            <Text style={styles.price}>${listings[1].price}</Text>
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.itemDescription}>Item Description: {listings[1].itemdescription}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.views}>
            <Icon name="eye" size={20} color="black"/>
              <Text style={styles.numViews}>{listings[1].views}</Text>
            </View>
          <TouchableOpacity style={[styles.button, {backgroundColor: 'red'}]}>
              <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, {backgroundColor: '#1AED60'}]}>
              <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View> 
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    alignItems: 'center',
    fontFamily: 'Avenir'
  },
  itemImage: {
    width: '90%',
    height: 250,
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImageText: {
    color: 'white',
    fontFamily: 'Avenir', 
    fontWeight: 'bold',
    fontSize: 22,
  },
  addressContainer: {
    width: '90%',
    backgroundColor: '#2C3E50',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  individualAddressContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 4,
  },
  priceContainer: {
    width: '90%',
    backgroundColor: '#50C878',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  label: {
    fontFamily: 'Avenir', 
    fontSize: 22,
  },
  data: {
    color: 'black',
    fontFamily: 'Avenir', 
    fontSize: 16,
  },
  price: {
    color: 'white',
    fontFamily: 'Avenir', 
    fontSize: 20,
  },
  itemDescription: {
    color: 'white',
    fontFamily: 'Avenir', 
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: '10%'
  },
  views: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  numViews: {
    color: 'black',
    fontFamily: 'Avenir',
  },
  button: {
    width: '40%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Avenir'
  },
});

export default AcceptDelivery;