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
        imageMetaData.setLocation(imageMetaData.getLatitude(), imageMetaData.getLongitude()); // ⭐ 추가
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
            LocalDateTime start;
            LocalDateTime end;

            switch (unit) {
                case "year":
                    start = base.getTimestamp().withDayOfYear(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
                    end = start.plusYears(1);
                    break;
                case "month":
                    start = base.getTimestamp().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
                    end = start.plusMonths(1);
                    break;
                case "day":
                    start = base.getTimestamp().withHour(0).withMinute(0).withSecond(0).withNano(0);
                    end = start.plusDays(1);
                    break;
                default:
                    return Collections.emptyList();
            }

            return imageMetaDataRepository.findByDateRange(start, end);
        } else if ("location".equals(searchType)) {
            String pointWKT = String.format("POINT(%f %f)", base.getLatitude(), base.getLongitude());
            return imageMetaDataRepository.findWithinRadius(pointWKT, radius * 1000);
//            return filterByRadius(imageMetaDataRepository.findAll(), base.getLatitude(), base.getLongitude(), radius);
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

    public void measurePerformance() {
        long start, end;

        // 1) findAll()
//        start = System.currentTimeMillis();
//        List<ImageMetaData> all = imageMetaDataRepository.findAll();
//        end = System.currentTimeMillis();
//        System.out.println("findAll() 실행 시간: " + (end - start) + "ms, 결과 수: " + all.size());

        // 2) timestamp BETWEEN (22년 한 해)
//        LocalDateTime startTime = LocalDateTime.of(2022, 1, 1, 0, 0);
//        LocalDateTime endTime = LocalDateTime.of(2022, 12, 31, 23, 59, 59);
//        start = System.currentTimeMillis();
//        List<ImageMetaData> byTimestamp = imageMetaDataRepository.findByDateRange(startTime, endTime);
//        end = System.currentTimeMillis();
//        System.out.println("timestamp BETWEEN(한 해) 실행 시간: " + (end - start) + "ms, 결과 수: " + byTimestamp.size());
//
//        List<ImageMetaData> result;
//        start = System.currentTimeMillis();
//        result = imageMetaDataRepository.findByDateRange(LocalDateTime.of(2022,1,1,0,0), LocalDateTime.of(2022,12,31,23,59,59));
//        System.out.println("범위 사용 쿼리 실행 시간: " + (System.currentTimeMillis() - start) + "ms, 결과수: " + result.size());

        // 3) location 필터 (메모리 필터링)
        double baseLat = 37.5; // 임의 기준점
        double baseLon = 126.5;
        double radiusKm = 5;

        // 1) DB에서 전체 데이터 읽기
        start = System.currentTimeMillis();
        List<ImageMetaData> allData = imageMetaDataRepository.findAll();
        end = System.currentTimeMillis();
        System.out.println("findAll() 실행 시간: " + (end - start) + "ms, 결과 수: " + allData.size());

        // 2) 메모리 필터링 (filterByRadius() 메서드 사용)
        start = System.currentTimeMillis();
        List<ImageMetaData> filtered = filterByRadius(allData, baseLat, baseLon, radiusKm);
        end = System.currentTimeMillis();
        System.out.println("filterByRadius 1km 실행 시간: " + (end - start) + "ms, 결과 수: " + filtered.size());

        radiusKm = 100;
        start = System.currentTimeMillis();
        filtered = filterByRadius(allData, baseLat, baseLon, radiusKm);
        end = System.currentTimeMillis();
        System.out.println("filterByRadius 100km 실행 시간: " + (end - start) + "ms, 결과 수: " + filtered.size());


        String pointWKT = String.format("POINT(%f %f)", baseLat, baseLon);

        radiusKm = 5;
        start = System.currentTimeMillis();
        List<ImageMetaData> dbFiltered = imageMetaDataRepository.findWithinRadius(pointWKT, radiusKm * 1000);
        end = System.currentTimeMillis();
        System.out.println("findWithinRadius 1km (DB 쿼리) 실행 시간: " + (end - start) + "ms, 결과 수: " + dbFiltered.size());


        pointWKT = String.format("POINT(%f %f)", baseLat, baseLon);
        radiusKm = 100;
        start = System.currentTimeMillis();
        dbFiltered = imageMetaDataRepository.findWithinRadius(pointWKT, radiusKm * 1000);
        end = System.currentTimeMillis();
        System.out.println("findWithinRadius 100km (DB 쿼리) 실행 시간: " + (end - start) + "ms, 결과 수: " + dbFiltered.size());

    }

}
