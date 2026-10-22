package com.telecom.controller;

import com.telecom.model.ERole;
import com.telecom.model.User;
import com.telecom.model.Subscriber;
import com.telecom.payload.request.LoginRequest;
import com.telecom.payload.request.SignupRequest;
import com.telecom.payload.response.JwtResponse;
import com.telecom.payload.response.MessageResponse;
import com.telecom.repository.UserRepository;
import com.telecom.repository.SubscriberRepository;
import com.telecom.security.JwtUtils;
import com.telecom.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final SubscriberRepository subscriberRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          SubscriberRepository subscriberRepository, PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.subscriberRepository = subscriberRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Hello AeroNet!");
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body(new MessageResponse("Invalid username or password. Default demo password is 'password'."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponse("Authentication error: " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<ERole> roles = new HashSet<>();

        boolean isCustomer = false;
        if (strRoles == null) {
            roles.add(ERole.ROLE_CUSTOMER);
            isCustomer = true;
        } else {
            for (String role : strRoles) {
                switch (role.toLowerCase()) {
                    case "admin":
                        roles.add(ERole.ROLE_ADMIN);
                        break;
                    case "support":
                        roles.add(ERole.ROLE_SUPPORT);
                        break;
                    default:
                        roles.add(ERole.ROLE_CUSTOMER);
                        isCustomer = true;
                }
            }
        }

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        // Auto-create Subscriber profile if registered user is a Customer
        if (isCustomer) {
            Random rand = new Random();
            String randomPhone = "+1 555-" + String.format("%04d", rand.nextInt(10000));
            Subscriber subscriber = new Subscriber(
                    savedUser,
                    savedUser.getUsername(),
                    "",
                    randomPhone,
                    "ACTIVE",
                    "PREPAID",
                    0.0,
                    25.00 // Seed with $25 welcome balance
            );
            subscriberRepository.save(subscriber);
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e) {
        e.printStackTrace(); // Print stack trace to Eclipse console
        return ResponseEntity.status(500).body(new MessageResponse("Backend Exception: " + e.getMessage()));
    }
}
