import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const STOCKS = [
  { name: 'AAPL', value: '+1.25%' },
  { name: 'GOOGL', value: '+0.87%' },
  { name: 'TSLA', value: '-0.43%' },
  { name: 'AMZN', value: '+2.14%' },
];

const ACCENT = '#A7C5FF';

export default function StocksTicker() {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -300,
        duration: 10000,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.tickerContainer, { transform: [{ translateX }] }]}>
        {STOCKS.map((stock, index) => (
          <Text key={index} style={styles.text}>
            {`${stock.name}: ${stock.value}   `}
          </Text>
        ))}
        {STOCKS.map((stock, index) => (
          <Text key={`dup-${index}`} style={styles.text}>
            {`${stock.name}: ${stock.value}   `}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 28,
    width: '60%',
    overflow: 'hidden',
    backgroundColor: 'rgba(167,197,255,0.06)',
    borderColor: 'rgba(167,197,255,0.28)',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    marginLeft: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: ACCENT,
    fontSize: 11,
    fontWeight: '500',
  },
});