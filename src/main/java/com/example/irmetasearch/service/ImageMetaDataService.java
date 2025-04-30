package com.example.irmetasearch.service;

import com.example.irmetasearch.entity.ImageMetaData;
import com.example.irmetasearch.repository.ImageMetaDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageMetaDataService {

    @Autowired
    private ImageMetaDataRepository imageMetaDataRepository;

    public void save(ImageMetaData imageMetaData) {
        imageMetaDataRepository.save(imageMetaData);
    }

//    public List<ImageMetaData> search(String searchType, Double latitude, Double longitude, Integer radius, String unit, String startDate, String endDate) {
//
//
//        return
//    }

}
