    package ru.lea.openboardbackend.entity;

    import com.fasterxml.jackson.annotation.JsonProperty;
    import jakarta.persistence.*;
    import lombok.Getter;
    import lombok.Setter;
    import org.hibernate.annotations.CreationTimestamp;

    import java.util.Date;

    @Getter
    @Setter
    @Entity
    @Table(name = "comment")
    public class Comment {
        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        @Column(name = "id", nullable = false)
        private Long id;


        @Column(name = "text", length = 500)
        private String text;

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        @CreationTimestamp
        @Temporal(TemporalType.TIMESTAMP)
        @Column(name = "created_at")
        private Date createdAt;

        @ManyToOne(targetEntity = Announcement.class)
        @JoinColumn(name = "announcement_id")
        private Announcement announcement;

    }