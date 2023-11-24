package ru.lea.openboardbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.lea.openboardbackend.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}