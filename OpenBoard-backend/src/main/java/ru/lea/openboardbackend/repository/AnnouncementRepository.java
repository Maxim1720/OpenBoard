package ru.lea.openboardbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.lea.openboardbackend.entity.Announcement;
import ru.lea.openboardbackend.entity.Category;

import java.util.Set;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    Set<Announcement> findAnnouncementByCategories(Category[] categories);
}