package com.example.irmetasearch.service;

import org.apache.commons.math3.ml.clustering.CentroidCluster;
import org.apache.commons.math3.ml.clustering.KMeansPlusPlusClusterer;
import org.apache.commons.math3.ml.clustering.Cluster;
import org.apache.commons.math3.ml.clustering.DoublePoint;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class KMeansService {

    // 이미지 데이터를 클러스터링하는 메서드
    public List<List<Double>> clusterImages(List<double[]> imageData, int numClusters) {
        // KMeansPlusPlusClusterer 객체 생성 (numClusters개의 클러스터로 군집화)
        KMeansPlusPlusClusterer<DoublePoint> clusterer = new KMeansPlusPlusClusterer<>(numClusters);

        // List<DoublePoint>로 변환
        List<DoublePoint> points = new ArrayList<>();
        for (double[] data : imageData) {
            points.add(new DoublePoint(data)); // 이미지 데이터가 DoublePoint 객체로 변환됨
        }

        // 클러스터링 실행
        List<CentroidCluster<DoublePoint>> clusters = clusterer.cluster(points);

        // 결과를 List<List<Double>>로 변환
        List<List<Double>> result = new ArrayList<>();
        for (CentroidCluster<DoublePoint> cluster : clusters) {
            List<Double> clusterData = new ArrayList<>();
            // 클러스터의 중심점을 가져오고, 중심점의 데이터를 List<Double>로 변환
            double[] center = cluster.getCenter().getPoint();
            for (double value : center) {
                clusterData.add(value); // 중심점의 데이터를 List<Double>로 변환
            }
            result.add(clusterData); // 각 클러스터의 데이터를 결과 리스트에 추가
        }

        return result;
    }
}