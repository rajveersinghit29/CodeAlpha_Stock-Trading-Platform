package com.trading.platform;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendApplicationTests {

    @Test
    void contextLoads() {
        // This test ensures that the Spring application context starts successfully.
        // If there is any bean creation exception, missing configuration, or database connection error,
        // this test will fail, preventing broken code from passing the CI pipeline.
    }

}
