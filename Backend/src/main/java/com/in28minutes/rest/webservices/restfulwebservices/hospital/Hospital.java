package com.in28minutes.rest.webservices.restfulwebservices.hospital;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Hospital {

	public Hospital() {
		
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id; //Integer: This is a wrapper class for the int primitive type. It allows you to treat an int as an object and provides additional methods and functionalities. For example, it can be used in collections, null values can be assigned to it, and it provides utility methods for converting between int and String values.

	public Hospital(Integer id, String username, String hospitalName, String hospitalAddress, String firstName,
			String firstEmail, String firstNumber, String secondName, String secondEmail, String secondNumber) {
		super();
		this.id = id;
		this.username = username;
		this.hospitalName = hospitalName;
		this.hospitalAddress = hospitalAddress;
		this.firstName = firstName;
		this.firstEmail = firstEmail;
		this.firstNumber = firstNumber;
		this.secondName = secondName;
		this.secondEmail = secondEmail;
		this.secondNumber = secondNumber;
	}

	//private LocalDate targetDate;
	private String hospitalAddress;
	private String firstName;
	private String firstEmail;
	private String firstNumber;
	private String secondName;
	private String secondEmail;
	private String secondNumber;
	
	private String username;
	
	private String hospitalName;
	public String getHospitalName() {
		return hospitalName;
	}

	public void setHospitalName(String hospitalName) {
		this.hospitalName = hospitalName;
	}

	public String getHospitalAddress() {
		return hospitalAddress;
	}

	public void setHospitalAddress(String hospitalAddress) {
		this.hospitalAddress = hospitalAddress;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getFirstEmail() {
		return firstEmail;
	}

	public void setFirstEmail(String firstEmail) {
		this.firstEmail = firstEmail;
	}

	public String getFirstNumber() {
		return firstNumber;
	}

	public void setFirstNumber(String firstNumber) {
		this.firstNumber = firstNumber;
	}

	public String getSecondName() {
		return secondName;
	}

	public void setSecondName(String secondName) {
		this.secondName = secondName;
	}

	public String getSecondEmail() {
		return secondEmail;
	}

	public void setSecondEmail(String secondEmail) {
		this.secondEmail = secondEmail;
	}

	public String getSecondNumber() {
		return secondNumber;
	}

	public void setSecondNumber(String secondNumber) {
		this.secondNumber = secondNumber;
	}


	@Override
	public String toString() {
		return "Hospital [id=" + id + ", username=" + username + ", hospitalName=" + hospitalName + ", hospitalAddress="
				+ hospitalAddress + ", firstName=" + firstName + ", firstEmail=" + firstEmail + ", firstNumber="
				+ firstNumber + ", secondName=" + secondName + ", secondEmail=" + secondEmail + ", secondNumber="
				+ secondNumber + "]";
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}


	

}