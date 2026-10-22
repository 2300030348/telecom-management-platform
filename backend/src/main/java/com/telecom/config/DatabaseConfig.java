package com.telecom.config;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (dbUrl == null || dbUrl.trim().isEmpty()) {
            dbUrl = System.getenv("DATABASE_URL");
        }

        if (dbUrl != null && !dbUrl.trim().isEmpty()) {
            dbUrl = dbUrl.trim();
            // Render / Heroku postgres URL handling (postgres:// or postgresql://)
            if (dbUrl.startsWith("postgres://") || (dbUrl.startsWith("postgresql://") && !dbUrl.startsWith("jdbc:"))) {
                try {
                    String cleanUrl = dbUrl.replace("postgres://", "http://").replace("postgresql://", "http://");
                    URI dbUri = new URI(cleanUrl);
                    String username = null;
                    String password = null;
                    if (dbUri.getUserInfo() != null) {
                        String[] userInfo = dbUri.getUserInfo().split(":", 2);
                        username = userInfo[0];
                        if (userInfo.length > 1) {
                            password = userInfo[1];
                        }
                    }

                    int port = dbUri.getPort() == -1 ? 5432 : dbUri.getPort();
                    String jdbcUrl = "jdbc:postgresql://" + dbUri.getHost() + ":" + port + dbUri.getPath();

                    properties.setUrl(jdbcUrl);
                    properties.setDriverClassName("org.postgresql.Driver");
                    if (username != null) properties.setUsername(username);
                    if (password != null) properties.setPassword(password);
                } catch (Exception e) {
                    System.err.println("Failed to parse cloud database URI: " + e.getMessage());
                }
            } else if (dbUrl.startsWith("jdbc:")) {
                properties.setUrl(dbUrl);
            }
        }

        return properties.initializeDataSourceBuilder().build();
    }
}
