package com.in28minutes.rest.webservices.restfulwebservices.hospital;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

import org.dcm4che3.data.Attributes;
import org.dcm4che3.io.DicomInputStream;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.in28minutes.rest.webservices.restfulwebservices.hospital.repository.HospitalRepository;
import com.pixelmed.dicom.AttributeList;

@RestController
public class HospitalJpaResource { 

	private HospitalService hospitalService;
	private HospitalRepository hospitalRepository;
	private static AttributeList list = new AttributeList();
	
	public HospitalJpaResource(HospitalService hospitalService,HospitalRepository hospitalRepository) {
		this.hospitalService = hospitalService;
		this.hospitalRepository = hospitalRepository;
	}
	
	@GetMapping("/users/{username}/hospitals")
	public List<Hospital> retriveHospitals(@PathVariable String username) {
		return hospitalRepository.findByUsername(username); // searching our DB for list of hospitals with help of username
	}
	
	@GetMapping("/users/{username}/hospitals/{id}")
	public Hospital retriveHospital(@PathVariable String username,@PathVariable int id) {
		return hospitalRepository.findById(id).get(); // we are putting get because it returns the optional
	}
	
	@DeleteMapping("/users/{username}/hospitals/{id}")
	public ResponseEntity<Void> deleteHospital(@PathVariable String username,@PathVariable int id) {
		hospitalRepository.deleteById(id);
		return ResponseEntity.noContent().build();
		 
	}
	
	@PutMapping("/users/{username}/hospitals/{id}")
	public Hospital	 updateHospital(@PathVariable String username,@PathVariable int id,@RequestBody Hospital hospital) {
		hospitalRepository.save(hospital); // here save checks if the id is null it will create new hospitals but if it exists it will update
		 return hospital;
		 
	}
	
	@PostMapping("/users/{username}/hospitals")
	public Hospital createHospital(@PathVariable String username, @RequestBody Hospital hospital) {
		hospital.setUsername(username);
		hospital.setId(null); // setting id as null so our repo knows that it is to be added not updated
		return hospitalRepository.save(hospital);	
		
	}
	
	
	@PostMapping("/uploadFile")
    public ExtractedInfo uploadFile(@RequestParam("dicomFile") MultipartFile dicomFile, @RequestParam("hospitalId") Integer hospitalId) {
		ExtractedInfo extractedInfo = new ExtractedInfo();
		
		 try {
	            DicomInputStream dis = new DicomInputStream(dicomFile.getInputStream());
	            //System.out.println(dis.getFileMetaInformation());
	            //System.out.println("Patient"+dis.getFileMetaInformation().getString(org.dcm4che3.data.Tag.PatientName));
	           
	            //dis.readDataset();
	            //Attributes attrs = dis.readDataset(-1, -1); //-1 means all
	            Attributes attrs = dis.readDataset(); 
	            // Process the extracted attributes as needed
	            // For example:
	            extractedInfo.setPatientName(attrs.getString(org.dcm4che3.data.Tag.PatientName));
	            System.out.println(attrs.getString(org.dcm4che3.data.Tag.PatientName));
	            extractedInfo.setPatientId(attrs.getString(org.dcm4che3.data.Tag.PatientID));
	            extractedInfo.setAge(attrs.getString(org.dcm4che3.data.Tag.PatientAge));
	            extractedInfo.setSex(attrs.getString(org.dcm4che3.data.Tag.PatientSex));
	            extractedInfo.setUploadDate(attrs.getString(org.dcm4che3.data.Tag.StudyDate));
	            dis.close();
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	        return extractedInfo;
    }
	
	//Testing
	@GetMapping("/req/{userId}")
	 public ResponseEntity<InputStreamResource> getFile(@PathVariable Integer userId) throws FileNotFoundException {
       // Retrieve file path/URL from the database based on user ID and file ID
		System.out.println("UserId"+userId);
       String filePath = "C:/Users/shree/OneDrive/Desktop/good/000006.dcm";
       System.out.println(filePath);
       
       File file = new File(filePath);
       InputStream inputStream = new FileInputStream(file);
       InputStreamResource resource = new InputStreamResource(inputStream);

       HttpHeaders headers = new HttpHeaders();
       headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getName());
       headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

       return ResponseEntity.ok()
               .headers(headers)
               .contentLength(file.length())
               .body(resource);
       
  }
	
}
