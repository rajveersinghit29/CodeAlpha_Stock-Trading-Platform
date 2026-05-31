package com.trading.platform.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "portfolio_stocks")
public class PortfolioStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private BigDecimal averagePrice;

    public PortfolioStock() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Portfolio getPortfolio() { return portfolio; }
    public void setPortfolio(Portfolio portfolio) { this.portfolio = portfolio; }
    public Stock getStock() { return stock; }
    public void setStock(Stock stock) { this.stock = stock; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getAveragePrice() { return averagePrice; }
    public void setAveragePrice(BigDecimal averagePrice) { this.averagePrice = averagePrice; }

    public static PortfolioStockBuilder builder() {
        return new PortfolioStockBuilder();
    }

    public static class PortfolioStockBuilder {
        private Portfolio portfolio;
        private Stock stock;
        private Integer quantity;
        private BigDecimal averagePrice;

        public PortfolioStockBuilder portfolio(Portfolio portfolio) { this.portfolio = portfolio; return this; }
        public PortfolioStockBuilder stock(Stock stock) { this.stock = stock; return this; }
        public PortfolioStockBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public PortfolioStockBuilder averagePrice(BigDecimal averagePrice) { this.averagePrice = averagePrice; return this; }

        public PortfolioStock build() {
            PortfolioStock ps = new PortfolioStock();
            ps.setPortfolio(portfolio);
            ps.setStock(stock);
            ps.setQuantity(quantity);
            ps.setAveragePrice(averagePrice);
            return ps;
        }
    }
}
