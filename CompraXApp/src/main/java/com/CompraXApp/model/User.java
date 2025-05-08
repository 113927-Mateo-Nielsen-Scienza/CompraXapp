package com.CompraXApp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    private String shippingAddress;

    private boolean active = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    private String passwordResetToken;

    private LocalDateTime passwordResetTokenExpiry;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    public void generatePasswordResetToken() {
        this.passwordResetToken = UUID.randomUUID().toString();
        this.passwordResetTokenExpiry = LocalDateTime.now().plusHours(1);
    }

    public boolean isPasswordResetTokenValid() {
        return this.passwordResetTokenExpiry != null &&
                LocalDateTime.now().isBefore(this.passwordResetTokenExpiry);
    }
}