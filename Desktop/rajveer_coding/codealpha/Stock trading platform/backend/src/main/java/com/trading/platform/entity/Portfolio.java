package com.trading.platform.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "portfolios")
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PortfolioStock> stocks = new ArrayList<>();

    public Portfolio() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<PortfolioStock> getStocks() { return stocks; }
    public void setStocks(List<PortfolioStock> stocks) { this.stocks = stocks; }

    public static PortfolioBuilder builder() {
        return new PortfolioBuilder();
    }

    public static class PortfolioBuilder {
        private User user;
        private String name;

        public PortfolioBuilder user(User user) { this.user = user; return this; }
        public PortfolioBuilder name(String name) { this.name = name; return this; }

        public Portfolio build() {
            Portfolio p = new Portfolio();
            p.setUser(user);
            p.setName(name);
            return p;
        }
    }
}
