package com.placementos.backend.repository;

import com.placementos.backend.entity.DeveloperProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DeveloperProfileRepository extends JpaRepository<DeveloperProfile, Long> {
    Optional<DeveloperProfile> findByUserId(Long userId);
}
