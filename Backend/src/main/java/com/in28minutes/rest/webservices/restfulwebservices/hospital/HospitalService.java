package com.in28minutes.rest.webservices.restfulwebservices.hospital;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

import org.springframework.stereotype.Service;

@Service
public class HospitalService {
	
	private static List<Hospital> hospitals = new ArrayList<>();
	
	private static int todosCount = 0;
	

	public List<Hospital> findByUsername(String username){
		Predicate<? super Hospital> predicate = 
				hospital -> hospital.getUsername().equalsIgnoreCase(username);
		return hospitals.stream().filter(predicate).toList(); // here we are streaming the hospital list and then calling Predicate to check if that todo username is equal to the username which is given to us
	}
	
	public Hospital addHospital(String username, String hospitalName, String hospitalAddress, String firstName,
			String firstEmail, String firstNumber, String secondName, String secondEmail, String secondNumber) {
		Hospital hospital = new Hospital(++todosCount,username,hospitalName,hospitalAddress,firstName,firstEmail,firstNumber,secondName,secondEmail,secondNumber);
		hospitals.add(hospital);
		return hospital;
	}
	
	public void deleteById(int id) { //predicate is a functional interface in java that represents a condition that can be evaluated to 'true' or 'false'
		Predicate<? super Hospital> predicate = hospital -> hospital.getId() == id;
		hospitals.removeIf(predicate);
	}

	public Hospital findById(int id) {
		Predicate<? super Hospital> predicate = hospital -> hospital.getId() == id;
		Hospital hospital = hospitals.stream().filter(predicate).findFirst().get();
		return hospital;
	}

	public void updateHospital(Hospital hospital) { // to update the hospital 
		deleteById(hospital.getId());
		hospitals.add(hospital);
	}
}