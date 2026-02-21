package com.example.demo.service;

import com.example.demo.model.Sale;
import com.example.demo.repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleService {

    private final SaleRepository repo;

    public SaleService(SaleRepository repo) {
        this.repo = repo;
    }

    public List<Sale> getAll() {
        return repo.findAll();
    }

    public Sale getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Sale update(Long id, Sale sale) {
        sale.setId(id);
        return repo.save(sale);
    }

    public Sale save(Sale sale) {
        return repo.save(sale);
    }
}
