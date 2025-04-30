package com.example.irmetasearch.controller;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.irmetasearch.entity.ImageMetaData;
import com.example.irmetasearch.service.ImageMetaDataService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
public class MetadataController {

    @Autowired
    private ImageMetaDataService imageMetaDataService;

    @Value("${file.upload-dir}")
    private String uploadDir;

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

            if (destFile.exists()) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("error", "이미 같은 이름의 파일이 존재합니다."));
            }

            file.transferTo(destFile);

            // 2. 파일에서 메타데이터 읽기
            Metadata metadata = ImageMetadataReader.readMetadata(destFile);

            // GPS 정보 추출
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

            // 메타데이터 Map에 추가
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
    public ResponseEntity<List<ImageMetaData>> searchImages(
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) Integer radius,
            @RequestParam(required = false) String unit,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ){
        List<ImageMetaData> results = imageMetaDataService.search(searchType,latitude, longitude, radius, unit, startDate, endDate);
        return ResponseEntity.ok(results);
    }
}