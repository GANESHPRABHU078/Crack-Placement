package com.placementos.backend.repository;

import com.placementos.backend.entity.InterviewExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewExperienceRepository extends JpaRepository<InterviewExperience, Long> {
    List<InterviewExperience> findByCompany(String company);
}
