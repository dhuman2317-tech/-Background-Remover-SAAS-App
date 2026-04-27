package in.bushansirgur.removebg.repository;

import in.bushansirgur.removebg.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByClerkId(String clerkId);

    boolean existsByClerkId(String clerkId);

    Optional<UserEntity> findByEmail(String email);
}
