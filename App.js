/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {Button, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';

function App() {
  const [entities, setEntities] = useState([]);

  // Function to add a new entity
  const addEntity = () => {
    const entityData = {
      EmpFirstName: 'Henry',
      EmpLastName: 'Ford',
      Id: 2,
    };
    addEmpEntityToFirestore(entityData);
  };

  // Function to retrieve entities from Firestore
  const loadEntities = async () => {
    const loadedEntities = await getEmpEntitiesFromFirestore();
    setEntities(loadedEntities);
  };

  useEffect(() => {
    loadEntities();
  }, []);

  return (
    <View>
      <Button title="Add Entity" onPress={addEntity} />
      <Text>Entities:</Text>
      {entities?.map(entity => (
        <Text key={entity.id}>{entity.FirstName}</Text>
      ))}
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
