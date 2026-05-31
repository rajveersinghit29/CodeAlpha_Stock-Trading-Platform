package com.trading.platform.repository;

import com.trading.platform.entity.PortfolioStock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PortfolioStockRepository extends JpaRepository<PortfolioStock, Long> {
    Optional<PortfolioStock> findByPortfolioIdAndStockId(Long portfolioId, Long stockId);
}
