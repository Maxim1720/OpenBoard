package ru.lea.openboardbackend.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "announcement")
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "title", length = 50)
    private String title;

    @Column(name = "description")
    private String description;

    @CreationTimestamp
    @CreatedDate
    private Date createdAt;

    @ManyToMany(targetEntity = Category.class)
    private Set<Category> categories;

    @OneToMany(targetEntity = Comment.class, mappedBy = "announcement")
    private Set<Comment> comments;

    @OneToMany(targetEntity = Rating.class, mappedBy = "announcement")
    private Set<Rating> ratings;

    @ManyToOne(targetEntity = Location.class)
    private Location location;
}