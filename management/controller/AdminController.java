package com.student.management.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    // ONE ADMIN USERNAME AND PASSWORD
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";

    // Store valid login tokens
    private static final Map<String, String> activeTokens =
            new ConcurrentHashMap<>();

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody LoginRequest request) {

        if (ADMIN_USERNAME.equals(request.username)
                && ADMIN_PASSWORD.equals(request.password)) {

            String token = UUID.randomUUID().toString();

            activeTokens.put(token, ADMIN_USERNAME);

            return Map.of(
                    "success", true,
                    "message", "Login successful",
                    "token", token
            );
        }

        return Map.of(
                "success", false,
                "message", "Invalid username or password"
        );
    }

    public static boolean isValidToken(String token) {

        return token != null && activeTokens.containsKey(token);
    }

    public static class LoginRequest {

        public String username;
        public String password;
    }
}