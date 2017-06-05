package org.pcastel.scm.service.mapper;

import org.pcastel.scm.domain.*;
import org.pcastel.scm.service.dto.LocationDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Location and its DTO LocationDTO.
 */
@Mapper(componentModel = "spring", uses = {AddressMapper.class, })
public interface LocationMapper extends EntityMapper <LocationDTO, Location> {
    @Mapping(source = "address.id", target = "addressId")
    LocationDTO toDto(Location location); 
    @Mapping(source = "addressId", target = "address")
    Location toEntity(LocationDTO locationDTO); 
    /**
     * generating the fromId for all mappers if the databaseType is sql, as the class has relationship to it might need it, instead of
     * creating a new attribute to know if the entity has any relationship from some other entity
     *
     * @param id id of the entity
     * @return the entity instance
     */
     
    default Location fromId(Long id) {
        if (id == null) {
            return null;
        }
        Location location = new Location();
        location.setId(id);
        return location;
    }
}
