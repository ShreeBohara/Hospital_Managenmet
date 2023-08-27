package com.in28minutes.rest.webservices.restfulwebservices.hospital;

public class ExtractedInfo {

	 private String patientName;
	 private String patientId;
	 private String age;
	 private String sex;
	 private String uploadDate;

	  // Constructors, getters, and setters

	 public ExtractedInfo() {
	 }

	public ExtractedInfo(String patientName, String patientId, String age, String sex, String uploadDate) {
		super();
		this.patientName = patientName;
		this.patientId = patientId;
		this.age = age;
		this.sex = sex;
		this.uploadDate = uploadDate;
	}

	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	public String getAge() {
		return age;
	}

	public void setAge(String age) {
		this.age = age;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getUploadDate() {
		return uploadDate;
	}

	public void setUploadDate(String uploadDate) {
		this.uploadDate = uploadDate;
	}
		
	 
}
