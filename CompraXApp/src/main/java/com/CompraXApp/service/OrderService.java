package com.CompraXApp.service;

import com.CompraXApp.dto.OrderDTO;
import com.CompraXApp.dto.OrderItemDTO;
import com.CompraXApp.exception.ResourceNotFoundException;
import com.CompraXApp.model.*;
import com.CompraXApp.repository.CartRepository;
import com.CompraXApp.repository.OrderRepository;
import com.CompraXApp.repository.ProductRepository;
import com.CompraXApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository; 

  
    @Transactional(readOnly = true)
    public List<OrderDTO> getUserPurchaseHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return orderRepository.findByUserOrderByOrderDateDesc(user)
                .stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

  
    @Transactional
    public OrderDTO createOrderFromCart(Long userId, String shippingAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user id: " + userId + ". Cannot create order."));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot create order with an empty cart.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(shippingAddress); 
        order.setStatus(Order.OrderStatus.PENDING);

        for (CartItem cartItem : cart.getItems()) {
            Product product = productRepository.findById(cartItem.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product in cart not found: " + cartItem.getProduct().getName()));
            
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem(product, cartItem.getQuantity());
            order.addItem(orderItem); 
        }
        
        Order savedOrder = orderRepository.save(order);
      
        cart.clear();
        cartRepository.save(cart);
        
        return convertToOrderDTO(savedOrder);
    }

  
    @Transactional
    public void cancelOrderAsAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
      
        if (order.getStatus() == Order.OrderStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed order.");
        }
         if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new RuntimeException("Order is already cancelled.");
        }

       
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            if (product != null) {
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }
        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrdersForAdmin() {
        return orderRepository.findAll().stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderByIdForAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return convertToOrderDTO(order);
    }

    private OrderDTO convertToOrderDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(order.getId());
        orderDTO.setOrderDate(order.getOrderDate());
        orderDTO.setStatus(order.getStatus());
        orderDTO.setTotalAmount(order.getTotalAmount());
        orderDTO.setShippingAddress(order.getShippingAddress());
        orderDTO.setUserId(order.getUser().getId()); 
        orderDTO.setUserName(order.getUser().getName()); 

        List<OrderItemDTO> items = order.getItems().stream()
                .map(this::convertToOrderItemDTO)
                .collect(Collectors.toList());

        orderDTO.setItems(items);
        return orderDTO;
    }

    private OrderItemDTO convertToOrderItemDTO(OrderItem item) {
        OrderItemDTO itemDTO = new OrderItemDTO();
        itemDTO.setId(item.getId());
        itemDTO.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
        itemDTO.setProductName(item.getProductName());
        itemDTO.setPrice(item.getPrice());
        itemDTO.setQuantity(item.getQuantity());
        itemDTO.setSubtotal(item.getPrice().multiply(new BigDecimal(item.getQuantity())));
        return itemDTO;
    }
}