package org.pcastel.scm.service.mapper;

import org.pcastel.scm.domain.*;
import org.pcastel.scm.service.dto.EventDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Event and its DTO EventDTO.
 */
@Mapper(componentModel = "spring", uses = {TeamMapper.class, LocationMapper.class, UserMapper.class, })
public interface EventMapper extends EntityMapper <EventDTO, Event> {

    @Mapping(source = "team.id", target = "teamId")

    @Mapping(source = "location.id", target = "locationId")
    EventDTO toDto(Event event); 

    @Mapping(source = "teamId", target = "team")

    @Mapping(source = "locationId", target = "location")
    Event toEntity(EventDTO eventDTO); 
    default Event fromId(Long id) {
        if (id == null) {
            return null;
        }
        Event event = new Event();
        event.setId(id);
        return event;
    }
}
