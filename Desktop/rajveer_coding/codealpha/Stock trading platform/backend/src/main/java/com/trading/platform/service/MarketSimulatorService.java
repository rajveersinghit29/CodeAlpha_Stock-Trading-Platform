package com.trading.platform.service;

import com.trading.platform.entity.Stock;
import com.trading.platform.repository.StockRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@EnableScheduling
public class MarketSimulatorService {

    private final StockRepository stockRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public MarketSimulatorService(StockRepository stockRepository, SimpMessagingTemplate messagingTemplate) {
        this.stockRepository = stockRepository;
        this.messagingTemplate = messagingTemplate;
    }
    private final Random random = new Random();

    @Value("${market.simulator.enabled:true}")
    private boolean isEnabled;

    @PostConstruct
    @Transactional
    public void initStocks() {
        List<Stock> defaultStocks = Arrays.asList(
                Stock.builder().symbol("AAPL").name("Apple").currentPrice(new BigDecimal("175.50")).build(),
                Stock.builder().symbol("GOOGL").name("Google").currentPrice(new BigDecimal("140.20")).build(),
                Stock.builder().symbol("MSFT").name("Microsoft").currentPrice(new BigDecimal("335.10")).build(),
                Stock.builder().symbol("AMZN").name("Amazon").currentPrice(new BigDecimal("130.00")).build(),
                Stock.builder().symbol("TSLA").name("Tesla").currentPrice(new BigDecimal("240.50")).build(),
                Stock.builder().symbol("NVDA").name("Nvidia").currentPrice(new BigDecimal("450.00")).build(),
                Stock.builder().symbol("META").name("Meta").currentPrice(new BigDecimal("300.00")).build(),
                Stock.builder().symbol("NFLX").name("Netflix").currentPrice(new BigDecimal("410.20")).build(),
                Stock.builder().symbol("JPM").name("JPMorgan").currentPrice(new BigDecimal("150.75")).build(),
                Stock.builder().symbol("V").name("Visa").currentPrice(new BigDecimal("240.10")).build(),
                Stock.builder().symbol("JNJ").name("Johnson & Johnson").currentPrice(new BigDecimal("160.40")).build(),
                Stock.builder().symbol("WMT").name("Walmart").currentPrice(new BigDecimal("160.00")).build(),
                Stock.builder().symbol("PG").name("Procter & Gamble").currentPrice(new BigDecimal("155.20")).build(),
                Stock.builder().symbol("MA").name("Mastercard").currentPrice(new BigDecimal("400.30")).build(),
                Stock.builder().symbol("HD").name("Home Depot").currentPrice(new BigDecimal("330.15")).build(),
                Stock.builder().symbol("CVX").name("Chevron").currentPrice(new BigDecimal("165.80")).build(),
                Stock.builder().symbol("KO").name("Coca-Cola").currentPrice(new BigDecimal("60.50")).build(),
                Stock.builder().symbol("PEP").name("PepsiCo").currentPrice(new BigDecimal("175.40")).build(),
                Stock.builder().symbol("BTC").name("Bitcoin").currentPrice(new BigDecimal("35000.00")).build(),
                Stock.builder().symbol("ETH").name("Ethereum").currentPrice(new BigDecimal("2000.00")).build()
        );

        if (stockRepository.count() == 0) {
            stockRepository.saveAll(defaultStocks);
            System.out.println("Initialized simulated market with " + defaultStocks.size() + " stocks.");
        } else {
            // Update names in case they were misspelled or wrong
            List<Stock> existing = stockRepository.findAll();
            Map<String, String> properNames = defaultStocks.stream()
                .collect(Collectors.toMap(Stock::getSymbol, Stock::getName));
            
            for (Stock s : existing) {
                if (properNames.containsKey(s.getSymbol())) {
                    s.setName(properNames.get(s.getSymbol()));
                    stockRepository.save(s);
                }
            }
        }
    }

    @Scheduled(fixedRate = 3000)
    @Transactional
    public void simulateMarket() {
        if (!isEnabled) return;

        List<Stock> stocks = stockRepository.findAll();
        for (Stock stock : stocks) {
            double fluctuation = -0.02 + (0.04 * random.nextDouble());
            BigDecimal newPrice = stock.getCurrentPrice().multiply(BigDecimal.valueOf(1 + fluctuation))
                    .setScale(2, RoundingMode.HALF_UP);
            
            if (newPrice.compareTo(BigDecimal.ONE) < 0) {
                newPrice = BigDecimal.ONE;
            }
            
            stock.setCurrentPrice(newPrice);
            stockRepository.save(stock); 

            messagingTemplate.convertAndSend("/topic/stocks", stock);
        }
    }
}
