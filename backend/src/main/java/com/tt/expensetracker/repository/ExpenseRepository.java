package com.tt.expensetracker.repository;

import com.tt.expensetracker.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findAllByOrderByExpenseDateDescIdDesc();

    List<Expense> findByCategoryOrderByExpenseDateDescIdDesc(Category category);

    long countByCategory(Category category);

    @Query("select coalesce(sum(e.amount), 0) from Expense e")
    BigDecimal sumAll();

    @Query("select coalesce(sum(e.amount), 0) from Expense e where e.category = :category")
    BigDecimal sumByCategory(@Param("category") Category category);

    @Query("select e.category, sum(e.amount) from Expense e group by e.category")
    List<Object[]> totalsByCategory();
}
