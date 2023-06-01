import axios from 'axios';
import queryString from 'query-string';
import { PerformanceDataInterface } from 'interfaces/performance-data';
import { GetQueryInterface } from '../../interfaces';

export const getPerformanceData = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/performance-data${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPerformanceData = async (performanceData: PerformanceDataInterface) => {
  const response = await axios.post('/api/performance-data', performanceData);
  return response.data;
};

export const updatePerformanceDataById = async (id: string, performanceData: PerformanceDataInterface) => {
  const response = await axios.put(`/api/performance-data/${id}`, performanceData);
  return response.data;
};

export const getPerformanceDataById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/performance-data/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePerformanceDataById = async (id: string) => {
  const response = await axios.delete(`/api/performance-data/${id}`);
  return response.data;
};
