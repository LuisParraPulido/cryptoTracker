import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Http from 'cryptoTracker/src/libs/http';
import Colors from 'cryptoTracker/src/res/colors';

import CoinsItem from './coinsItem';
import CoinsSearch from './CoinsSeach';

const url = 'https://api.coinlore.net/api/tickers/';

const CoinsScreen = (props) => {
  const [ coins, setCoins ] = useState([])
  const [ allCoins, setAllCoins ] = useState([])
  const [ loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const coins = await Http.instance.get(url);
    setCoins(coins.data)
    setAllCoins(coins.data)
    setLoading(false)
  }

  const handlePress = (coin) => {
    props.navigation.navigate('CoinDetail', { coin })
  }

  const handleSearch = (query) => {
    const coinsFiltered = allCoins.filter((coin) => {
      return coin.name.toLowerCase().includes(query.toLowerCase()) || 
      coin.symbol.toLowerCase().includes(query.toLowerCase());
    })

    setCoins(coinsFiltered)
  }

  return(
    <View style={styles.container}>
      <CoinsSearch onChange={handleSearch} />
      { loading ?
        <ActivityIndicator 
          style={styles.loading}
          color='#fff' 
          size='large' 
        />
        : null
      }
      <FlatList 
        data={coins}
        renderItem={({ item }) => 
        <CoinsItem item={item} onPress={() => handlePress(item)} />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charade,
  },
  titleText: {
    color: '#fff',
    textAlign: 'center'
  },
  btn: {
    padding: 8,
    backgroundColor: 'blue',
    borderRadius: 8,
    margin: 16
  },
  btnText: {
    color: '#fff',
    textAlign: 'center'
  },
  loading: {
    marginTop: 60,
  }
})

export default CoinsScreen;