package com.CompraXApp.service;

import com.CompraXApp.model.Promotion;
import com.CompraXApp.model.User;
import com.CompraXApp.repository.UserRepository;
import com.CompraXApp.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromotionService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService; // ✅ AGREGAR ESTA LÍNEA

    @Scheduled(cron = "0 0 9 * * MON") // Cada lunes a las 9 AM
    public void sendWeeklyPromotions() {
        List<User> users = userRepository.findByActiveTrue();
        List<Promotion> activePromotions = promotionRepository.findByActiveTrue();

        for (User user : users) {
            // Email existente
            emailService.sendPromotionEmail(user.getEmail(), activePromotions);
            
            // ✅ AGREGAR: Crear notificaciones en plataforma
            for (Promotion promotion : activePromotions) {
                notificationService.createPromotionNotification(
                    user, 
                    promotion.getTitle(), 
                    promotion.getDescription()
                );
            }
        }
    }
}