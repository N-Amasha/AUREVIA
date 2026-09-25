package com.aurevia.menu.repository;

import com.aurevia.menu.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MenuRepository extends JpaRepository<Menu, Integer> {

    Optional<Menu> findByMenuNameIgnoreCase(String menuName);

    List<Menu> findByStatusIgnoreCase(String status);

    List<Menu> findByMenuTypeIgnoreCaseAndStatusIgnoreCase(
            String menuType,
            String status
    );
}