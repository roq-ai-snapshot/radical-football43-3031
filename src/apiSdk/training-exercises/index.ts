import axios from 'axios';
import queryString from 'query-string';
import { TrainingExerciseInterface } from 'interfaces/training-exercise';
import { GetQueryInterface } from '../../interfaces';

export const getTrainingExercises = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/training-exercises${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTrainingExercise = async (trainingExercise: TrainingExerciseInterface) => {
  const response = await axios.post('/api/training-exercises', trainingExercise);
  return response.data;
};

export const updateTrainingExerciseById = async (id: string, trainingExercise: TrainingExerciseInterface) => {
  const response = await axios.put(`/api/training-exercises/${id}`, trainingExercise);
  return response.data;
};

export const getTrainingExerciseById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/training-exercises/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTrainingExerciseById = async (id: string) => {
  const response = await axios.delete(`/api/training-exercises/${id}`);
  return response.data;
};
