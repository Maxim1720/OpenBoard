package ru.lea.openboardbackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "location")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "region", length = 150)
    private String region;

    @OneToMany(targetEntity = Announcement.class, mappedBy = "location", orphanRemoval = true)
    private Set<Announcement> announcements;
}