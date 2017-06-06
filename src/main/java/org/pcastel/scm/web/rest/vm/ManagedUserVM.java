package org.pcastel.scm.web.rest.vm;

import org.pcastel.scm.service.dto.MemberDTO;
import org.pcastel.scm.service.dto.UserDTO;

import javax.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

/**
 * View Model extending the UserDTO, which is meant to be used in the user management UI.
 */
public class ManagedUserVM extends UserDTO {

    public static final int PASSWORD_MIN_LENGTH = 4;

    public static final int PASSWORD_MAX_LENGTH = 100;

    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    private String password;

    private String phoneNumber;
    private String mobilePhoneNumber;
    private byte[] photo;
    private String photoContentType;
    private LocalDate birthDate;
    private String job;
    private Boolean showInfo;
    private Long addressId;


    public ManagedUserVM() {
        // Empty constructor needed for Jackson.
    }

    public ManagedUserVM(Long id, String login, String password, String firstName, String lastName,
                         String email, String phoneNumber, boolean activated, String imageUrl, String langKey,
                         String createdBy, Instant createdDate, String lastModifiedBy, Instant lastModifiedDate,
                         Set<String> authorities) {
        this(id, login, password, firstName, lastName, email, phoneNumber, null, null, null, null, null, null,
            null, activated, imageUrl, langKey, createdBy, createdDate, lastModifiedBy, lastModifiedDate,
            authorities);
    }

    public ManagedUserVM(Long id, String login, String password, String firstName, String lastName, String email,
                         String phoneNumber, String mobilePhoneNumber, byte[] photo, String photoContentType,
                         LocalDate birthDate, String job, Boolean showInfo, Long addressId, boolean activated,
                         String imageUrl, String langKey, String createdBy, Instant createdDate,
                         String lastModifiedBy, Instant lastModifiedDate,
                         Set<String> authorities) {


        super(id, login, firstName, lastName, email, activated, imageUrl, langKey,
            createdBy, createdDate, lastModifiedBy, lastModifiedDate, authorities);

        this.password = password;
        this.phoneNumber = phoneNumber;
        this.mobilePhoneNumber = mobilePhoneNumber;
        this.photo = photo;
        this.photoContentType = photoContentType;
        this.birthDate = birthDate;
        this.job = job;
        this.showInfo = showInfo;
        this.addressId = addressId;

    }

    public ManagedUserVM(UserDTO userDTO, MemberDTO memberDTO) {
        this(userDTO.getId(), userDTO.getLogin(), null, userDTO.getFirstName(), userDTO.getLastName(),
            userDTO.getEmail(), memberDTO.getPhoneNumber(), memberDTO.getMobilePhoneNumber(), memberDTO.getPhoto(),
            memberDTO.getPhotoContentType(), memberDTO.getBirthDate(), memberDTO.getJob(), memberDTO.isShowInfo(),
            memberDTO.getAddressId(), userDTO.isActivated(), userDTO.getImageUrl(), userDTO.getLangKey(),
            userDTO.getCreatedBy(), userDTO.getCreatedDate(), userDTO.getLastModifiedBy(),
            userDTO.getLastModifiedDate(), userDTO.getAuthorities());
    }

    public String getPassword() {
        return password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }


    public String getMobilePhoneNumber() {
        return mobilePhoneNumber;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public String getPhotoContentType() {
        return photoContentType;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public String getJob() {
        return job;
    }

    public Boolean getShowInfo() {
        return showInfo;
    }

    public Long getAddressId() {
        return addressId;
    }

    @Override
    public String toString() {
        return "ManagedUserVM{" +
            "} " + super.toString();
    }
}
