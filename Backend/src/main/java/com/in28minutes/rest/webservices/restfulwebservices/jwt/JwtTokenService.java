package com.in28minutes.rest.webservices.restfulwebservices.jwt;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {
    
    private final JwtEncoder jwtEncoder;

    public JwtTokenService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String generateToken(Authentication authentication) { // if the user has 2 authorities - ADMIN and USER this function will return ADMIN USER

        var scope = authentication 
                        .getAuthorities()
                        .stream() // streaming through every autho every user has
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.joining(" ")); // collecting all authorities and addding space between them

        var claims = JwtClaimsSet.builder()
                        .issuer("self")
                        .issuedAt(Instant.now())
                        .expiresAt(Instant.now().plus(90, ChronoUnit.MINUTES)) //time at which jwt token will expire
                        .subject(authentication.getName())
                        .claim("scope", scope) // what authorites this user has
                        .build();

        return this.jwtEncoder
                .encode(JwtEncoderParameters.from(claims))
                .getTokenValue();
    }
}


