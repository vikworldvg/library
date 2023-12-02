import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton, Colors } from 'react-native-paper';
import axios from 'axios';
import Pdf from 'react-native-pdf';


function CoursebooksScreen({ route, navigation }) {
  const { query } = route.params;
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        const response = await axios.get('https://astys1.github.io/MyBook/book.json');
      setBooks(response.data.filter(b => b.course === query));
    };

    fetchData();
  }, [query]);

  return (
    <ScrollView style={styles.scrollView}>
      <View>
        {books.map(b => (
          <View key={b.name}>
            <TouchableOpacity style={styles.book} onPress={() => navigation.navigate('PdfRead', { uri: b.url })}>
              <Image style={{ width: 100, height: 150, margin: 0, borderRadius: 15 }} source={{ uri: b.img }} />
              <View style={styles.title}>
                <Text style={styles.name}>{b.name}</Text>
                <Text style={styles.author}>{b.author}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function CoursesScreen({ navigation }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://astys1.github.io/MyBook/courses.json');
        setCourses(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.coursepalet}>
        {courses.map(course => (
          <TouchableOpacity style={styles.course} key={course.name} onPress={() => navigation.navigate('Книги курсу', { query: course.name })}>
            <Image style={{ width: 157, height: 157, margin: 6, marginBottom: 0 }} source={{ uri: course.img }} />
            <Text style={{ margin: 4 }}>{course.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

function BooksScreen({ navigation }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://kajuro.github.io/book.json');
        setBooks(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <View>
        {books.map(b => (
          <View key={b.name}>
            <TouchableOpacity style={styles.book} onPress={() => navigation.navigate('PdfRead', { uri: b.url })}>
              <Image style={{width: 100, height: 150, margin: 0, borderRadius: 15 }} source={{ uri: b.img }} />
              <View style={styles.title}>
                <Text style={styles.name}>{b.name}</Text>
                <Text style={styles.author}>{b.author}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
    </View>
    </ScrollView>
  );
}

const CoursesStack = createStackNavigator();

function CoursesStackScreen() {
  return (
    <CoursesStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#708090' } }}>
      <CoursesStack.Screen
        name="Курси"
        component={CoursesScreen}
        options={{
          headerTintColor: '#ffffff',
          headerRight: () => (
            <IconButton
              icon="information"
              color="#ffffff"
              size={24}
              onPress={_Alert}
            />
          ),
        }}
      />
      <CoursesStack.Screen name="Книги курсу" component={CoursebooksScreen} options={{ headerTintColor: '#ffffff' }} />
      <CoursesStack.Screen name="PdfRead" component={PdfRead} options={{ headerShown: false }}/>
    </CoursesStack.Navigator>
  );
}

const BooksStack = createStackNavigator();

function BooksStackScreen() {
  return (
    <BooksStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#708090' } }}>
      <BooksStack.Screen
        name="Книги"
        component={BooksScreen}
        options={{
          headerTintColor: '#ffffff',
          headerRight: () => (
            <IconButton
              icon="information"
              color="#ffffff"
              size={24}
              onPress={_Alert}
            />
          ),
        }}
      />
      <BooksStack.Screen name="PdfRead" component={PdfRead} options={{ headerShown: false }}/>
    </BooksStack.Navigator>
  );
}

const _Alert = () =>
  Alert.alert(
    'Про додаток',
    'Дипломний прєкт Виконали студентки групи КС-1-17  Байкалова А. О., Пуліна О. О.',
    [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ]
  );
 
  
const PdfRead = ({ route }) => {
  const pdfUri = route.params.uri;

  const PdfResource = { uri: pdfUri, cache: true };

  return (
    <View style={styles.container}>
      <Pdf
        trustAllCerts={false}
        source={PdfResource}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onError={(error) => {
          console.error('Error loading PDF:', error);
        }}
        style={styles.pdf}
      />
    </View>
  );
}


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ tabBarStyle: [{ display: "flex" }, {backgroundColor: '#708090'}, null ], }}>
        <Tab.Screen 
          name="Курси"
          component={CoursesStackScreen}
          options={{
            tabBarIcon: () => <AntDesign name="inbox" size={24} color="#FFF" />,
            headerShown: false
          }}
        />
        <Tab.Screen
          name="Книги"
          component={BooksStackScreen}
          options={{
            tabBarIcon: () => <AntDesign name="book" size={24} color="#FFF" />,
            headerShown: false
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = {
  book: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flexWrap: 'wrap',
  },
  coursepalet: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  course: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    margin: 8,
    width: 240,
  },
  author: {
    margin: 8,
  },
  img: {
    width: 100,
    height: 150,
    margin: 0,
    borderRadius: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
};
