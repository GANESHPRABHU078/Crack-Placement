package com.placementos.backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:}")
    private String dbUrl;

    @Value("${spring.datasource.username:}")
    private String dbUsername;

    @Value("${spring.datasource.password:}")
    private String dbPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        // Prefer the DB_URL environment variable if present (Render often injects this)
        String envDbUrl = System.getenv("DB_URL");
        String actualUrl = (envDbUrl != null && !envDbUrl.isBlank()) ? envDbUrl : dbUrl;

        log.info("Initializing DataSource. URL present: {}", (actualUrl != null && !actualUrl.isBlank()));

        try {
            if (actualUrl != null && actualUrl.startsWith("postgres://")) {
                log.info("Detected postgres:// URL. Converting to jdbc:postgresql://");
                URI dbUri = new URI(actualUrl);
                String username = dbUri.getUserInfo().split(":")[0];
                String password = dbUri.getUserInfo().split(":")[1];
                String jdbcUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + 
                                 (dbUri.getPort() != -1 ? dbUri.getPort() : 5432) + 
                                 dbUri.getPath() + "?sslmode=prefer";
                
                config.setJdbcUrl(jdbcUrl);
                config.setUsername(username);
                config.setPassword(password);
                config.setDriverClassName("org.postgresql.Driver");
            } else if (actualUrl != null && actualUrl.startsWith("mysql://")) {
                log.info("Detected mysql:// URL. Converting to jdbc:mysql://");
                URI dbUri = new URI(actualUrl);
                String username = dbUri.getUserInfo().split(":")[0];
                Matcher matcher = Pattern.compile("mysql://([^:]+):([^@]+)@([^:]+):(\\d+)/(.*)").matcher(actualUrl);
                if (matcher.matches()) {
                    String dbAndParams = matcher.group(5).replace("ssl-mode", "sslMode");
                    if (!dbAndParams.contains("sessionVariables=sql_require_primary_key=0")) {
                        dbAndParams += (dbAndParams.contains("?") ? "&" : "?") + "sessionVariables=sql_require_primary_key=0";
                    }
                    String jdbcUrl = String.format("jdbc:mysql://%s:%s/%s", matcher.group(3), matcher.group(4), dbAndParams);
                    log.info("Converted JDBC URL: {}", jdbcUrl);
                    config.setJdbcUrl(jdbcUrl);
                    config.setUsername(matcher.group(1));
                    config.setPassword(matcher.group(2));
                    config.setDriverClassName("com.mysql.cj.jdbc.Driver");
                } else {
                    config.setJdbcUrl(actualUrl);
                    config.setUsername(dbUsername);
                    config.setPassword(dbPassword);
                }
            } else {
                log.info("Using standard JDBC URL configuration.");
                config.setJdbcUrl(actualUrl);
                config.setUsername(dbUsername);
                config.setPassword(dbPassword);
            }
        } catch (Exception e) {
            log.error("Failed to parse database URL", e);
            // Fallback to whatever was provided
            config.setJdbcUrl(actualUrl);
            config.setUsername(dbUsername);
            config.setPassword(dbPassword);
        }

        // Add some basic HikariCP optimizations for small containers
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(20000); // 20 seconds
        config.setIdleTimeout(300000); // 5 minutes
        
        return new HikariDataSource(config);
    }
}
