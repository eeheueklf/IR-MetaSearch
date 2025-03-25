package com.example.irmetasearch.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
    private double altitude; // 경도
//    private LocalDateTime timestamp; // 촬영 시간 (선택 사항)

}
