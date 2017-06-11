package org.pcastel.scm.service;

import com.flickr4java.flickr.Flickr;
import com.flickr4java.flickr.FlickrException;
import com.flickr4java.flickr.REST;
import com.flickr4java.flickr.uploader.UploadMetaData;
import org.imgscalr.Scalr;
import org.pcastel.scm.config.Constants;
import org.pcastel.scm.domain.Authority;
import org.pcastel.scm.domain.Member;
import org.pcastel.scm.domain.User;
import org.pcastel.scm.repository.AuthorityRepository;
import org.pcastel.scm.repository.MemberRepository;
import org.pcastel.scm.repository.UserRepository;
import org.pcastel.scm.security.AuthoritiesConstants;
import org.pcastel.scm.security.SecurityUtils;
import org.pcastel.scm.service.dto.UserDTO;
import org.pcastel.scm.service.mapper.MemberMapper;
import org.pcastel.scm.service.util.RandomUtil;
import org.pcastel.scm.web.rest.errors.CustomParameterizedException;
import org.pcastel.scm.web.rest.vm.ManagedUserVM;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.lang.StrictMath.min;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private static final int IMG_DIMENSION = 300;
    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthorityRepository authorityRepository;

    private final MemberRepository memberRepository;

    private final MemberMapper memberMapper;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthorityRepository authorityRepository
        , MemberRepository memberRepository, MemberMapper memberMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
        this.memberRepository = memberRepository;
        this.memberMapper = memberMapper;
    }

    public Optional<User> activateRegistration(String key) {
        log.debug("Activating user for activation key {}", key);
        return userRepository.findOneByActivationKey(key)
            .map(user -> {
                // activate given user for the registration key.
                user.setActivated(true);
                user.setActivationKey(null);
                log.debug("Activated user: {}", user);
                return user;
            });
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
        log.debug("Reset user password for reset key {}", key);

        return userRepository.findOneByResetKey(key)
            .filter(user -> user.getResetDate().isAfter(Instant.now().minusSeconds(86400)))
            .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(null);
                return user;
            });
    }

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository.findOneByEmail(mail)
            .filter(User::getActivated)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(Instant.now());
                return user;
            });
    }

    public User createUser(String login, String password, String firstName, String lastName, String email,
                           String imageUrl, String langKey, String phoneNumber) {

        User newUser = new User();
        Authority authority = authorityRepository.findOne(AuthoritiesConstants.USER);
        Set<Authority> authorities = new HashSet<>();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setLogin(login);
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(firstName);
        newUser.setLastName(lastName);
        newUser.setEmail(email);
        newUser.setImageUrl(imageUrl);
        newUser.setLangKey(langKey);
        // new user is not active
        newUser.setActivated(false);
        // new user gets registration key
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        authorities.add(authority);
        newUser.setAuthorities(authorities);
        final User createdUser = userRepository.save(newUser);
        log.debug("Created Information for User: {}", newUser);

        // Create and save the UserExtra entity
        final Member newMember = new Member();
        newMember.setUser(createdUser);
        newMember.setPhoneNumber(phoneNumber);
        memberRepository.save(newMember);
        log.debug("Created Information for Member: {}", newMember);

        return newUser;
    }

    public User createUser(ManagedUserVM managedUserVM) {
        User user = new User();
        user.setLogin(managedUserVM.getLogin());
        user.setFirstName(managedUserVM.getFirstName());
        user.setLastName(managedUserVM.getLastName());
        user.setEmail(managedUserVM.getEmail());
        user.setImageUrl(managedUserVM.getImageUrl());
        if (managedUserVM.getLangKey() == null) {
            user.setLangKey("fr"); // default language
        } else {
            user.setLangKey(managedUserVM.getLangKey());
        }
        if (managedUserVM.getAuthorities() != null) {
            Set<Authority> authorities = new HashSet<>();
            managedUserVM.getAuthorities().forEach(
                authority -> authorities.add(authorityRepository.findOne(authority))
            );
            user.setAuthorities(authorities);
        }
        String encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(Instant.now());
        user.setActivated(true);
        userRepository.save(user);
        log.debug("Created Information for User: {}", user);

        // Create and save the UserExtra entity
        updateMember(managedUserVM, user);

        return user;
    }

    /**
     * Update basic information for the current user.
     *
     * @param managedUserVM the managed user vm
     */
    public void updateCurrentUser(ManagedUserVM managedUserVM) {
        userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).ifPresent(user -> {
            user.setFirstName(managedUserVM.getFirstName());
            user.setLastName(managedUserVM.getLastName());
            user.setEmail(managedUserVM.getEmail());
            user.setLangKey(managedUserVM.getLangKey());
            user.setImageUrl(managedUserVM.getImageUrl());
            log.debug("Changed Information for User: {}", user);


            // Save Photo to Flickr
//            savePhotoToFlickr(managedUserVM);

            // Create and save the UserExtra entity
            updateMember(managedUserVM, user);
        });
    }

    private void savePhotoToFlickr(ManagedUserVM managedUserVM) {
        final String apiKey = "f49282b95fa7192df773a0f816b42676";
        final String sharedSecret = "c00a01afe025e5da";
        final Flickr flickr = new Flickr(apiKey, sharedSecret, new REST());
        try {
            final UploadMetaData metaData = new UploadMetaData();
            metaData.setContentType(Flickr.CONTENTTYPE_PHOTO);
            metaData.setHidden(true);
            metaData.setPublicFlag(false);
            metaData.setFilename(managedUserVM.getFirstName() + "_" + managedUserVM.getLastName());
            flickr.getUploader().upload(managedUserVM.getPhoto(), metaData);
        } catch (FlickrException e) {
            log.error(e.getErrorMessage(), e);
            final Map<String, String> myMap = new HashMap<>();
            myMap.put(e.getErrorCode(), e.getErrorMessage());
            throw new CustomParameterizedException("unable to upload to flickr", myMap);
        }
    }

    /**
     * Update all information for a specific user, and return the modified user.
     *
     * @param managedUserVM user to update
     * @return updated user
     */
    public Optional<ManagedUserVM> updateUser(ManagedUserVM managedUserVM) {
        return Optional.of(userRepository
            .findOne(managedUserVM.getId()))
            .map(user -> {
                user.setLogin(managedUserVM.getLogin());
                user.setFirstName(managedUserVM.getFirstName());
                user.setLastName(managedUserVM.getLastName());
                user.setEmail(managedUserVM.getEmail());
                user.setImageUrl(managedUserVM.getImageUrl());
                user.setActivated(managedUserVM.isActivated());
                user.setLangKey(managedUserVM.getLangKey());
                Set<Authority> managedAuthorities = user.getAuthorities();
                managedAuthorities.clear();
                managedUserVM.getAuthorities().stream()
                    .map(authorityRepository::findOne)
                    .forEach(managedAuthorities::add);
                return user;
            })
            .map(updateMemberAndMapToManagedUserVm(managedUserVM));
    }

    private Function<User, ManagedUserVM> updateMemberAndMapToManagedUserVm(ManagedUserVM managedUserVM) {
        return u -> {
            final Member newMember = updateMember(managedUserVM, u);
            ManagedUserVM newManagedUserVM = new ManagedUserVM(new UserDTO(u), memberMapper.toDto(newMember));
            log.debug("Changed Information for User: {}", newManagedUserVM);
            return newManagedUserVM;
        };
    }

    private Member updateMember(ManagedUserVM managedUserVM, User user) {
        final Member member = Optional.of(memberRepository
            .findOne(user.getId()))
            .orElseGet(Member::new);
        member.setUser(user);
        member.setPhoneNumber(managedUserVM.getPhoneNumber());

        final byte[] resizeImageInByte = resizePhoto(managedUserVM);
        member.setPhoto(resizeImageInByte);

        memberRepository.save(member);
        log.debug("Created Information for Member: {}", member);
        return member;
    }

    private byte[] resizePhoto(ManagedUserVM managedUserVM) {
        byte[] resizeImageInByte = null;

        try {
            //transform byte array into buffered image
            final InputStream in = new ByteArrayInputStream(managedUserVM.getPhoto());
            final BufferedImage originalImage = ImageIO.read(in);


            // TODO test à supprimer
            ImageIO.write(originalImage, "jpg", new File(
                "c:/test_tmp/original.jpg"));

            //resize and optimize
            final int type = originalImage.getType() == 0 ? BufferedImage.TYPE_INT_ARGB : originalImage.getType();
            final BufferedImage resizeImageJpg = resizeImage(originalImage, type);

            // TODO test à supprimer
            ImageIO.write(resizeImageJpg, "jpg", new File(
                "c:/test_tmp/resized.jpg"));

            final BufferedImage scaledImage = Scalr.resize(originalImage, 200);

            // TODO test à supprimer
            ImageIO.write(scaledImage, "jpg", new File(
                "c:/test_tmp/scaledImage.jpg"));

            //rewrite image in byte array
            final ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(resizeImageJpg, "jpg", baos);
            baos.flush();
            resizeImageInByte = baos.toByteArray();
            baos.close();

        } catch (IOException e) {
            // TODO log
            e.printStackTrace();
        }
        return resizeImageInByte;
    }


    private static BufferedImage resizeImage(final BufferedImage originalImage, final int type) {
        final int height = originalImage.getHeight();
        final int width = originalImage.getWidth();
        final int maxSize = min(height, width);
        final int x = (width - maxSize) / 2;
        final int y = (height - maxSize) / 2;

        final BufferedImage cropImage = originalImage.getSubimage(x, y, maxSize, maxSize);
        final BufferedImage resizedImage = new BufferedImage(IMG_DIMENSION, IMG_DIMENSION, type);
        final Graphics2D graphics = resizedImage.createGraphics();
        graphics.drawImage(cropImage, 0, 0, IMG_DIMENSION, IMG_DIMENSION, null);
        graphics.dispose();
        graphics.setComposite(AlphaComposite.Src);

        graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        return resizedImage;
    }

    public void deleteUser(String login) {
        userRepository.findOneByLogin(login).ifPresent(user -> {
            memberRepository.delete(user.getId());
            userRepository.delete(user);
            log.debug("Deleted User: {}", user);
        });
    }

    public void changePassword(String password) {
        userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()).ifPresent(user -> {
            String encryptedPassword = passwordEncoder.encode(password);
            user.setPassword(encryptedPassword);
            log.debug("Changed password for User: {}", user);
        });
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAllByLoginNot(pageable, Constants.ANONYMOUS_USER).map(UserDTO::new);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneWithAuthoritiesByLogin(login);
    }

    @Transactional(readOnly = true)
    public User getUserWithAuthorities(Long id) {
        return userRepository.findOneWithAuthoritiesById(id);
    }

    @Transactional(readOnly = true)
    public User getUserWithAuthorities() {
        return userRepository.findOneWithAuthoritiesByLogin(SecurityUtils.getCurrentUserLogin()).orElse(null);
    }


    /**
     * Not activated users should be automatically deleted after 3 days.
     * <p>
     * This is scheduled to get fired everyday, at 01:00 (am).
     * </p>
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void removeNotActivatedUsers() {
        List<User> users = userRepository.findAllByActivatedIsFalseAndCreatedDateBefore(Instant.now().minus(3, ChronoUnit.DAYS));
        for (User user : users) {
            log.debug("Deleting not activated user {}", user.getLogin());
            memberRepository.delete(user.getId());
            userRepository.delete(user);
        }
    }

    /**
     * @return a list of all the authorities
     */
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).collect(Collectors.toList());
    }
}
