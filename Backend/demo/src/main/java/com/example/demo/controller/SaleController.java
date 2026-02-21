package com.example.demo.controller;

import com.example.demo.model.Sale;
import com.example.demo.service.SaleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SaleController {

    private final SaleService service;

    public SaleController(SaleService service) {
        this.service = service;
    }

    @GetMapping
    public List<Sale> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Sale getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Sale create(@RequestBody Sale sale) {
        return service.save(sale);
    }

    @PutMapping("/{id}")
    public Sale update(@PathVariable Long id, @RequestBody Sale sale) {
        sale.setId(id);
        return service.save(sale);
    }
}
