package com.novahotel.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.novahotel.config.JwtConfig;
import com.novahotel.dto.AuthResponse;
import com.novahotel.dto.LoginRequest;
import com.novahotel.dto.RegisterRequest;
import com.novahotel.exception.BadRequestException;
import com.novahotel.exception.ResourceNotFoundException;
import com.novahotel.exception.UnauthorizedException;
import com.novahotel.model.User;
import com.novahotel.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtConfig jwtConfig;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tìm thấy"));
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public AuthResponse login(LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email không được để trống");
        }
        if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
            throw new BadRequestException("Mật khẩu không được để trống");
        }

        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (!userOpt.isPresent()) {
            throw new UnauthorizedException("Email hoặc mật khẩu không đúng");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Email hoặc mật khẩu không đúng");
        }
        if (!user.isActive()) {
            throw new UnauthorizedException("Tài khoản của bạn đã bị khóa");
        }

        user.setLastLogin(new Date());
        userRepository.save(user);
        String token = jwtConfig.generateToken(user.getId());

        return new AuthResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), token);
    }
    
    public AuthResponse register(RegisterRequest registerRequest) {
        if (registerRequest.getEmail() == null || registerRequest.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email không được để trống");
        }
        if (registerRequest.getPassword() == null || registerRequest.getPassword().trim().isEmpty()) {
            throw new BadRequestException("Mật khẩu không được để trống");
        }
        if (registerRequest.getFullName() == null || registerRequest.getFullName().trim().isEmpty()) {
            throw new BadRequestException("Họ tên không được để trống");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email này đã được sử dụng");
        }
        if (!registerRequest.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new BadRequestException("Email không hợp lệ");
        }
        if (registerRequest.getPassword().length() < 6) {
            throw new BadRequestException("Mật khẩu phải ít nhất 6 ký tự");
        }

        User newUser = new User();
        newUser.setId(UUID.randomUUID().toString());
        newUser.setUserId(UUID.randomUUID().toString());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setFullName(registerRequest.getFullName());
        newUser.setPhone(registerRequest.getPhone() != null ? registerRequest.getPhone() : "");
        newUser.setRole("customer");
        newUser.setCreatedAt(new Date());
        newUser.setLastLogin(new Date());
        newUser.setActive(true);

        User savedUser = userRepository.save(newUser);
        String token = jwtConfig.generateToken(savedUser.getId());
        return new AuthResponse(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole(), token);
    }
    
    public AuthResponse refreshToken(String currentToken) {
        if (currentToken == null || currentToken.trim().isEmpty()) {
            throw new UnauthorizedException("Token không được để trống");
        }
        if (currentToken.startsWith("Bearer ")) {
            currentToken = currentToken.substring(7);
        }
        if (!jwtConfig.isTokenValid(currentToken)) {
            throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
        }
        String userId = jwtConfig.getUserIdFromToken(currentToken);
        User user = getUserById(userId);
        String newToken = jwtConfig.generateToken(user.getId());
        return new AuthResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), newToken);
    }
    
    public User updateUser(String userId, User userUpdate) {
        User user = getUserById(userId);
        if (userUpdate.getFullName() != null && !userUpdate.getFullName().trim().isEmpty()) {
            user.setFullName(userUpdate.getFullName());
        }
        if (userUpdate.getPhone() != null && !userUpdate.getPhone().trim().isEmpty()) {
            user.setPhone(userUpdate.getPhone());
        }
        return userRepository.save(user);
    }
    
    public void deleteUser(String userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
    }
    
    public void changePassword(String userId, String oldPassword, String newPassword) {
        if (oldPassword == null || oldPassword.trim().isEmpty()) {
            throw new BadRequestException("Mật khẩu cũ không được để trống");
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new BadRequestException("Mật khẩu mới không được để trống");
        }
        if (newPassword.length() < 6) {
            throw new BadRequestException("Mật khẩu mới phải ít nhất 6 ký tự");
        }
        User user = getUserById(userId);
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new UnauthorizedException("Mật khẩu cũ không đúng");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}