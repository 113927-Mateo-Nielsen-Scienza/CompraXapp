package com.CompraXApp.service;

import com.CompraXApp.dto.ProductSalesDTO;
import com.CompraXApp.dto.SalesReportDTO;
import com.CompraXApp.dto.UserPurchaseStatisticsDTO;
import com.CompraXApp.repository.OrderItemRepository;
import com.CompraXApp.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportingService {

    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private OrderRepository orderRepository; // ✅ AGREGAR

    // ✅ Método existente
    public List<ProductSalesDTO> getProductSalesStatistics() {
        return orderItemRepository.getProductSalesStatistics();
    }

    // ✅ AGREGAR: Reportes de ventas por período
    public List<SalesReportDTO> getSalesReportByMonth(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.getSalesReportByMonth(startDate, endDate);
    }

    public List<SalesReportDTO> getSalesReportByDay(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.getSalesReportByDay(startDate, endDate);
    }

    // ✅ AGREGAR: Estadísticas de compras por usuario
    public List<UserPurchaseStatisticsDTO> getUserPurchaseStatistics() {
        return orderRepository.getUserPurchaseStatistics();
    }

    public List<UserPurchaseStatisticsDTO> getUserPurchaseStatisticsByPeriod(LocalDateTime startDate, 
                                                                            LocalDateTime endDate) {
        return orderRepository.getUserPurchaseStatisticsByPeriod(startDate, endDate);
    }

    public List<SalesReportDTO> getSalesReportForLastMonths(int months) {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusMonths(months);
        return getSalesReportByMonth(startDate, endDate);
    }

    public List<SalesReportDTO> getSalesReportForLastDays(int days) {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(days);
        return getSalesReportByDay(startDate, endDate);
    }
}
