package com.in28minutes.rest.webservices.restfulwebservices.jwt;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.UUID;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class JwtSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, HandlerMappingIntrospector introspector) throws Exception {
       
        return httpSecurity
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/authenticate").permitAll() // Requests to the /authenticate endpoint are allowed without authentication.
                    //.requestMatchers(PathRequest.toH2Console()).permitAll() // h2-console is a servlet and NOT recommended for a production
                    .requestMatchers(HttpMethod.OPTIONS,"/**") //OPTIONS requests (typically used for preflight requests in CORS) to any URL are permitted for all users.
                    .permitAll()
                    .anyRequest()
                    .authenticated()) //any other req must be authenticated
                .csrf(AbstractHttpConfigurer::disable) // we have disabled this because we have enabled jwt auth, so we dont need CSRF
                .sessionManagement(session -> session.
                    sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer((oauth2) -> oauth2.jwt(Customizer.withDefaults())) //configuring a Spring Security resource server to authenticate incoming requests using JSON Web Tokens (JWT)
//                .oauth2ResourceServer(
//                        OAuth2ResourceServerConfigurer::jwt)
//                .httpBasic(
//                        Customizer.withDefaults())
                .headers(headers -> headers
        				.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin //the browser will only allow the page to be displayed in a frame or iframe if the content is from the same origin (i.e., the same domain).
        				))// to prevent clickjacking
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            UserDetailsService userDetailsService) {
        var authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.withUsername("shree")
                               	.password("{noop}Shree@123")
                               	.authorities("read")
                               	.roles("USER")
                               	.build();

        return new InMemoryUserDetailsManager(user);
    }

    //The purpose of the JWKSource interface is to decouple the process of selecting a JWK from the rest of your code
    @Bean
    public JWKSource<SecurityContext> jwkSource() { // JWkSource interface provides a way to abstract the retrieval and selection of JWKs for tasks like token valitatoion, token signing and encryption
        JWKSet jwkSet = new JWKSet(rsaKey()); //A JWKSet is a collection of JSON Web Keys. It is being instantiated here using the rsaKey() method, which you've described earlier. This suggests that rsaKey() returns an RSAKey object that represents an RSA key pair. The JWKSet will include the RSA public and private keys from the RSAKey object.
        return (((jwkSelector, securityContext) //: A JWKSelector instance that helps you select a specific JWK from a set of JWKs based on certain criteria.
                        -> jwkSelector.select(jwkSet))); //here since there is only ony key, we dont tailor it. jwkSelector would be tailored to your specific validation requirements and would be used to select the appropriate JWK from the jwkSet based on factors like key type, key ID, and security context.
    }// if there were two keys then we would have to config the jwkSelector based on our requriments

    @Bean
    JwtEncoder jwtEncoder(JWKSource<SecurityContext> jwkSource) { // this is used for encodeing the deatails and generate the jwt as a response,passing JWKsource as parameter which is the source of JWKs used for signing JWTs
        return new NimbusJwtEncoder(jwkSource);
    }

    @Bean
    JwtDecoder jwtDecoder() throws JOSEException {
        return NimbusJwtDecoder
                .withPublicKey(rsaKey().toRSAPublicKey())
                .build();
    }
    
    @Bean
    public RSAKey rsaKey() { // returns RSAKey object
        
        KeyPair keyPair = keyPair(); // will call keyPair() and recives generated key pair consists of a public key and a private key.
        System.out.println("private"+keyPair.getPrivate());
        System.out.println("public"+keyPair.getPublic());
        return new RSAKey
                .Builder((RSAPublicKey) keyPair.getPublic()) //The cast (RSAPublicKey) is used to explicitly indicate that the object returned from getPublic() is an RSAPublicKey.
                .privateKey((RSAPrivateKey) keyPair.getPrivate()) //similar
                .keyID(UUID.randomUUID().toString()) //This identifier can be used to uniquely identify the key.
                .build();
    }

    //This bean can be used throughout the application as needed, and the Spring container will manage its lifecycle and instantiation.
    @Bean
    public KeyPair keyPair() { //returns a KeyPair object(public and private key)
        try {
            var keyPairGenerator = KeyPairGenerator.getInstance("RSA"); // creating rsa algo key-pair,keyPairGenerator now holds an instance of the KeyPairGenerator class that is configured to generate RSA key pairs
            keyPairGenerator.initialize(2048);// initializes the KeyPairGenerator with a key size of 2048 bits. 
            return keyPairGenerator.generateKeyPair(); //his method will create a pair of related keys: a public key and a private key.
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Unable to generate an RSA Key Pair", e);
        }
    }
    
}


//Public key- used for encription and verification, can be shared openly and can be used by anyone who wants to send encrypted msg to the owner of key pair
//The public key is used to encrypt data, and encrypted data can only be decrypted using the corresponding private key. It's also used for verifying digital signatures generated with the private key.


