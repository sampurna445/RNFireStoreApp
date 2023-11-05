/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Button,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import styles from './styles';

function App() {
  const [entities, setEntities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [empData, setEmpData] = useState({
    EmpFirstName: '',
    EmpLastName: '',
    Id: 0,
  });

  const addEntity = async () => {
    try {
      const entityData = {
        EmpFirstName: empData.EmpFirstName,
        EmpLastName: empData.EmpLastName,
        Id: empData.Id,
      };
      await addEmpEntityToFirestore(entityData);
      loadEntities();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding entity to Firestore: ', error);
    }
  };

  const loadEntities = async () => {
    try {
      const loadedEntities = await getEmpEntitiesFromFirestore();
      setEntities(loadedEntities);
    } catch (error) {
      console.error('Error fetching entities from Firestore: ', error);
    }
  };

  useEffect(() => {
    loadEntities();
  }, []);

  return (
    <View style={styles.container}>
      {showForm ? (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Emp First Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Emp First Name"
            value={empData.EmpFirstName}
            onChangeText={text => setEmpData({...empData, EmpFirstName: text})}
          />
          <Text style={styles.label}>Emp Last Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Emp Last Name"
            value={empData.EmpLastName}
            onChangeText={text => setEmpData({...empData, EmpLastName: text})}
          />
          <Text style={styles.label}>Id:</Text>
          <TextInput
            style={styles.input}
            placeholder="Id"
            value={String(empData.Id)}
            onChangeText={text => setEmpData({...empData, Id: parseInt(text)})}
          />
          <TouchableOpacity style={styles.submitButton} onPress={addEntity}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Button title="Add Entity" onPress={() => setShowForm(true)} />
      )}
      <View style={styles.entityList}>
        <View style={styles.entityRow}>
          <Text style={styles.entityHeader}>First Name</Text>
          <Text style={styles.entityHeader}>Last Name</Text>
          <Text style={styles.entityHeader}>ID</Text>
        </View>
        {entities.map(entity => (
          <View style={styles.entityRow} key={entity.id}>
            <Text style={styles.entityItem}>{entity.EmpFirstName}</Text>
            <Text style={styles.entityItem}>{entity.EmpLastName}</Text>
            <Text style={styles.entityItem}>{entity.Id}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const addEmpEntityToFirestore = async entityData => {
  try {
    const empCollection = firestore().collection('Employee');
    await empCollection.add(entityData);
    console.log('Entity added to Firestore');
  } catch (error) {
    console.error('Error adding entity to Firestore: ', error);
  }
};

const getEmpEntitiesFromFirestore = async () => {
  try {
    const empCollection = firestore().collection('Employee');
    const querySnapshot = await empCollection.get();
    const entities = [];
    querySnapshot.forEach(doc => {
      const entity = {
        id: doc.id,
        ...doc.data(),
      };
      entities.push(entity);
    });
    return entities;
  } catch (error) {
    console.error('Error fetching entities from Firestore: ', error);
  }
};

export default App;
