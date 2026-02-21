package com.example.demo.repository;

import com.example.demo.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SaleRepository extends JpaRepository<Sale, Long> {

    @Query("SELECT SUM(s.amount) FROM Sale s")
    Double getTotalRevenue();

    @Query("SELECT COUNT(s) FROM Sale s")
    Long getTotalSales();
}
