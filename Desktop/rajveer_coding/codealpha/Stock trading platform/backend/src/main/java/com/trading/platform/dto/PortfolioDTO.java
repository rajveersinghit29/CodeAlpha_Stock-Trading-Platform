package com.trading.platform.dto;

import java.math.BigDecimal;
import java.util.List;

public class PortfolioDTO {
    private BigDecimal cashBalance;
    private BigDecimal totalPortfolioValue;
    private List<PortfolioItemDTO> holdings;

    public PortfolioDTO() {}

    public BigDecimal getCashBalance() { return cashBalance; }
    public void setCashBalance(BigDecimal cashBalance) { this.cashBalance = cashBalance; }
    public BigDecimal getTotalPortfolioValue() { return totalPortfolioValue; }
    public void setTotalPortfolioValue(BigDecimal totalPortfolioValue) { this.totalPortfolioValue = totalPortfolioValue; }
    public List<PortfolioItemDTO> getHoldings() { return holdings; }
    public void setHoldings(List<PortfolioItemDTO> holdings) { this.holdings = holdings; }

    public static class PortfolioItemDTO {
        private String symbol;
        private String name;
        private int quantity;
        private BigDecimal averagePrice;
        private BigDecimal currentPrice;
        private BigDecimal totalValue;
        private BigDecimal unrealizedPl;
        private double plPercentage;

        public PortfolioItemDTO() {}

        public String getSymbol() { return symbol; }
        public void setSymbol(String symbol) { this.symbol = symbol; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public BigDecimal getAveragePrice() { return averagePrice; }
        public void setAveragePrice(BigDecimal averagePrice) { this.averagePrice = averagePrice; }
        public BigDecimal getCurrentPrice() { return currentPrice; }
        public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }
        public BigDecimal getTotalValue() { return totalValue; }
        public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }
        public BigDecimal getUnrealizedPl() { return unrealizedPl; }
        public void setUnrealizedPl(BigDecimal unrealizedPl) { this.unrealizedPl = unrealizedPl; }
        public double getPlPercentage() { return plPercentage; }
        public void setPlPercentage(double plPercentage) { this.plPercentage = plPercentage; }
    }
}
