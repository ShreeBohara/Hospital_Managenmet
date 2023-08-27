import { useEffect, useState } from "react";
import { retrieveAllHospitalsForUsernameApi, deleteHospitalApi,uploadFile } from "./api/HospitalsApiService";
import { useAuth } from "./security/AuthContext";
import { useNavigate } from "react-router-dom";

//Prime react for table features
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {FilterMatchMode} from "primereact/api"
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import 'primereact/resources/themes/saga-blue/theme.css'; // Replace with your chosen theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
//dexie
import Dexie from 'dexie';
//CSS
import '../../App.css'

const db = new Dexie('MyDatabase'); // creating MyDatabase in chrome
db.version(1).stores({
  files: 'id, data', // files as table having id and data as columns
});


export default function ListTodosComponent(){

    const authContext = useAuth();
    const username = authContext.username
    const navigate = useNavigate();
    const [hospitals, setHospitals] = useState([])
    const [message, setMessage] = useState(null)
    const selectedFile = authContext.selectedFile;
    const setSelectedFile = authContext.setSelectedFile;
    var status = null;
   
    //Filter prime react
    const [filters, setFilters] = useState({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    })

    useEffect(
        () => refreshHospitalList(), [] // empty list indicates it will render only once the page is refereshed
    ) //The useEffect Hook allows you to perform side effects in your components.
                //Some examples of side effects are: fetching data, directly updating the DOM, and timers.


     // Function to load selected file from the chrome database
    async function loadSelectedFile() {
        const files = await db.files.toArray();
        const transformedFiles = files.map(file => ({
            ...file.data,
            id: file.data.hospitalId // Duplicate the id property at the top level
          }));
        await setSelectedFile(transformedFiles);

    }
            
    function refreshHospitalList(){ // retriving info from backend using username
        loadSelectedFile()// retriving info from chrome database
        retrieveAllHospitalsForUsernameApi(username)
        .then(response => {
            setHospitals(response.data) // storing the response(all hospital info) into hospitals 
        })
        .catch(error => console.log("Error in refresh hospital list: ",error))
    }
        
    function deleteHospital(rowData){ // to delete a specific Hospital using  hospitalid

        deleteHospitalApi(username,rowData.id)
        .then(
            () => {
                setMessage(`Delete of Hospital ${rowData.id} successful`) //Diaplay message
                refreshHospitalList() //Update hospital list
            }
        )
        .catch(error => console.log("Error in deleteHospital:",error))
    }

    function updateHospital(id){ // to update the info about hospital using hospital id
        navigate(`/hospital/${id}`) // using id as params so TodoComponent will know if the existing hospita is to be updated or added new one
    }

    function addNewHospital(){
        navigate(`/hospital/-1`); // here id as -1 so Todo component will know its to add
    }

    //function to navigate to /test to display the particular dicom file
    function viewDicom(id){
        navigate(`/test/${id}`)
    }

    //function te delete dicom file
    async function deleteDicom(id){
        await db.files.delete(id); // deleteing from chrome database
        await loadSelectedFile(); // Refresh the selectedFile state
    }

    // To delte specific hospital row
    const deleteTemplate = (rowData) => {
        return (
          <Button icon="pi pi-trash" onClick={() => deleteHospital(rowData)} size="medium" rounded text severity="danger" />
        );
    };

    const updateTemplate = (rowData) => {
        return (
            <Button icon="pi pi-file-edit" onClick={() => updateHospital(rowData.id)} size="medium" rounded text  severity="help"/>
        );
    };

    //to check the status of Dicom file if the file for specific hospital is there in our chrome DB
    const statusTemplate = (rowData)=>{

        const indexToUpdate = selectedFile.findIndex(item => item.hospitalId === rowData.id);
        var fileName = null;
        var slicedFilename = null;
        if (indexToUpdate !== -1) { // if the file is present at that particular hospitalId
            status=true; //used to enable or disable the button
            fileName = selectedFile[indexToUpdate].file.name // extracting thr fileName from our present file
            slicedFilename = fileName.slice(0,10)
        } else {  
            status=false
        }
        return(
            <div>

                <div className="allButtons">
                    <Button icon="pi pi-eye" severity="warning" outlined  rounded text size="medium" disabled={!status} onClick={() => viewDicom(rowData.id)}/>
                    <Button icon="pi pi-trash" severity="danger"  outlined  rounded  text size="medium" disabled={!status} onClick={()=>deleteDicom(rowData.id)}/>
                </div>

                {status 
                    ? <p className="fileName"><span className="text-muted">{slicedFilename}</span>...</p> 
                    : ''}

            </div>
        ) 
    }

    // to send file to backend to get the metadata
    const fileUploadTemplate = (rowData) => {
        const handleFileChange = async (event) => {
            //send it to backend to get the metadata
            console.log("Event:",event);
            const formData = new FormData();
            formData.append('dicomFile', event.target.files[0]);
            formData.append('hospitalId', rowData.id);//wer have to remove hospitlID
            var incomingMetaData = null;
            await uploadFile(formData) // sending file to spring to extract metadata using dcm4chee
            .then((response) => {
                incomingMetaData = response.data
            }).catch(err => console.log("Error while Receving metadata",err))

            const temp = {hospitalId:rowData.id, file:event.target.files[0],incomingData:incomingMetaData};
            const indexToUpdate = selectedFile.findIndex(item => item.hospitalId === temp.hospitalId);
            if (indexToUpdate !== -1) { // if any file is already present in that particular hospitalId
                const fileEntry = { data: temp};
                await db.files.update(temp.hospitalId, fileEntry); //updating only the file in our dexie(indexedDB) for that hospitalId
                await loadSelectedFile(); // Refresh the selectedFile state
            } else {
                const fileEntry = { data: temp,id: rowData.id};
                await db.files.add(fileEntry);
                await loadSelectedFile();
            }
        };
        
        return (
            <input type="file" onChange={handleFileChange} accept=".dcm" />
        );
    };

    return(
        //Prime react table:
        <div className="container">
            <p>{message}</p>
            <InputText 
                onInput={(e) =>
                    setFilters({
                        global: {value:e.target.value, matchMode:FilterMatchMode.CONTAINS},
                    })
                }
            />

            <DataTable className="custom-datatable" value={hospitals} sortMode="multiple" filters={filters} paginator rows={5} rowsPerPageOptions={[1,2,3,4,5,6]} >
                <Column field="id" header="ID" sortable/>

                <Column field="hospitalName" header="Hospital Name" sortable/>
                <Column field="hospitalAddress" header="Hospital Address" sortable/>

                <Column field="firstName" header="Name" sortable />
                <Column field="firstEmail" header="Email" sortable/>
                <Column field="firstNumber" header="Number" sortable/>

                <Column field="secondName" header="Name(2)" sortable/>
                <Column field="secondEmail" header="Email(2)" sortable/>
                <Column field="secondNumber" header="Number(2)" sortable/>
                <Column body={deleteTemplate} header="Delete" style={{ width: '6rem', textAlign: 'center' }} />
                <Column body={updateTemplate} header="Update" style={{ width: '6rem', textAlign: 'center' }} />
                
                <Column body={fileUploadTemplate} header="Upload File" style={{ textAlign: 'center' }} ><Button /></Column>
                <Column body={statusTemplate} header="Status" style={{ width: '10rem', textAlign: 'center' }} className="status"/>
    
            </DataTable>

            <div className="">
                     <button className="btn btn-success m-5" onClick={addNewHospital}>Add new Hospital</button>
            </div>
             
        </div>
     )
}

