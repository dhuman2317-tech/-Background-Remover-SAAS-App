package in.bushansirgur.removebg.controller; // Fix: wrong package

import in.bushansirgur.removebg.dto.UserDTO;
import in.bushansirgur.removebg.response.RemoveBgResponse;
import in.bushansirgur.removebg.service.RemoveBackgroundService;
import in.bushansirgur.removebg.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final RemoveBackgroundService removeBackgroundService;
    private final UserService userService;

    @PostMapping("/remove-background")
    public ResponseEntity<?> removeBackground(@RequestParam("file") MultipartFile file,
                                              Authentication authentication) {

        Map<String, Object> responseMap = new HashMap<>();

        try {
            // Fix 1: null check BEFORE .getName() call, and guard authentication itself
            if (authentication == null || authentication.getName() == null || authentication.getName().isEmpty()) {
                RemoveBgResponse response = RemoveBgResponse.builder()
                        .statusCode(HttpStatus.FORBIDDEN)
                        .success(false)
                        .data("User does not have permission/access to this resource")
                        .build();
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            UserDTO userDTO = userService.getUserByClerkId(authentication.getName());

            // Fix 2: guard against null userDTO before accessing its fields
            if (userDTO == null) {
                RemoveBgResponse response = RemoveBgResponse.builder()
                        .statusCode(HttpStatus.NOT_FOUND)
                        .success(false)
                        .data("User not found")
                        .build();
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // Fix 3: use Integer-safe null check before comparing credits
            if (userDTO.getCredits() == null || userDTO.getCredits() == 0) {
                responseMap.put("message", "No credit balance");
                responseMap.put("creditBalance", userDTO.getCredits());
                RemoveBgResponse response = RemoveBgResponse.builder() // Fix 4: assign builder result to variable
                        .success(false)
                        .data(responseMap)
                        .statusCode(HttpStatus.OK)
                        .build();
                return ResponseEntity.ok(response); // Fix 5: return the built response, not null
            }

            byte[] imageBytes = removeBackgroundService.removeBackground(file);

            // Fix 6: guard against empty/null result from the background removal service
            if (imageBytes == null || imageBytes.length == 0) {
                RemoveBgResponse response = RemoveBgResponse.builder()
                        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                        .success(false)
                        .data("Background removal failed: no image data returned")
                        .build();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

            String base64Image = Base64.getEncoder().encodeToString(imageBytes); // Fix 7: typo "based64Image"

            // Fix 8: deduct credits AFTER confirming service succeeded, not before checking result
            userDTO.setCredits(userDTO.getCredits() - 1);
            userService.saveUser(userDTO);

            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(base64Image);

        } catch (Exception ex) {
            RemoveBgResponse response = RemoveBgResponse.builder()
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .success(false)
                    .data("Something went wrong: " + ex.getMessage()) // Fix 9: include error message for traceability
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}