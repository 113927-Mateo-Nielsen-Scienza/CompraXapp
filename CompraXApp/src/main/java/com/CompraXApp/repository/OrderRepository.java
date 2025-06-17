package com.CompraXApp.repository;


import com.CompraXApp.dto.SalesReportDTO;
import com.CompraXApp.dto.UserPurchaseStatisticsDTO;
import com.CompraXApp.model.Order;
import com.CompraXApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByOrderDateDesc(User user);


    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
 
    long countByStatus(Order.OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.status = 'COMPLETED'")
    List<Order> findCompletedOrders();
    
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.status = 'COMPLETED'")
    List<Order> findCompletedOrdersByUserId(Long userId);

    // ✅ AGREGAR: Reportes de ventas por período
    @Query("SELECT new com.CompraXApp.dto.SalesReportDTO(" +
           "FUNCTION('YEAR', o.orderDate) || '-' || FUNCTION('MONTH', o.orderDate), " +
           "COUNT(o), " +
           "SUM(o.totalAmount), " +
           "MIN(o.orderDate), " +
           "MAX(o.orderDate)) " +
           "FROM Order o " +
           "WHERE o.status = 'COMPLETED' " +
           "AND o.orderDate BETWEEN :startDate AND :endDate " +
           "GROUP BY FUNCTION('YEAR', o.orderDate), FUNCTION('MONTH', o.orderDate) " +
           "ORDER BY FUNCTION('YEAR', o.orderDate) DESC, FUNCTION('MONTH', o.orderDate) DESC")
    List<SalesReportDTO> getSalesReportByMonth(@Param("startDate") LocalDateTime startDate, 
                                              @Param("endDate") LocalDateTime endDate);

    @Query("SELECT new com.CompraXApp.dto.SalesReportDTO(" +
           "FUNCTION('DATE', o.orderDate), " +
           "COUNT(o), " +
           "SUM(o.totalAmount), " +
           "MIN(o.orderDate), " +
           "MAX(o.orderDate)) " +
           "FROM Order o " +
           "WHERE o.status = 'COMPLETED' " +
           "AND o.orderDate BETWEEN :startDate AND :endDate " +
           "GROUP BY FUNCTION('DATE', o.orderDate) " +
           "ORDER BY FUNCTION('DATE', o.orderDate) DESC")
    List<SalesReportDTO> getSalesReportByDay(@Param("startDate") LocalDateTime startDate,
                                             @Param("endDate") LocalDateTime endDate);

    // ✅ AGREGAR: Estadísticas de compras por usuario
    @Query("SELECT new com.CompraXApp.dto.UserPurchaseStatisticsDTO(" +
           "u.id, u.name, u.email, COUNT(o), SUM(o.totalAmount)) " +
           "FROM Order o JOIN o.user u " +
           "WHERE o.status = 'COMPLETED' " +
           "GROUP BY u.id, u.name, u.email " +
           "ORDER BY SUM(o.totalAmount) DESC")
    List<UserPurchaseStatisticsDTO> getUserPurchaseStatistics();

    @Query("SELECT new com.CompraXApp.dto.UserPurchaseStatisticsDTO(" +
           "u.id, u.name, u.email, COUNT(o), SUM(o.totalAmount)) " +
           "FROM Order o JOIN o.user u " +
           "WHERE o.status = 'COMPLETED' " +
           "AND o.orderDate BETWEEN :startDate AND :endDate " +
           "GROUP BY u.id, u.name, u.email " +
           "ORDER BY SUM(o.totalAmount) DESC")
    List<UserPurchaseStatisticsDTO> getUserPurchaseStatisticsByPeriod(@Param("startDate") LocalDateTime startDate,
                                                                     @Param("endDate") LocalDateTime endDate);
}