package com.example.irmetasearch.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;


@Entity
@Getter
@Setter
public class ImageMetaData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fileName;
    private double latitude; // 위도
    private double longitude; // 경도
    private LocalDateTime timestamp; //날짜

    @Column(columnDefinition = "POINT SRID 4326", nullable = false)
    @JsonIgnore
    private Point location;

    public void setLocation(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.location = GeometryUtils.createPoint(longitude,latitude);
    }

}
