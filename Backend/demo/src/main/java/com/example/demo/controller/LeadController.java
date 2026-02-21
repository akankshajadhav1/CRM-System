package com.example.demo.controller;

import com.example.demo.model.Lead;
import com.example.demo.service.LeadService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "*")
public class LeadController {

    private final LeadService service;

    public LeadController(LeadService service) {
        this.service = service;
    }

    @GetMapping
    public List<Lead> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Lead getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Lead create(@RequestBody Lead lead) {
        return service.save(lead);
    }

    @PutMapping("/{id}")
    public Lead update(@PathVariable Long id, @RequestBody Lead lead) {
        lead.setId(id);
        return service.save(lead);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
