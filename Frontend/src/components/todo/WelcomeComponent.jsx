import {Link} from 'react-router-dom'
import { useAuth } from './security/AuthContext';

import { retriveFile } from './api/HospitalsApiService';



export default function WelcomeComponent(){
  const authContext = useAuth()
  const username = authContext.username



  //Testing for retriving file from backend
  const fetchDicomData = () => {
      retriveFile(1).then((response) => {
        console.log(response);
        const imageUrl = URL.createObjectURL(response);
        console.log("Image url", imageUrl);
        //const dicomArrayBuffer = response.data;
        //const dicomBlob = new Blob([dicomArrayBuffer], { type: "application/dicom" });
        //const dicomByteArray = new Uint8Array(dicomArrayBuffer);

        //const imageId = cornerstoneWADOImageLoader.wadouri.dataSetToBlob(dicomBlob);

        //setImageIds([imageId]);
        //displayDicom();
      }).catch((error) => {
        console.error("Error fetching DICOM data:", error);
      });
      // axios.get(`/api/getDicomFile?id=${ids}`, { responseType: "arraybuffer" })
      //   .then((response) => {
      //     const dicomArrayBuffer = response.data;
      //     const dicomByteArray = new Uint8Array(dicomArrayBuffer);
  
      //     const imageId = cornerstoneWADOImageLoader.wadouri.createEprUrl(
      //       dicomByteArray,
      //       "dicom.dcm"
      //     );
  
      //     setImageIds([imageId]);
      //     displayDicom();
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching DICOM data:", error);
      //   });
    };






  return(
    <div className="WelcomeComponent">
      <h1>Welcome {username}</h1>
      <div>
        Manage Your Hospitals: 
        <Link to='/hospitalList'> Hospitals Details</Link> {/* By useing link we only render specific component not the whole page */}
      </div>
      {/* Testing for retriving file from backend */}
      <div>
                <button className='btn btn-success m-5' onClick={fetchDicomData}>world rest api</button>
                
      </div>



      <div>
        <h2>try uploading DICOM img</h2>
        <input type="file" onChange={fetchDicomData} multiple />
        <div
          id="dicomImage"
          style={{ backgroundColor: "blue", height: "200px" }}
        />
  
      </div>
    </div>
  )
}
