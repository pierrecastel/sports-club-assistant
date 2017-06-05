package org.pcastel.scm.service.mapper;

import org.pcastel.scm.domain.*;
import org.pcastel.scm.service.dto.MemberDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Member and its DTO MemberDTO.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class, AddressMapper.class, })
public interface MemberMapper extends EntityMapper <MemberDTO, Member> {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "address.id", target = "addressId")
    MemberDTO toDto(Member member); 
    @Mapping(source = "userId", target = "user")
    @Mapping(source = "addressId", target = "address")
    Member toEntity(MemberDTO memberDTO); 
    /**
     * generating the fromId for all mappers if the databaseType is sql, as the class has relationship to it might need it, instead of
     * creating a new attribute to know if the entity has any relationship from some other entity
     *
     * @param id id of the entity
     * @return the entity instance
     */
     
    default Member fromId(Long id) {
        if (id == null) {
            return null;
        }
        Member member = new Member();
        member.setId(id);
        return member;
    }
}
