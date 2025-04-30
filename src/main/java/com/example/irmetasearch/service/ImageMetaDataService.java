package com.example.irmetasearch.service;

import com.example.irmetasearch.entity.ImageMetaData;
import com.example.irmetasearch.repository.ImageMetaDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImageMetaDataService {

    @Autowired
    private ImageMetaDataRepository imageMetaDataRepository;

    public void save(ImageMetaData imageMetaData) {
        imageMetaDataRepository.save(imageMetaData);
    }

    public List<ImageMetaData> searchImages(String fileName, double radius, String searchType, String unit) {
        // 1. 기준 이미지 가져오기
        ImageMetaData base = imageMetaDataRepository.findByFileName(fileName);

        if (base == null) {
            throw new IllegalArgumentException("해당 fileName의 이미지가 존재하지 않습니다: " + fileName);
        }

        // 2. 조건별 필터링
        if ("time".equals(searchType)) {
            int year = base.getTimestamp().getYear();
            int month = base.getTimestamp().getMonthValue();
            int day = base.getTimestamp().getDayOfMonth();

            switch (unit) {
                case "year":
                    return imageMetaDataRepository.findByYear(year);
                case "month":
                    return imageMetaDataRepository.findByMonth(year, month);
                case "day":
                    return imageMetaDataRepository.findByDay(year, month, day);
                default:
                    return Collections.emptyList();
            }
        } else if ("location".equals(searchType)) {
            return filterByRadius(imageMetaDataRepository.findAll(), base.getLatitude(), base.getLongitude(), radius);
        } else {
            return Collections.emptyList();
        }
    }


    private List<ImageMetaData> filterByRadius(List<ImageMetaData> all, double baseLat, double baseLon, double radiusKm) {
        return all.stream().filter(img -> {
            double dist = calculateDistance(img.getLatitude(), img.getLongitude(), baseLat, baseLon);
            return dist <= radiusKm;
        }).collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        //위도와 경도를 라디안으로 변환한 다음 Harvarsine공식 ㄱㄱ
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }


}
