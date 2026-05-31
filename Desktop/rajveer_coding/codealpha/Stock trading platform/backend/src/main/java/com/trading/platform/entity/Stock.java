package com.trading.platform.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "stocks")
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String symbol;

    private String name;

    @Column(nullable = false)
    private BigDecimal currentPrice;

    @Version
    private Long version; // Optimistic locking

    public Stock() {}

    public Stock(Long id, String symbol, String name, BigDecimal currentPrice, Long version) {
        this.id = id;
        this.symbol = symbol;
        this.name = name;
        this.currentPrice = currentPrice;
        this.version = version;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public static StockBuilder builder() {
        return new StockBuilder();
    }

    public static class StockBuilder {
        private String symbol;
        private String name;
        private BigDecimal currentPrice;

        public StockBuilder symbol(String symbol) { this.symbol = symbol; return this; }
        public StockBuilder name(String name) { this.name = name; return this; }
        public StockBuilder currentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; return this; }
        
        public Stock build() {
            Stock stock = new Stock();
            stock.setSymbol(symbol);
            stock.setName(name);
            stock.setCurrentPrice(currentPrice);
            return stock;
        }
    }
}
