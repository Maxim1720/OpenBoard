package ru.lea.openboardbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.lea.openboardbackend.entity.Announcement;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
}