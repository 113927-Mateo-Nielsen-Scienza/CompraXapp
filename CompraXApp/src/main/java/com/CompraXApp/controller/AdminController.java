package com.CompraXApp.controller;

import com.CompraXApp.dto.ProductSalesDTO;
import com.CompraXApp.service.ReportingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ReportingService reportingService;

   
    @GetMapping("/product-sales")
    public ResponseEntity<List<ProductSalesDTO>> getProductSalesStatistics() {
        List<ProductSalesDTO> stats = reportingService.getProductSalesStatistics();
        return ResponseEntity.ok(stats);
    }

  
}
