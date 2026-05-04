package com.novahotel.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;

    private String userId;
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private String role;           // customer, receptionist, admin
    private Date createdAt;
    private Date lastLogin;
    private boolean isActive = true;
}