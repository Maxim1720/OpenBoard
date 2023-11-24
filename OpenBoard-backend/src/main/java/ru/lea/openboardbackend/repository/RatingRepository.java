package ru.lea.openboardbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.lea.openboardbackend.entity.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long> {

}