package com.example.demo.controller;

import com.example.demo.model.Purchase;
import com.example.demo.service.PurchaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService service;

    public PurchaseController(PurchaseService service) {
        this.service = service;
    }

    @GetMapping
    public List<Purchase> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Purchase create(@RequestBody Purchase purchase) {
        return service.save(purchase);
    }
}
