package org.pcastel.scm.service.mapper;

import org.pcastel.scm.domain.*;
import org.pcastel.scm.service.dto.TeamDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Team and its DTO TeamDTO.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class, })
public interface TeamMapper extends EntityMapper <TeamDTO, Team> {

    @Mapping(source = "manager.id", target = "managerId")

    @Mapping(source = "substitute.id", target = "substituteId")
    TeamDTO toDto(Team team); 

    @Mapping(source = "managerId", target = "manager")

    @Mapping(source = "substituteId", target = "substitute")
    Team toEntity(TeamDTO teamDTO); 
    default Team fromId(Long id) {
        if (id == null) {
            return null;
        }
        Team team = new Team();
        team.setId(id);
        return team;
    }
}
