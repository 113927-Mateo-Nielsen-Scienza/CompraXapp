package com.CompraXApp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // Import Value
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}") // Inject the username from properties
    private String fromEmail;

    public void sendPasswordResetEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail); // Use the injected value
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    public void sendVerificationEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail); // Use the injected value
        message.setTo(to);
        message.setSubject("Verifica tu cuenta en CompraXApp");
        message.setText("Hola,\n\nGracias por registrarte en CompraXApp.\n" +
                        "Tu código de verificación es: " + code + "\n\n" +
                        "Este código expirará en 24 horas.\n\n" +
                        "Saludos,\nEl equipo de CompraXApp");
        mailSender.send(message);
        System.out.println("Email de verificación enviado a: " + to); 
    }
}