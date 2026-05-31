package com.trading.platform.service;

import com.trading.platform.entity.Stock;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

// Observer Pattern implementation
interface PriceObserver {
    void update(Stock stock);
}

@Service
public class PriceAlertService implements PriceObserver {

    private final SimpMessagingTemplate messagingTemplate;
    private final List<PriceObserver> observers = new ArrayList<>();

    public PriceAlertService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }


    public void subscribe(PriceObserver observer) {
        observers.add(observer);
    }

    public void unsubscribe(PriceObserver observer) {
        observers.remove(observer);
    }

    public void notifyObservers(Stock stock) {
        for (PriceObserver observer : observers) {
            observer.update(stock);
        }
    }

    @Override
    public void update(Stock stock) {
        // Here we could check if price hits a specific alert threshold
        // and notify a specific user via WebSocket.
        // For now, it just broadcasts.
    }
}
