package com.example.irmetasearch.repository;

import com.example.irmetasearch.entity.ImageMetaData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ImageMetaDataRepository extends JpaRepository<ImageMetaData, Long> {

    ImageMetaData findByFileName(String fileName);

    //연도
    @Query("SELECT imd FROM ImageMetaData imd WHERE YEAR(imd.timestamp) = :year")
    List<ImageMetaData> findByYear(@Param("year") int year);

    //연도-월
    @Query("SELECT imd FROM ImageMetaData imd WHERE YEAR(imd.timestamp) = :year AND MONTH(imd.timestamp) = :month")
    List<ImageMetaData> findByMonth(@Param("year") int year, @Param("month") int month);

    //연도-월-일
    @Query("SELECT imd FROM ImageMetaData imd WHERE YEAR(imd.timestamp) = :year AND MONTH(imd.timestamp) = :month AND DAY(imd.timestamp) = :day")
    List<ImageMetaData> findByDay(@Param("year") int year, @Param("month") int month, @Param("day") int day);

    @Query("SELECT imd FROM ImageMetaData imd WHERE imd.timestamp BETWEEN :start AND :end")
    List<ImageMetaData> findByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

}
