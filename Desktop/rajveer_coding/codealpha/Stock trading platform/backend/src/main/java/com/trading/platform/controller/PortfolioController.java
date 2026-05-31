package com.trading.platform.controller;

import com.trading.platform.dto.PortfolioDTO;
import com.trading.platform.entity.Portfolio;
import com.trading.platform.entity.PortfolioStock;
import com.trading.platform.entity.User;
import com.trading.platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final UserRepository userRepository;

    public PortfolioController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<PortfolioDTO> getPortfolio(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        PortfolioDTO dto = new PortfolioDTO();
        dto.setCashBalance(user.getBalance());

        BigDecimal totalValue = BigDecimal.ZERO;
        List<PortfolioDTO.PortfolioItemDTO> items = new ArrayList<>();

        List<Portfolio> portfolios = user.getPortfolios();
        if (portfolios != null && !portfolios.isEmpty()) {
            Portfolio portfolio = portfolios.get(0);
            List<PortfolioStock> stocks = portfolio.getStocks();
            if (stocks != null) {
                for (PortfolioStock ps : stocks) {
                    PortfolioDTO.PortfolioItemDTO item = new PortfolioDTO.PortfolioItemDTO();
                    item.setSymbol(ps.getStock().getSymbol());
                    item.setName(ps.getStock().getName());
                    item.setQuantity(ps.getQuantity());
                    item.setAveragePrice(ps.getAveragePrice());
                    item.setCurrentPrice(ps.getStock().getCurrentPrice());

                    BigDecimal value = ps.getStock().getCurrentPrice().multiply(BigDecimal.valueOf(ps.getQuantity()));
                    item.setTotalValue(value);
                    totalValue = totalValue.add(value);

                    BigDecimal costBasis = ps.getAveragePrice().multiply(BigDecimal.valueOf(ps.getQuantity()));
                    BigDecimal pl = value.subtract(costBasis);
                    item.setUnrealizedPl(pl);

                    if (costBasis.compareTo(BigDecimal.ZERO) > 0) {
                        double pct = pl.divide(costBasis, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
                        item.setPlPercentage(pct);
                    } else {
                        item.setPlPercentage(0);
                    }

                    items.add(item);
                }
            }
        }

        dto.setTotalPortfolioValue(totalValue.add(user.getBalance()));
        dto.setHoldings(items);

        return ResponseEntity.ok(dto);
    }
}
