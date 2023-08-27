import { apiClient } from "./ApiClient"

//since every api is protected by spring security with same credintials so we have created /basicauth to check our credintials that returns just a success(200) message


export const excuteJwtAuthentiationService = 
    (username,password) => apiClient.post('/authenticate',{username,password}) 