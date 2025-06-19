package com.example.irmetasearch.controller;

import com.example.irmetasearch.service.ImageMetaDataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PerformanceTestController {

    private final ImageMetaDataService imageMetaDataService;

    public PerformanceTestController(ImageMetaDataService imageMetaDataService) {
        this.imageMetaDataService = imageMetaDataService;
    }

    @GetMapping("/test/performance")
    public String runPerformanceTest() {
        imageMetaDataService.measurePerformance();
        return "성능 테스트 완료 - 콘솔 확인";
    }
}

