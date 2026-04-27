package in.bushansirgur.removebg.service;

import in.bushansirgur.removebg.dto.UserDTO;

public interface UserService {

    UserDTO saveUser(UserDTO userDTO);

    void deleteUserByClerkId(String clerkId);

    UserDTO getUserByClerkId(String clerkId);
}
