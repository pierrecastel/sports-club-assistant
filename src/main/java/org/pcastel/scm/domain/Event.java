package org.pcastel.scm.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import org.pcastel.scm.domain.enumeration.EventType;

import org.pcastel.scm.domain.enumeration.EventState;

/**
 * A Event.
 */
@Entity
@Table(name = "event")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Event implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_type", nullable = false)
    private EventType type;

    @NotNull
    @Column(name = "jhi_date", nullable = false)
    private LocalDate date;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false)
    private EventState state;

    @Column(name = "number_of_places")
    private Integer numberOfPlaces;

    @Column(name = "is_home")
    private Boolean isHome;

    @Size(max = 1000)
    @Column(name = "jhi_comment", length = 1000)
    private String comment;

    @ManyToOne
    private Team team;

    @ManyToOne
    private Location location;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "event_participant",
               joinColumns = @JoinColumn(name="events_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="participants_id", referencedColumnName="id"))
    private Set<User> participants = new HashSet<>();

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public Event title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public EventType getType() {
        return type;
    }

    public Event type(EventType type) {
        this.type = type;
        return this;
    }

    public void setType(EventType type) {
        this.type = type;
    }

    public LocalDate getDate() {
        return date;
    }

    public Event date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public EventState getState() {
        return state;
    }

    public Event state(EventState state) {
        this.state = state;
        return this;
    }

    public void setState(EventState state) {
        this.state = state;
    }

    public Integer getNumberOfPlaces() {
        return numberOfPlaces;
    }

    public Event numberOfPlaces(Integer numberOfPlaces) {
        this.numberOfPlaces = numberOfPlaces;
        return this;
    }

    public void setNumberOfPlaces(Integer numberOfPlaces) {
        this.numberOfPlaces = numberOfPlaces;
    }

    public Boolean isIsHome() {
        return isHome;
    }

    public Event isHome(Boolean isHome) {
        this.isHome = isHome;
        return this;
    }

    public void setIsHome(Boolean isHome) {
        this.isHome = isHome;
    }

    public String getComment() {
        return comment;
    }

    public Event comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Team getTeam() {
        return team;
    }

    public Event team(Team team) {
        this.team = team;
        return this;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Location getLocation() {
        return location;
    }

    public Event location(Location location) {
        this.location = location;
        return this;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Set<User> getParticipants() {
        return participants;
    }

    public Event participants(Set<User> users) {
        this.participants = users;
        return this;
    }

    public Event addParticipant(User user) {
        this.participants.add(user);
        return this;
    }

    public Event removeParticipant(User user) {
        this.participants.remove(user);
        return this;
    }

    public void setParticipants(Set<User> users) {
        this.participants = users;
    }
    // jhipster-needle-entity-add-getters-setters - Jhipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Event event = (Event) o;
        if (event.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), event.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Event{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", type='" + getType() + "'" +
            ", date='" + getDate() + "'" +
            ", state='" + getState() + "'" +
            ", numberOfPlaces='" + getNumberOfPlaces() + "'" +
            ", isHome='" + isIsHome() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
