package com.trading.platform.service;

import com.trading.platform.dto.TradeRequest;
import com.trading.platform.entity.*;
import com.trading.platform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
public class TradingService {

    private final UserRepository userRepository;
    private final StockRepository stockRepository;
    private final PortfolioRepository portfolioRepository;
    private final PortfolioStockRepository portfolioStockRepository;
    private final TransactionRepository transactionRepository;

    public TradingService(UserRepository userRepository, StockRepository stockRepository, PortfolioRepository portfolioRepository, PortfolioStockRepository portfolioStockRepository, TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.stockRepository = stockRepository;
        this.portfolioRepository = portfolioRepository;
        this.portfolioStockRepository = portfolioStockRepository;
        this.transactionRepository = transactionRepository;
    }


    @Transactional
    public void buyStock(String username, TradeRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Stock stock = stockRepository.findBySymbol(request.getSymbol())
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        BigDecimal totalCost = stock.getCurrentPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        if (user.getBalance().compareTo(totalCost) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        user.setBalance(user.getBalance().subtract(totalCost));
        userRepository.save(user);

        // Assume single portfolio for now
        Portfolio portfolio = user.getPortfolios().stream().findFirst().orElseGet(() -> {
            Portfolio p = Portfolio.builder().user(user).name("Main").build();
            return portfolioRepository.save(p);
        });

        PortfolioStock pStock = portfolioStockRepository.findByPortfolioIdAndStockId(portfolio.getId(), stock.getId())
                .orElse(PortfolioStock.builder().portfolio(portfolio).stock(stock).quantity(0).averagePrice(BigDecimal.ZERO).build());

        // Calculate new average price
        BigDecimal currentTotalValue = pStock.getAveragePrice().multiply(BigDecimal.valueOf(pStock.getQuantity()));
        BigDecimal newTotalValue = currentTotalValue.add(totalCost);
        int newQuantity = pStock.getQuantity() + request.getQuantity();
        BigDecimal newAvgPrice = newTotalValue.divide(BigDecimal.valueOf(newQuantity), 2, RoundingMode.HALF_UP);

        pStock.setQuantity(newQuantity);
        pStock.setAveragePrice(newAvgPrice);
        portfolioStockRepository.save(pStock);

        recordTransaction(user, stock, TransactionType.BUY, request.getQuantity(), stock.getCurrentPrice());
    }

    @Transactional
    public void sellStock(String username, TradeRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Stock stock = stockRepository.findBySymbol(request.getSymbol())
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        Portfolio portfolio = user.getPortfolios().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        PortfolioStock pStock = portfolioStockRepository.findByPortfolioIdAndStockId(portfolio.getId(), stock.getId())
                .orElseThrow(() -> new RuntimeException("Stock not owned in portfolio"));

        if (pStock.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock quantity");
        }

        BigDecimal totalRevenue = stock.getCurrentPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        user.setBalance(user.getBalance().add(totalRevenue));
        userRepository.save(user);

        pStock.setQuantity(pStock.getQuantity() - request.getQuantity());
        if (pStock.getQuantity() == 0) {
            portfolioStockRepository.delete(pStock);
        } else {
            portfolioStockRepository.save(pStock);
        }

        recordTransaction(user, stock, TransactionType.SELL, request.getQuantity(), stock.getCurrentPrice());
    }

    private void recordTransaction(User user, Stock stock, TransactionType type, int quantity, BigDecimal price) {
        Transaction tx = Transaction.builder()
                .user(user)
                .stock(stock)
                .type(type)
                .quantity(quantity)
                .priceAtTransaction(price)
                .timestamp(LocalDateTime.now())
                .build();
        transactionRepository.save(tx);
    }
}
