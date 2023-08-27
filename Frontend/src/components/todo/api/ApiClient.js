import axios from 'axios'

export const apiClient = axios.create(  //congif the axios behaviour
    {
        baseURL:'http://localhost:8080' // so we dont have to write localhost 8080 again
    }

)
