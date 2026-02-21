package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService service;
    private final UserRepository userRepository;

    public AuthController(UserService service, UserRepository userRepository) {
        this.service = service;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User request) {
        User user = service.login(request.getEmail(), request.getPassword());
        if (user == null) {
            return "Invalid credentials";
        }
        return JwtUtil.generateToken(user.getEmail());
    }

    @GetMapping("/users/me")
    public User getMe(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = JwtUtil.extractEmail(token);
        return userRepository.findByEmail(email).orElse(null);
    }
}
