package com.example.irmetasearch.repository;

import com.example.irmetasearch.entity.ImageMetaData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageMetaDataRepository extends JpaRepository<ImageMetaData, Long> {
}
