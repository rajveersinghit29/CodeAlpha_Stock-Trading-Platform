package com.trading.platform.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private BigDecimal priceAtTransaction;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public Transaction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Stock getStock() { return stock; }
    public void setStock(Stock stock) { this.stock = stock; }
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getPriceAtTransaction() { return priceAtTransaction; }
    public void setPriceAtTransaction(BigDecimal priceAtTransaction) { this.priceAtTransaction = priceAtTransaction; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public static TransactionBuilder builder() {
        return new TransactionBuilder();
    }

    public static class TransactionBuilder {
        private User user;
        private Stock stock;
        private TransactionType type;
        private Integer quantity;
        private BigDecimal priceAtTransaction;
        private LocalDateTime timestamp;

        public TransactionBuilder user(User user) { this.user = user; return this; }
        public TransactionBuilder stock(Stock stock) { this.stock = stock; return this; }
        public TransactionBuilder type(TransactionType type) { this.type = type; return this; }
        public TransactionBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public TransactionBuilder priceAtTransaction(BigDecimal priceAtTransaction) { this.priceAtTransaction = priceAtTransaction; return this; }
        public TransactionBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public Transaction build() {
            Transaction t = new Transaction();
            t.setUser(user);
            t.setStock(stock);
            t.setType(type);
            t.setQuantity(quantity);
            t.setPriceAtTransaction(priceAtTransaction);
            t.setTimestamp(timestamp);
            return t;
        }
    }
}
