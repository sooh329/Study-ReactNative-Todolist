import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';{}
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from "./colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fontisto from '@expo/vector-icons/Fontisto';

const STORAGE_KEY = "@toDos"

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  };
  const loadToDos = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY) // 새로고침해도 전에 있던 데이터를 가져옴
    setToDos(JSON.parse(s));    // 가져온 데이터(스트링타입)를 오브젝트로 바꾼 후 새로고침의 영향으로 비어있게 된 투두리스트에 저장
  };
  useEffect(() => {
    loadToDos();
  }, [])
  const addToDo = async () => {
    if(text === ""){
      return;     // 입력창이 비어있으면 그대로 아무것도 실행하지 않고 작업종료. 빈 할일목록을 저장하는 것을 막기 위함
    }
    const newToDos = Object.assign(   // 첫번째 변수에 두번째, 세번째 변수를 결합시켜서 저장하는 메서드
      {}, // 새 오브젝트
      toDos, //기존 투두리스트
      {[Date.now()] : {text, work:working}}   //새로운 할 일
    );
/*  const newToDos = {
      ...toDos,
      [Date.now()]: {text, work:working},
      };
*/
    setToDos(newToDos);   //기존 투두리스트 자리에 새로 만들어진 오브젝트를 저장
    await saveToDos(newToDos);
    setText("");    //입력창 초기화
  };
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do?", "Are you sure?", 
      [
        {text: "Cancel"},
        {text: "I'm Sure",
          onPress: () =>{
            const newToDos = {...toDos} // 기존 투두리스트를 복사해 새로운 투두리스트를 생성
            delete newToDos[key]        // 새로운 투두리스트에서 선택된 키값의 해당하는 투두리스트 삭제
            setToDos(newToDos);         // 기존 투두리스트 자리에 새로운 투두리스트 저장
            saveToDos(newToDos);
          },
        },
      ]);
    return;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: working ? theme.grey : "white"}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          returnKeyType='done'
          value={text}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"} 
          style={styles.input} />
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) => 
          toDos[key].work === working ? (
            <View style={styles.toDo} key = {key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteToDo(key)}><Fontisto name="trash" size={18} color={theme.grey} /></TouchableOpacity>
            </View> 
          ) : null)
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertival: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop : 20,
    marginBottom: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
