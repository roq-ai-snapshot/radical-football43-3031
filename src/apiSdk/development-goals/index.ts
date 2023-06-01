import axios from 'axios';
import queryString from 'query-string';
import { DevelopmentGoalInterface } from 'interfaces/development-goal';
import { GetQueryInterface } from '../../interfaces';

export const getDevelopmentGoals = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/development-goals${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDevelopmentGoal = async (developmentGoal: DevelopmentGoalInterface) => {
  const response = await axios.post('/api/development-goals', developmentGoal);
  return response.data;
};

export const updateDevelopmentGoalById = async (id: string, developmentGoal: DevelopmentGoalInterface) => {
  const response = await axios.put(`/api/development-goals/${id}`, developmentGoal);
  return response.data;
};

export const getDevelopmentGoalById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/development-goals/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDevelopmentGoalById = async (id: string) => {
  const response = await axios.delete(`/api/development-goals/${id}`);
  return response.data;
};
