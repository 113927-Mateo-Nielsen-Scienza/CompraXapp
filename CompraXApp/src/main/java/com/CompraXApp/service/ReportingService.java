package com.CompraXApp.service;

import com.CompraXApp.dto.ProductSalesDTO;
import com.CompraXApp.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportingService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    public List<ProductSalesDTO> getProductSalesStatistics() {
        return orderItemRepository.getProductSalesStatistics();
    }
}
