import { useAuth } from "./security/AuthContext"
import { useParams} from 'react-router-dom'
import React, { useEffect, useState } from "react";
import cornerstone from "cornerstone-core";
import cornerstoneMath from "cornerstone-math";
import cornerstoneTools from "cornerstone-tools";
import Hammer from "hammerjs";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

function Test(){
   
  const {id} = useParams() // which id to edit
  const ids = parseInt(id)
    
  const authContext = useAuth()
  const selectedFileArray = authContext.selectedFile
  let selectedFile = null;

  //To search for specifc object using param id in our selectedFileArray so we can display that image
  for (const obj of selectedFileArray) {
    if (obj.hospitalId === ids) {
      selectedFile = obj;
      break; // Stop the loop once the object is found
    }
  }

  const metaData= selectedFile.incomingData; // extracting metadata

  //Dicom Details
  const patientName = metaData.patientName;
  const patientId = metaData.patientId;
  const age = metaData.age;
  const sex = metaData.sex;
  const uploadDate = metaData.uploadDate
  //To Format the date into more humanreadable form
  const formattedUploadDate = new Date(`${uploadDate.substr(0, 4)}-${uploadDate.substr(4, 2)}-${uploadDate.substr(6, 2)}`);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = formattedUploadDate.toLocaleDateString('en-US', options);
  
  selectedFile=selectedFile['file']

  // const [uploadedFiles, setUploadedFiles] = useState([]);
  const [imageIds, setImageIds] = useState([]);
  //let element;

  useEffect(() => {
    if (selectedFile) {
        displayDicom();
    }
  },[selectedFile]);

  const  displayDicom = () => { //logic for displaying dicom files(image + data)
    // `cornerstoneWADOImageLoader` is a library for loading DICOM images from URLs.
    // `selectedFile` represents the selected DICOM file that you want to display.
    // The `cornerstoneWADOImageLoader.wadouri.fileManager.add(selectedFile)` function
    // adds the selected DICOM file to the file manager and returns an image ID.
    const imageIds = cornerstoneWADOImageLoader.wadouri.fileManager.add(selectedFile);
  

    // `setImageIds` is a function that sets the image IDs to be displayed.
    // In this case, it's setting the image IDs returned from the file manager.  
    setImageIds(imageIds);

    // Once the image is loaded, `cornerstone.displayImage` is used to display the image
    // in the specified HTML element (element with the ID "dicomImage").
    cornerstone.loadImage(imageIds).then((image) => {
    cornerstone.displayImage(element, image);
    });
    let element = document.getElementById("dicomImage");

    // `cornerstone.enable` is used to enable the specified element for interaction with the
    // Cornerstone library. This is necessary for the user to interact with the displayed image.
    cornerstone.enable(element);
  }


  return (
    <div className="container mt-5">
      <div className="row">

        <div className="col-md-6"> {/*Using grid system(6-6)*/}
          {/* <input type="file" onChange={handleFileChange} multiple /> */}
          <div id="dicomImage" style={{ backgroundColor: "blue", height: "400px" }} />
        </div>

        <div className="col-md-6">
          <div className="card p-4">
            <h3>Metadata</h3>
            <table className="table table-striped"> {/* Bootstrap classes for styling the table  */}
              <tbody>
                <tr>
                  <td><h5>Patient Name</h5></td>
                  <td>{patientName}</td>
                </tr>
                <tr>
                  <td><h5>Patient ID</h5></td>
                  <td>{patientId}</td>
                </tr>
                <tr>
                  <td><h5>Age</h5></td>
                  <td>{age}</td>
                </tr>
                <tr>
                  <td><h5>Patient Gender</h5></td>
                  <td>{sex}</td>
                </tr>
                <tr>
                  <td><h5>Date of Upload</h5></td>
                  <td>{formattedDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Test;