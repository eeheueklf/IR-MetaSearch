package com.example.irmetasearch.controller;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.Tag;
import com.example.irmetasearch.repository.ImageMetaDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.irmetasearch.entity.ImageMetaData;
import com.example.irmetasearch.service.ImageMetaDataService;

import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

@RestController
public class MetadataController {

    @Autowired
    private ImageMetaDataService imageMetaDataService;

    @Value("${file.upload-dir}")
    private String uploadDir;
    @Autowired
    private ImageMetaDataRepository imageMetaDataRepository;

    // 도, 분, 초 형식을 십진수로 변환하는 메서드
    private double convertDMS(String dms) {
        String[] parts = dms.split("[°'\" ]+");

        // 도, 분, 초 값 파싱
        double degrees = Double.parseDouble(parts[0]);
        double minutes = Double.parseDouble(parts[1]);
        double seconds = Double.parseDouble(parts[2]);

        // 십진수로 변환
        return degrees + (minutes / 60.0) + (seconds / 3600.0);
    }

    @PostMapping("/api/upload")
    public ResponseEntity<Map<String, Object>> extractMetadata(@RequestParam("file") MultipartFile file) {
        Map<String, Object> metadataMap = new HashMap<>();

        try {
            // 1. 파일 저장 (중복 체크)
            File uploadFolder = new File(uploadDir);

            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            String originalFileName = Paths.get(file.getOriginalFilename()).getFileName().toString();
            File destFile = new File(uploadFolder, originalFileName);

            // 파일이 이미 존재하는지 체크
            if (destFile.exists()) {
                // 파일이 존재할 경우, 메타데이터 추출만 진행하고 저장은 하지 않음
                metadataMap.put("message", "파일 이름이 존재합니다. 메타데이터만 추출됩니다.");

                // 기존 파일에서 메타데이터 읽기
                Metadata metadata = ImageMetadataReader.readMetadata(destFile);

                String dateTimeOriginal = null;
                String latitudeStr = null;
                String longitudeStr = null;

                // 모든 디렉토리와 태그를 반복하여 GPS 정보 추출
                for (Directory directory : metadata.getDirectories()) {
                    for (Tag tag : directory.getTags()) {
                        String tagName = tag.getTagName();
                        String tagValue = tag.getDescription();

                        switch (tagName) {
                            case "Date/Time Original":
                                dateTimeOriginal = tagValue;
                                break;
                            case "GPS Latitude":
                                latitudeStr = tagValue;
                                break;
                            case "GPS Longitude":
                                longitudeStr = tagValue;
                                break;
                        }
                    }
                }

                metadataMap.put("Date/Time Original", dateTimeOriginal);
                metadataMap.put("GPS Latitude", latitudeStr);
                metadataMap.put("GPS Longitude", longitudeStr);

                // GPS 값이 존재하면 십진수로 변환
                double latitude = 0;
                double longitude = 0;

                if (latitudeStr != null) {
                    latitude = convertDMS(latitudeStr);
                }
                if (longitudeStr != null) {
                    longitude = convertDMS(longitudeStr);
                }

                metadataMap.put("latitude", latitude);
                metadataMap.put("longitude", longitude);

                // 저장은 하지 않음
                return ResponseEntity.ok(metadataMap);
            }

            // 파일이 존재하지 않으면 파일을 저장하고 메타데이터 추출 및 DB에 저장
            file.transferTo(destFile);

            // 2. 파일에서 메타데이터 읽기
            Metadata metadata = ImageMetadataReader.readMetadata(destFile);

            String dateTimeOriginal = null;
            String latitudeStr = null;
            String longitudeStr = null;

            // 모든 디렉토리와 태그를 반복하여 GPS 정보 추출
            for (Directory directory : metadata.getDirectories()) {
                for (Tag tag : directory.getTags()) {
                    String tagName = tag.getTagName();
                    String tagValue = tag.getDescription();

                    switch (tagName) {
                        case "Date/Time Original":
                            dateTimeOriginal = tagValue;
                            break;
                        case "GPS Latitude":
                            latitudeStr = tagValue;
                            break;
                        case "GPS Longitude":
                            longitudeStr = tagValue;
                            break;
                    }
                }
            }

            metadataMap.put("Date/Time Original", dateTimeOriginal);

            // GPS 값이 존재하면 십진수로 변환
            double latitude = 0;
            double longitude = 0;

            if (latitudeStr != null) {
                latitude = convertDMS(latitudeStr);
            }
            if (longitudeStr != null) {
                longitude = convertDMS(longitudeStr);
            }

            metadataMap.put("GPS Latitude", latitudeStr);
            metadataMap.put("GPS Longitude", longitudeStr);
            metadataMap.put("latitude", latitude);
            metadataMap.put("longitude", longitude);

            // 이미지 메타데이터 DB에 저장
            ImageMetaData imageMetaData = new ImageMetaData();
            imageMetaData.setFileName(originalFileName);
            imageMetaData.setLatitude(latitude);
            imageMetaData.setLongitude(longitude);
            if (dateTimeOriginal != null) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy:MM:dd HH:mm:ss");
                LocalDateTime timestamp = LocalDateTime.parse(dateTimeOriginal, formatter);
                imageMetaData.setTimestamp(timestamp);
            }

            imageMetaDataService.save(imageMetaData);  // DB에 저장

            return ResponseEntity.ok(metadataMap);

        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "파일을 읽을 수 없습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "메타데이터 추출 실패"));
        }
    }


    @GetMapping("/api/search")
    public List<ImageMetaData> searchImages(
            @RequestParam String fileName,
            @RequestParam double radius,
            @RequestParam String searchType,
            @RequestParam String unit) {
        return imageMetaDataService.searchImages(fileName, radius, searchType, unit);
    }
}