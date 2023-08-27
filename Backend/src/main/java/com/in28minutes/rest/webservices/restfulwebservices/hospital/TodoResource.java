package com.in28minutes.rest.webservices.restfulwebservices.hospital;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

//@RestController 
public class TodoResource { 

	private HospitalService todoService;
	
	
	public TodoResource(HospitalService todoService) {
		this.todoService = todoService;
	}
	
	@GetMapping("/users/{username}/todos")
	public List<Hospital> retrieveTodos(@PathVariable String username) {
		return todoService.findByUsername(username);
	}
	@GetMapping("/users/{username}/todos/{id}")
	public Hospital retrieveTodo(@PathVariable String username,@PathVariable int id) {
		return todoService.findById(id);
	}
	@DeleteMapping("/users/{username}/todos/{id}")
	public ResponseEntity<Void>  deleteTodo(@PathVariable String username,@PathVariable int id) {
		 todoService.deleteById(id);
		 return ResponseEntity.noContent().build();
		 
	}
	@PutMapping("/users/{username}/todos/{id}")
	public Hospital	 updateTodo(@PathVariable String username,@PathVariable int id,@RequestBody Hospital todo) {
		 todoService.updateHospital(todo);
		 return todo;
		 
	}
	
	@PostMapping("/users/{username}/todos")
	public Hospital createTodo(@PathVariable String username, @RequestBody Hospital todo) {
		Hospital createdTodo = todoService.addHospital(username, todo.getHospitalName(), todo.getHospitalAddress(), todo.getFirstName(),todo.getFirstEmail(), todo.getFirstNumber(), todo.getSecondName(),todo.getSecondEmail(), todo.getSecondNumber());
		return createdTodo;
	}
}
