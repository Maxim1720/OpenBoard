package ru.lea.openboardbackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", length = 50)
    private String name;

    @ManyToMany(targetEntity = Announcement.class, mappedBy = "categories", cascade = CascadeType.DETACH)
    private Set<Announcement> announcements;
}