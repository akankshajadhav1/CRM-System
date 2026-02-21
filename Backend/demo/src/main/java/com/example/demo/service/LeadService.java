package com.example.demo.service;

import com.example.demo.model.Lead;
import com.example.demo.repository.LeadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadService {

    private final LeadRepository repo;

    public LeadService(LeadRepository repo) {
        this.repo = repo;
    }

    public List<Lead> getAll() {
        return repo.findAll();
    }

    public Lead save(Lead lead) {
        return repo.save(lead);
    }

    public Lead getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
