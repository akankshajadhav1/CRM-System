package com.example.demo.service;

import com.example.demo.repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final SaleRepository saleRepo;

    public DashboardService(SaleRepository saleRepo) {
        this.saleRepo = saleRepo;
    }

    public Map<String, Object> getStats() {

        Map<String, Object> stats = new HashMap<>();

        stats.put("totalRevenue",
                saleRepo.getTotalRevenue() == null ? 0 : saleRepo.getTotalRevenue());

        stats.put("totalSales", saleRepo.getTotalSales());

        return stats;
    }
}
