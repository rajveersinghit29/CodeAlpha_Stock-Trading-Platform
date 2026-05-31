package com.trading.platform.factory;

import com.trading.platform.dto.TradeRequest;
import org.springframework.stereotype.Component;

interface Order {
    void execute();
}

@Component
public class OrderFactory {

    public Order createOrder(String type, TradeRequest request) {
        if ("MARKET".equalsIgnoreCase(type)) {
            return new MarketOrder(request);
        } else if ("LIMIT".equalsIgnoreCase(type)) {
            return new LimitOrder(request);
        }
        throw new IllegalArgumentException("Unknown order type");
    }

    private static class MarketOrder implements Order {
        private final TradeRequest request;

        public MarketOrder(TradeRequest request) {
            this.request = request;
        }

        @Override
        public void execute() {
            // Logic for market order
        }
    }

    private static class LimitOrder implements Order {
        private final TradeRequest request;

        public LimitOrder(TradeRequest request) {
            this.request = request;
        }

        @Override
        public void execute() {
            // Logic for limit order
        }
    }
}
