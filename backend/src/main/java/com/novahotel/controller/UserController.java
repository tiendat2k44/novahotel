package com.novahotel.controller;

import com.novahotel.dto.ApiResponse;
import com.novahotel.model.User;
import com.novahotel.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * User Controller
 * Xử lý các yêu cầu liên quan tới thông tin người dùng
 * 
 * Base URL: /api/users
 * Protected endpoints (cần JWT token)
 */
@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserController {

    /**
     * UserService để xử lý logic người dùng
     */
    @Autowired
    private UserService userService;

    /**
     * Lấy thông tin người dùng hiện tại
     * 
     * GET /api/users/profile
     * 
     * @param authentication Authentication object được set bởi JwtFilter
     * @return User object
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getCurrentUserProfile(Authentication authentication) {
        log.info("Get profile for user: {}", authentication.getPrincipal());
        String userId = (String) authentication.getPrincipal();
        User user = userService.getUserById(userId);
        
        ApiResponse<User> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "User profile retrieved successfully",
                user
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy thông tin người dùng theo ID
     * 
     * GET /api/users/{userId}
     * 
     * @param userId ID của người dùng
     * @return User object
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable String userId) {
        log.info("Get user by ID: {}", userId);
        User user = userService.getUserById(userId);
        
        ApiResponse<User> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "User retrieved successfully",
                user
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Cập nhật thông tin người dùng
     * 
     * PUT /api/users/profile
     * 
     * @param userUpdate User object chứa thông tin cần cập nhật
     * @param authentication Authentication object
     * @return User object sau khi cập nhật
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateUserProfile(
            @RequestBody User userUpdate,
            Authentication authentication) {
        log.info("Update profile for user: {}", authentication.getPrincipal());
        String userId = (String) authentication.getPrincipal();
        User updatedUser = userService.updateUser(userId, userUpdate);
        
        ApiResponse<User> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "User profile updated successfully",
                updatedUser
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Xóa tài khoản người dùng
     * 
     * DELETE /api/users/profile
     * 
     * @param authentication Authentication object
     * @return Success message
     */
    @DeleteMapping("/profile")
    public ResponseEntity<ApiResponse<Void>> deleteUserProfile(Authentication authentication) {
        log.info("Delete account for user: {}", authentication.getPrincipal());
        String userId = (String) authentication.getPrincipal();
        userService.deleteUser(userId);
        
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "User account deleted successfully"
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Đổi mật khẩu
     * 
     * PUT /api/users/change-password
     * 
     * @param oldPassword Mật khẩu cũ
     * @param newPassword Mật khẩu mới
     * @param authentication Authentication object
     * @return Success message
     */
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestParam String oldPassword,
            @RequestParam String newPassword,
            Authentication authentication) {
        log.info("Change password for user: {}", authentication.getPrincipal());
        String userId = (String) authentication.getPrincipal();
        userService.changePassword(userId, oldPassword, newPassword);
        
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Password changed successfully"
        );
        return ResponseEntity.ok(response);
    }
}
