package com.novahotel.service;

import com.novahotel.model.Review;
import com.novahotel.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review createReview(String userId, Review review) {
        review.setUserId(userId);
        review.setCreatedAt(new Date());
        if (review.getReviewId() == null) {
            review.setReviewId(UUID.randomUUID().toString());
        }
        return reviewRepository.save(review);
    }

    public Page<Review> getReviewsByRoom(String roomId, Integer page, Integer size) {
        List<Review> reviews = reviewRepository.findByRoomId(roomId);
        int start = Math.min(page * size, reviews.size());
        int end = Math.min((page + 1) * size, reviews.size());
        List<Review> pagedReviews = reviews.subList(start, end);
        return new PageImpl<>(pagedReviews, PageRequest.of(page, size), reviews.size());
    }

    public List<Review> getReviewsByUser(String userId) {
        return reviewRepository.findAll().stream()
                .filter(r -> userId.equals(r.getUserId()))
                .collect(Collectors.toList());
    }

    public Review getReviewById(String reviewId) {
        return reviewRepository.findAll().stream()
                .filter(r -> reviewId.equals(r.getReviewId()) || reviewId.equals(r.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }

    public Review updateReview(String reviewId, Review reviewUpdate, String userId) {
        Review existingReview = getReviewById(reviewId);
        if (!existingReview.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to update this review");
        }
        existingReview.setRating(reviewUpdate.getRating());
        existingReview.setComment(reviewUpdate.getComment());
        return reviewRepository.save(existingReview);
    }

    public void deleteReview(String reviewId, String userId) {
        Review existingReview = getReviewById(reviewId);
        if (!existingReview.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this review");
        }
        reviewRepository.delete(existingReview);
    }

    public Double getAverageRating(String roomId) {
        List<Review> reviews = reviewRepository.findByRoomId(roomId);
        if (reviews.isEmpty()) {
            return 0.0;
        }
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }
}
