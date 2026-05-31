package com.trading.platform.controller;

import com.trading.platform.dto.TradeRequest;
import com.trading.platform.service.TradingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trade")
public class TradingController {

    private final TradingService tradingService;

    public TradingController(TradingService tradingService) {
        this.tradingService = tradingService;
    }


    @PostMapping("/buy")
    public ResponseEntity<?> buyStock(@RequestBody TradeRequest request, Authentication authentication) {
        try {
            tradingService.buyStock(authentication.getName(), request);
            return ResponseEntity.ok("Buy order executed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/sell")
    public ResponseEntity<?> sellStock(@RequestBody TradeRequest request, Authentication authentication) {
        try {
            tradingService.sellStock(authentication.getName(), request);
            return ResponseEntity.ok("Sell order executed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
