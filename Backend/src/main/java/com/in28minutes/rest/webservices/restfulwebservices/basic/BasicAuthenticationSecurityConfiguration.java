package com.in28minutes.rest.webservices.restfulwebservices.basic;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

//@Configuration
public class BasicAuthenticationSecurityConfiguration {
	
	//Filter Chain config
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		
		return http
		.authorizeHttpRequests(
				auth -> 
					auth
					.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() //allowing options request on any url
					.anyRequest().authenticated())
		.httpBasic(Customizer.withDefaults()) // to enable basic auth
		
		.sessionManagement(
				session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // to make stateless rest api
		
		.csrf(csrf -> csrf.disable()) // to disable csrf
		
		.build();// building after applying the custom config
		
	}
}
