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
    default Location fromId(Long id) {
        if (id == null) {
            return null;
        }
        Location location = new Location();
        location.setId(id);
        return location;
    }
}
