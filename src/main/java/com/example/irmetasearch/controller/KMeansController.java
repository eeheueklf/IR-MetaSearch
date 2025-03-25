package com.example.irmetasearch.controller;

import com.example.irmetasearch.service.KMeansService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class KMeansController {

    @Autowired
    private KMeansService kMeansService;

    // 클러스터링을 수행하는 POST 메서드
    @PostMapping("/api/cluster")
    public List<List<Double>> clusterImages(@RequestBody List<double[]> imageData, @RequestParam int numClusters) {
        return kMeansService.clusterImages(imageData, numClusters); // 클러스터링 후 결과 반환
    }
}