package com.example.irmetasearch.controller;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.Tag;
import com.drew.metadata.exif.ExifSubIFDDirectory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
public class MetadataController {

    @PostMapping("/api/upload")
    public ResponseEntity<Map<String, Object>> extractMetadata(@RequestParam("file") MultipartFile file) {
        Map<String, Object> metadataMap = new HashMap<>();

        try {
            // 파일에서 메타데이터 읽기
            Metadata metadata = ImageMetadataReader.readMetadata(file.getInputStream());

            // 모든 디렉토리와 태그를 반복하여 출력
            for (Directory directory : metadata.getDirectories()) {
                for (Tag tag : directory.getTags()) {
                    metadataMap.put(tag.getTagName(), tag.getDescription()); // 태그 이름과 값을 저장
                }
            }

            return ResponseEntity.ok(metadataMap);

        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "파일을 읽을 수 없습니다."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "메타데이터 추출 실패"));
        }
    }
}
