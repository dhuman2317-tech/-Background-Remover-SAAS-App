package in.bushansirgur.removebg.service.impl;

import in.bushansirgur.removebg.dto.UserDTO;
import in.bushansirgur.removebg.entity.UserEntity;
import in.bushansirgur.removebg.repository.UserRepository;
import in.bushansirgur.removebg.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDTO saveUser(UserDTO userDTO) {
        Optional<UserEntity> optionalUser = userRepository.findByClerkId(userDTO.getClerkId());

        if (optionalUser.isEmpty()) {
            optionalUser = userRepository.findByEmail(userDTO.getEmail());
        }

        if (optionalUser.isPresent()) {
            UserEntity existingUser = optionalUser.get();
            existingUser.setEmail(userDTO.getEmail());
            existingUser.setFirstName(userDTO.getFirstName());
            existingUser.setLastName(userDTO.getLastName());
            existingUser.setPhotoUrl(userDTO.getPhotoUrl());
            if (userDTO.getCredits() != null) {
                existingUser.setCredits(userDTO.getCredits());
            }
            return mapToDTO(userRepository.save(existingUser));
        }

        UserEntity newUser = mapToEntity(userDTO);
        userRepository.save(newUser);
        return mapToDTO(newUser);
    }

    @Override
    public void deleteUserByClerkId(String clerkId) {
       UserEntity userEntity = userRepository.findByClerkId(clerkId)
               .orElseThrow(() -> new UsernameNotFoundException("User not found"));
       userRepository.delete(userEntity);
    }

    @Override
    public UserDTO getUserByClerkId(String clerkId) {
        UserEntity user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("User not found with clerkId: " + clerkId));
        return mapToDTO(user);
    }

    private UserDTO mapToDTO(UserEntity user) {
        return UserDTO.builder()
                .clerkId(user.getClerkId())
                .credits(user.getCredits())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    private UserEntity mapToEntity(UserDTO userDTO) {
        return UserEntity.builder()
                .clerkId(userDTO.getClerkId())
                .email(userDTO.getEmail())
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
                .photoUrl(userDTO.getPhotoUrl())
                .build();
    }
}
