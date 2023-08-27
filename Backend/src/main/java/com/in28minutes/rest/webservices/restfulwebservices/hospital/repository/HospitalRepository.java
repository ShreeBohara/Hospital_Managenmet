package com.in28minutes.rest.webservices.restfulwebservices.hospital.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.in28minutes.rest.webservices.restfulwebservices.hospital.Hospital;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Integer>{

	// creating this method so we can search our DB with help of username(it is not prebuild)
	List<Hospital> findByUsername(String username);
	
}
