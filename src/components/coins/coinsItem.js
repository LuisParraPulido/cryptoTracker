import React from 'react';
import { View, Pressable, Text, Image, StyleSheet, Platform } from 'react-native';
import Colors from 'cryptoTracker/src/res/colors';

const arrowUp = 'cryptoTracker/src/assets/arrow_up.png';
const arrowDown = 'cryptoTracker/src/assets/arrow_down.png';

const CoinsItem = ({ item, onPress }) => {

  const getImageArrow = () => {
    if(item.percent_change_1h > 0) {
      return require(arrowUp)
    } else {
      return require(arrowDown)
    }
  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.symbolText}>{item.symbol}</Text>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.nameText}>{`$ ${item.price_usd}`}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.percent}>{item.percent_change_1h}</Text>
        <Image 
          style={styles.imgIcon}
          source={getImageArrow()}
        />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: Colors.zircon,
    borderBottomWidth: 1,
    paddingLeft: Platform.OS === 'ios' ? 0 : 16,
    marginLeft: Platform.OS === 'ios' ? 16 : 0
  },
  row: {
    flexDirection: 'row'
  },
  symbolText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 12
  },
  nameText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 16
  },
  percent: {
    color: '#fff',
    fontSize: 12,
    marginRight: 8
  },
  imgIcon: {
    width: 22,
    height: 22
  }
})

export default CoinsItem;