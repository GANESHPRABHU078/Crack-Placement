package com.placementos.backend.repository;

import com.placementos.backend.entity.User;
import com.placementos.backend.entity.ProjectIdea;
import com.placementos.backend.entity.UserProjectProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserProjectProgressRepository extends JpaRepository<UserProjectProgress, Long> {
    List<UserProjectProgress> findByUser(User user);
    Optional<UserProjectProgress> findByUserAndProjectIdea(User user, ProjectIdea projectIdea);
}
