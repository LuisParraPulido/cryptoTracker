import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import FavoritesEmptyState from './FavoritesEmptyState';
import CoinsItem from 'cryptoTracker/src/components/coins/coinsItem';

import Colors from 'cryptoTracker/src/res/colors';
import Storage from 'cryptoTracker/src/libs/storage';

const FavoritesScreen = (props) => {
  const [ favorites, setFavorites] = useState([])

  useEffect(() => {
    props.navigation.addListener("focus", getFavorites);
  }, [])

  const getFavorites = async () => {
    try {
      const allKeys = await Storage.instance.getAllkeys();

      const keys = allKeys.filter((key) => key.includes("favorite-"));

      const favs = await Storage.instance.multiGet(keys);

      const favorites = favs.map((fav) => JSON.parse(fav[1]));

      console.log("favs", favorites);

      setFavorites(favorites)

    } catch (err) {
      console.log("get favorites err", err);
    }
  }
  const handlePress = (coin) => {
    props.navigation.navigate("CoinDetail", { coin });
  }

  return (
    <View style={styles.container}>

       { favorites.length == 0 ?
        <FavoritesEmptyState />
        : null
       }

       { favorites.length > 0 ?
        <FlatList
          data={favorites}
          renderItem={({ item }) =>
            <CoinsItem
              item={item}
              onPress={() => handlePress(item)}
            />
          }
        />
        : null
       }

      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.charade,
    flex: 1
  }
});

export default FavoritesScreen;