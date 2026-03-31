package com.placementos.backend.repository;

import com.placementos.backend.entity.CompanyPrepProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyPrepProfileRepository extends JpaRepository<CompanyPrepProfile, Long> {
    List<CompanyPrepProfile> findAllByOrderByDisplayOrderAscCompanyAsc();
    Optional<CompanyPrepProfile> findByCompanyIgnoreCase(String company);
}
