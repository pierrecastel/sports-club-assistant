package org.pcastel.scm.service.impl;

import org.pcastel.scm.service.MemberService;
import org.pcastel.scm.domain.Member;
import org.pcastel.scm.repository.MemberRepository;
import org.pcastel.scm.service.dto.MemberDTO;
import org.pcastel.scm.service.mapper.MemberMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing Member.
 */
@Service
@Transactional
public class MemberServiceImpl implements MemberService{

    private final Logger log = LoggerFactory.getLogger(MemberServiceImpl.class);

    private final MemberRepository memberRepository;

    private final MemberMapper memberMapper;

    public MemberServiceImpl(MemberRepository memberRepository, MemberMapper memberMapper) {
        this.memberRepository = memberRepository;
        this.memberMapper = memberMapper;
    }

    /**
     * Save a member.
     *
     * @param memberDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public MemberDTO save(MemberDTO memberDTO) {
        log.debug("Request to save Member : {}", memberDTO);
        Member member = memberMapper.toEntity(memberDTO);
        member = memberRepository.save(member);
        return memberMapper.toDto(member);
    }

    /**
     *  Get all the members.
     *
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<MemberDTO> findAll() {
        log.debug("Request to get all Members");
        return memberRepository.findAll().stream()
            .map(memberMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     *  Get one member by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public MemberDTO findOne(Long id) {
        log.debug("Request to get Member : {}", id);
        Member member = memberRepository.findOne(id);
        return memberMapper.toDto(member);
    }

    /**
     *  Delete the  member by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Member : {}", id);
        memberRepository.delete(id);
    }
}
