package com.CompraXApp.service;

import com.CompraXApp.dto.OrderDTO;
import com.CompraXApp.dto.PasswordResetRequest;
import com.CompraXApp.dto.SignupRequest;
import com.CompraXApp.dto.UserProfileResponse;
import com.CompraXApp.dto.UserUpdateRequest;
import com.CompraXApp.exception.ResourceNotFoundException;
import com.CompraXApp.model.Role;
import com.CompraXApp.model.User;
import com.CompraXApp.repository.RoleRepository;
import com.CompraXApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OrderService orderService;

    @Value("${app.frontend.baseurl}")
    private String frontendBaseUrl;

    @Value("${app.frontend.resetpassword.path}")
    private String resetPasswordPath;

    public User registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email ya está en uso!");
        }


        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(Role.ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
        user.setRoles(roles);

        return userRepository.save(user);
    }

    public User updateUser(Long userId, UserUpdateRequest updateRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setName(updateRequest.getName());

        if (!user.getEmail().equals(updateRequest.getEmail()) &&
                userRepository.existsByEmail(updateRequest.getEmail())) {
            throw new RuntimeException("Email ya está en uso");
        }
        user.setEmail(updateRequest.getEmail());
        user.setShippingAddress(updateRequest.getShippingAddress());

        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + userId));

        user.setActive(false);
        userRepository.save(user);
    }

    public void initiatePasswordReset(PasswordResetRequest resetRequest) {
        User user = userRepository.findByEmail(resetRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con email: " + resetRequest.getEmail()));

        user.generatePasswordResetToken();
        userRepository.save(user);

        String resetUrl = frontendBaseUrl + resetPasswordPath + "?token=" + user.getPasswordResetToken();

        emailService.sendPasswordResetEmail(
                user.getEmail(),
                "Recuperación de contraseña",
                "Para restablecer tu contraseña, haz clic en el siguiente enlace: " + resetUrl
        );
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido"));

        if (!user.isPasswordResetTokenValid()) {
            throw new RuntimeException("El token ha expirado");
        }

        user.setPassword(encoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);

        userRepository.save(user);
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void updateUserRoles(Long userId, Set<Role.ERole> roleNames) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Set<Role> roles = new HashSet<>();
        for (Role.ERole roleName : roleNames) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
            roles.add(role);
        }

        user.setRoles(roles);
        userRepository.save(user);
    }


    public UserProfileResponse getUserProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

        UserProfileResponse profileResponse = new UserProfileResponse();
        profileResponse.setId(user.getId());
        profileResponse.setName(user.getName());
        profileResponse.setEmail(user.getEmail());
        profileResponse.setShippingAddress(user.getShippingAddress());

        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());

        profileResponse.setRoles(roles);


        List<OrderDTO> purchaseHistory = orderService.getUserPurchaseHistory(id);
        profileResponse.setPurchaseHistory(purchaseHistory);

        return profileResponse;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}