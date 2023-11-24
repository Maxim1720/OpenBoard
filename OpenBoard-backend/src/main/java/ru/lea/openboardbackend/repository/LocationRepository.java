package ru.lea.openboardbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.lea.openboardbackend.entity.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
}