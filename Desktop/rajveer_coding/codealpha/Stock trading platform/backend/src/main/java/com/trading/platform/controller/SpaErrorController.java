package com.trading.platform.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
public class SpaErrorController implements ErrorController {

    @RequestMapping("/error")
    public Object handleError(HttpServletRequest request) {
        String originalUri = (String) request.getAttribute("jakarta.servlet.error.request_uri");
        
        if (originalUri != null && originalUri.startsWith("/api/")) {
            Map<String, Object> errorDetails = new HashMap<>();
            
            Exception exception = (Exception) request.getAttribute("jakarta.servlet.error.exception");
            String message = (exception != null) ? exception.getMessage() : "API Error or Unauthorized";
            
            errorDetails.put("message", message);
            errorDetails.put("path", originalUri);
            
            Integer statusCode = (Integer) request.getAttribute("jakarta.servlet.error.status_code");
            HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
            if (statusCode != null) {
                status = HttpStatus.valueOf(statusCode);
                if (statusCode == 401 || statusCode == 403) {
                    errorDetails.put("message", "Session expired or invalid token. Please log in again.");
                }
            }
            
            return new ResponseEntity<>(errorDetails, status);
        }
        
        return "forward:/index.html";
    }
}
