import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
const { width, height } = Dimensions.get('screen');
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = height * 0.81;
export default function App() {
  const [data, setData] = useState([{}, {}]);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10); // Initial size
  const [maxPageSize, setMaxPageSize] = useState(false); // Max size 100
  const renderItem = useCallback(({ item, index }) => {
    return (
      <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: ITEM_WIDTH,
            height: ITEM_HEIGHT,
            backgroundColor: 'white',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            padding: 20,
            alignItems: 'center',
          }}
        >
          <ScrollView style={{ width: "100%" }}>
            <FastImage
              source={{ uri: item.avatar }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
                borderColor: 'red',
                borderWidth: 1,
                resizeMode: 'cover',
              }}
            />
            <Text style={{ fontSize: 16, paddingVertical: 10, marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold', textTransform: "uppercase" }}>UserId:</Text>
              <Text >{item.uid}</Text>
            </Text>
            <Text style={{ fontSize: 16, paddingVertical: 10 }}>
              <Text style={{ fontWeight: 'bold', textTransform: "uppercase" }}>UserName:</Text>
              <Text >{item.username}</Text>
            </Text>
            <Text style={{ fontSize: 16, paddingVertical: 10 }}>
              <Text style={{ fontWeight: 'bold', textTransform: "uppercase" }}>Password:</Text>
              <Text >{item.password}</Text>
            </Text>
            <Text style={{ fontSize: 16, paddingVertical: 10 }}>
              <Text style={{ fontWeight: 'bold', textTransform: "uppercase" }}>Full Name:</Text>
              <Text>
                {item.first_name} {item.last_name}
              </Text>
            </Text>
            <Text style={{ fontSize: 16, paddingVertical: 10 }}>
              <Text style={{ fontWeight: 'bold', textTransform: "uppercase" }}>UserId:</Text>
              <Text>{item.email}</Text>

            </Text>
          </ScrollView>
          <Text style={styles.index}>{index}</Text>

        </View>
      </View>
    );
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (pageSize <= 80) {
        const result = await fetch(
          `https://random-data-api.com/api/users/random_user?size=${pageSize}`
        );
        const response = await result.json();
        setData(response);
        setPageSize((prevSize) => prevSize + 10);
      }
      else {
        setMaxPageSize(true);
      }
      // Increase page size
    } catch (err) {
      setPageSize(10);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const endReached = async () => {
    fetchData();
  };

  const itemSeparatorComponent = useCallback(() => {
    return (
      <View style={{ width, height, justifyContent: "center", alignItems: "center" }}>
        {loading && <View>
          <ActivityIndicator size="large" color="blue" />
          <Text>Loading...</Text>
        </View>
        }
      </View>
    );
  }, [loading]);

  const keyExtractor = useCallback((item, index) => `${item.id || index}`, []);

  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={(props) => renderItem(props)}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }

          )

          }
          onEndReached={endReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={itemSeparatorComponent}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {
            const previousIndex = currentIndex - 1;
            if (previousIndex >= 0) {
              flatListRef.current.scrollToIndex({ index: previousIndex, animated: true });
              setCurrentIndex(previousIndex);
            }
          }}>
            <Text>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const nextIndex = currentIndex + 1;
              if (nextIndex < data.length) {
                flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
                setCurrentIndex(nextIndex);
              }
              else {
                setLoading(true);
                endReached();
              }
            }}
          >
            <Text>Next</Text>
          </TouchableOpacity>

        </View>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    gap: 16,
  },
  button: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 8,
  },
  index: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomRightRadius: 10,
  },
});
