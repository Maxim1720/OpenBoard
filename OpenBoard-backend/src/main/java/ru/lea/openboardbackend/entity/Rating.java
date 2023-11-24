package ru.lea.openboardbackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(targetEntity = Announcement.class)
    @JoinColumn(name = "announcement_id")
    private Announcement announcement;

    @Column(nullable = false)
    private Integer value;
}
