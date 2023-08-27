
import { apiClient } from './ApiClient';

export const retrieveAllHospitalsForUsernameApi = 
    (username) => apiClient.get(`/users/${username}/hospitals`);

export const retrieveHospitalApi = 
    (username,id) => apiClient.get(`/users/${username}/hospitals/${id}`);

export const deleteHospitalApi = 
    (username,id) => apiClient.delete(`/users/${username}/hospitals/${id}`);

export const updateHospitalApi = 
    (username,id,todo) => apiClient.put(`/users/${username}/hospitals/${id}`,todo); //adding todo as body to update our todo

export const createHospitalApi = 
    (username,todo) => apiClient.post(`/users/${username}/hospitals`,todo);

export const uploadFile =  
(formData) => apiClient.post('/uploadFile', formData);


//Testing
                    
export const  retriveFile = (hospitalId) => apiClient.get(`/req/${hospitalId}`,{responseType:'blob'})

//export const  fetchDicomData = (hospitalId) => apiClient.get(`/req/${hospitalId}`)