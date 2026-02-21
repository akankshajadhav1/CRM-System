package com.example.demo.service;

import com.example.demo.model.Purchase;
import com.example.demo.repository.PurchaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseService {

    private final PurchaseRepository repo;

    public PurchaseService(PurchaseRepository repo) {
        this.repo = repo;
    }

    public List<Purchase> getAll() {
        return repo.findAll();
    }

    public Purchase save(Purchase purchase) {
        return repo.save(purchase);
    }
}
