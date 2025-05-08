package com.CompraXApp.controller;

import com.CompraXApp.dto.OrderDTO;
import com.CompraXApp.security.UserDetailsImpl;
import com.CompraXApp.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<OrderDTO> createOrder(@AuthenticationPrincipal UserDetailsImpl currentUser,
                                                @RequestBody Map<String, String> payload) {
       
        String shippingAddress = payload.get("shippingAddress");
        if (shippingAddress == null || shippingAddress.trim().isEmpty()){
        
            return ResponseEntity.badRequest().build(); 
        }
        OrderDTO createdOrder = orderService.createOrderFromCart(currentUser.getId(), shippingAddress);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

 
    @GetMapping("/my-orders")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<OrderDTO>> getCurrentUserOrders(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        List<OrderDTO> orders = orderService.getUserPurchaseHistory(currentUser.getId());
        return ResponseEntity.ok(orders);
    }

 

   
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getUserOrdersForAdmin(@PathVariable Long userId) {
        List<OrderDTO> orders = orderService.getUserPurchaseHistory(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrdersForAdmin() {
        List<OrderDTO> orders = orderService.getAllOrdersForAdmin();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> getOrderByIdForAdmin(@PathVariable Long orderId) {
        OrderDTO order = orderService.getOrderByIdForAdmin(orderId);
        return ResponseEntity.ok(order);
    }

   
    @PatchMapping("/{orderId}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrderAsAdmin(orderId);
        return ResponseEntity.noContent().build();
    }
}