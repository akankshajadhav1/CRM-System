package com.example.demo.service;

import com.example.demo.model.Customer;
import com.example.demo.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repo;

    public CustomerService(CustomerRepository repo) {
        this.repo = repo;
    }

    public List<Customer> getAll() {
        return repo.findAll();
    }

    public Customer getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Customer save(Customer c) {
        return repo.save(c);
    }

    public Customer update(Long id, Customer c) {
        c.setId(id);
        return repo.save(c);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
