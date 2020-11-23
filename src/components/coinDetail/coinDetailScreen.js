import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  Pressable,
  SectionList,
  FlatList,
  StyleSheet,
  Alert
} from 'react-native';
import Colors from 'cryptoTracker/src/res/colors';
import Http from 'cryptoTracker/src/libs/http';
import Storage from 'cryptoTracker/src/libs/storage';

import CoinMarketItem from './coinMarketItem';

const CoinDetailScreen = ({ route, navigation }) => {
  const [ coin, setCoin ] = useState({})
  const [ markets, setMarkets ] = useState({})
  const [ favorite, setFavorite ] = useState(false)

  useEffect(() => {
    const { coin } = route.params;
    setCoin(coin)
    navigation.setOptions({ title: coin.symbol })
    getMarkets(coin.id)
    getFavorite(coin)
    
  }, [])

  const getSymbolIcon = (name) => {
    if(name) {
      const symbol = name.toLowerCase().replace(' ', '-');
      return `https://c1.coinlore.com/img/25x25/${symbol}.png`
    }
  }

  const getSections = (coin) => {
    const sections = [
      {
        title: 'Market cap',
        data: [coin.market_cap_usd]
      },
      {
        title: 'Volume 24h',
        data: [coin.volume24]
      },
      {
        title: 'Change 24h',
        data: [coin.percent_change_24h]
      }
    ]
    return sections
  }

  const getMarkets = async (coinId) => {
    const url = `https://api.coinlore.net/api/coin/markets/?id=${coinId}`;
    const markets = await Http.instance.get(url);
    setMarkets(markets)
  }

  const toogleFavorite = () => {
    if(favorite) {
      removeFavorite();
    } else {
      addFavorite();
    }
  }
  const addFavorite = async() => {
    const coinStr = JSON.stringify(coin);
    const key = `favorite-${coin.id}`;
  
    const stored = await Storage.instance.store(key, coinStr);
    
    console.log("stored", stored);

    if(stored) {
      setFavorite(true)
    }

  }

  const removeFavorite = async () => {

    Alert.alert("Remove favorite", "Are you sure?", [
      {
        text: "cancel",
        onPress: () => {},
        style: "cancel"
      },
      {
        text: "Remove",
        onPress: async () => {

          const key = `favorite-${coin.id}`;

          await Storage.instance.remove(key);

          setFavorite(false)
        },
        style: "destructive"
      }
    ]);

  }
  const getFavorite = async (coin) => {
    try {
      const key = `favorite-${coin.id}`;

      const favStr = await Storage.instance.get(key);
      if(favStr !== null) {
        setFavorite(true)
      }

    } catch(err) {
      console.log("get favorites err", err);
    }

  }

  return(
    <View style={styles.container}>
      <View style={styles.subHeader}>
        <View style={styles.row}>
          <Image style={styles.imgIcon} source={{ uri: getSymbolIcon(coin.name) }} />
          <Text style={styles.titleText}>{coin.name}</Text>
        </View>
        <Pressable
          onPress={() => toogleFavorite()}
          style={[
            styles.btnFavorite,
            favorite ?
            styles.btnFavoriteRemove :
            styles.btnFavoriteAdd
          ]}>
          <Text style={styles.btnFavoriteText}>{ favorite ? "Remove favorite" : "Add favorite"}</Text>
        </Pressable>
      </View>
      

      <SectionList
        style={styles.section}
        sections={getSections(coin)}
        keyExtractor={(item) => item}
        renderItem={({ item }) =>
          <View style={styles.sectionItem}> 
            <Text style={styles.itemText}>{item}</Text>
          </View> 
        }
        renderSectionHeader={({ section }) => 
          <View style={styles.sectionHeader}>
          <Text style={styles.sectionText}>{section.title}</Text>
          </View>
        }
      />

      <Text style={styles.marketsTitle}>Markets</Text>

      <FlatList
        style={styles.list}
        keyExtractor={(item) => item}
        horizontal={true}
        data={markets}
        renderItem={({ item}) => <CoinMarketItem item={item}/>}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charade
  },
  row: {
    flexDirection: "row"
  },
  subHeader: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8
  },
  iconImg: {
    width: 25,
    height: 25
  },
  section: {
    maxHeight: 220
  },
  list: {
    maxHeight: 100,
    paddingLeft: 16
  },
  sectionHeader: {
    backgroundColor: "rgba(0,0,0, 0.2)",
    padding: 8
  },
  sectionItem: {
    padding: 8
  },
  itemText: {
    color: Colors.white,
    fontSize: 14
  },
  sectionText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "bold"
  },
  marketsTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 16
  },
  btnFavorite: {
    padding: 8,
    borderRadius: 8
  },
  btnFavoriteText: {
    color: Colors.white
  },
  btnFavoriteAdd: {
    backgroundColor: Colors.picton
  },
  btnFavoriteRemove: {
    backgroundColor: Colors.carmine
  }
});

export default CoinDetailScreen;