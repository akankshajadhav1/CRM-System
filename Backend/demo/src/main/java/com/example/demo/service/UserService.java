package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }
// register method added
    public User register(User user) {
        return repo.save(user);
    }
    // login method added
    public User login(String email, String password) {
    return repo.findByEmail(email)
            .filter(user -> user.getPassword().equals(password))
            .orElse(null);
}
// get all users method added


}
