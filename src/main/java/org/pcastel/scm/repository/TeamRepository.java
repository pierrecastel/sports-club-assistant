package org.pcastel.scm.repository;

import org.pcastel.scm.domain.Team;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the Team entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    @Query("select team from Team team where team.manager.login = ?#{principal.username}")
    List<Team> findByManagerIsCurrentUser();

    @Query("select team from Team team where team.substitute.login = ?#{principal.username}")
    List<Team> findBySubstituteIsCurrentUser();
    @Query("select distinct team from Team team left join fetch team.members")
    List<Team> findAllWithEagerRelationships();

    @Query("select team from Team team left join fetch team.members where team.id =:id")
    Team findOneWithEagerRelationships(@Param("id") Long id);

}
