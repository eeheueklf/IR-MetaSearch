package com.example.irmetasearch.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/api/test")
    public String hello() {
        return "안녕하세요 백엔드입니다.";
    }

    @GetMapping("/api/www")
    public String www() {
        return "wwwwwwwww";
    }
}
