package com.example.irmetasearch.repository;

import com.example.irmetasearch.entity.ImageMetaData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ImageMetaDataRepository extends JpaRepository<ImageMetaData, Long> {

    ImageMetaData findByFileName(String fileName);

    @Query("SELECT imd FROM ImageMetaData imd WHERE imd.timestamp >= :start AND imd.timestamp < :end")
    List<ImageMetaData> findByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query(value = "SELECT * FROM image_meta_data WHERE ST_Distance_Sphere(location, ST_GeomFromText(:point, 4326)) <= :radius", nativeQuery = true)
    List<ImageMetaData> findWithinRadius(
            @Param("point") String pointWKT,
            @Param("radius") double radiusInMeters
    );

    @Query(value = "SELECT * FROM image_meta_data " +
            "WHERE ST_Contains(ST_Buffer(ST_GeomFromText(:point, 4326), :radius), location)",
            nativeQuery = true)
    List<ImageMetaData> findWithRadius(
            @Param("point") String pointWKT,
            @Param("radius") double radiusInMeters
    );


}
