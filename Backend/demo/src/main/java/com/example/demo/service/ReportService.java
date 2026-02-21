package com.example.demo.service;

import com.example.demo.repository.PurchaseRepository;
import com.example.demo.repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ReportService {

    private final SaleRepository saleRepo;
    private final PurchaseRepository purchaseRepo;

    public ReportService(SaleRepository saleRepo,
                         PurchaseRepository purchaseRepo) {
        this.saleRepo = saleRepo;
        this.purchaseRepo = purchaseRepo;
    }

    public Map<String, Object> getBusinessReport() {

        Double sales = saleRepo.getTotalRevenue();
        Double purchases = purchaseRepo.getTotalPurchases();

        sales = sales == null ? 0 : sales;
        purchases = purchases == null ? 0 : purchases;

        Map<String, Object> report = new HashMap<>();

        report.put("totalSales", sales);
        report.put("totalPurchases", purchases);
        report.put("profit", sales - purchases);

        return report;
    }
}
