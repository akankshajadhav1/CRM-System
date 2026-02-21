package com.example.demo.controller;

import com.example.demo.service.ReportService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService service;

    public ReportController(ReportService service) {
        this.service = service;
    }

    @GetMapping("/profit")
    public Map<String, Object> profitReport() {
        return service.getBusinessReport();
    }
}
