import React from "react";

import { SafeAreaView, StyleSheet, View, Text, TextInput, ListItem, TouchableOpacity, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

const COLORS = {
  primary: "#1f145c",
  white: '#fff'
}

const App = () => {
  const [textInput, setTextInput] = React.useState("");

  const [todos, setTodos] = React.useState([
    { id: 1, task: 'First Todo 1', completed: true },
    { id: 2, task: 'First Todo 2', completed: true },
    { id: 3, task: 'First Todo 3', completed: false },
  ]);

  React.useEffect(() => {
    saveTodoTouserDevice();
  }, [todos])

  const ListItem = ({ todo }) => {
    return <View style={styles.listItem}>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 15,
          color: COLORS.primary,
          textDecorationLine: todo?.completed ? "line-through" : 'none'
        }}>
          {todo?.task}
        </Text>
      </View>
      {
        !todo?.completed && (
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => markTodoComplete(todo.id)}>
            <Icon name="done" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )
      }
      <TouchableOpacity
        style={styles.actionIcon}
        onPress={() => deleteTodo(todo?.id)}>
        <Icon name="delete" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </View >
  }


  const addTodo = () => {
    if (textInput == '') {
      Alert.alert("Error", 'Fill input')
    }
    else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false
      }
      setTodos([...todos, newTodo]);
      setTextInput("")
    }
  }

  const markTodoComplete = todoId => {
    const newTodos = todos.map((item) => {
      if (item.id == todoId) {
        return { ...item, completed: true }
      }
      return item;
    })
    setTodos(newTodos)
  }

  const deleteTodo = todoId => {
    const newTodos = todos.filter(item => item.id != todoId)
    setTodos(newTodos)
  }

  const clearTodos = () => {
    Alert.alert('Confirm', 'Clear todos?', [
      {
        text: "Yes",
        onPress: () => setTodos([]),
      }, { text: "No" }
    ])
    setTodos([])
  }

  const saveTodoTouserDevice = async (todos) => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('@storage_Key', stringifyTodos);
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 20,
          color: COLORS.primary,
        }}>Salamlar</Text>
        <Icon
          name="delete"
          size={25}
          color="red"
          onPress={clearTodos}
        />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        data={todos}
        renderItem={({ item }) => <ListItem todo={item} />}
      />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Add Todo"
            value={textInput}
            onChangeText={text => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color={COLORS.white} size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  footer: {
    position: "absolute",
    bottom: 0,
    color: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: "center",
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default App