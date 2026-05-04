package com.novahotel.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.novahotel.model.Review;
import com.novahotel.repository.ReviewRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByRoomId(String roomId) {
        return reviewRepository.findByRoomId(roomId);
    }

    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }
}