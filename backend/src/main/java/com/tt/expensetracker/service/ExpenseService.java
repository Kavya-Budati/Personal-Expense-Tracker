package com.tt.expensetracker.service;

import com.tt.expensetracker.entity.*;
import com.tt.expensetracker.repository.*;
import com.tt.expensetracker.dto.*;
import com.tt.expensetracker.exception.*;
import com.tt.expensetracker.service.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository repository;

    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    public List<Expense> list(Category category) {
        return category == null ? repository.findAllByOrderByExpenseDateDescIdDesc()
                : repository.findByCategoryOrderByExpenseDateDescIdDesc(category);
    }

    public Expense get(Long id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Expense " + id + " not found"));
    }

    @Transactional
    public Expense create(ExpenseRequest r) {
        return repository.save(apply(new Expense(), r));
    }

    @Transactional
    public Expense update(Long id, ExpenseRequest r) {
        return repository.save(apply(get(id), r));
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(get(id));
    }

    /** total/count honour the optional category filter; grandTotal is always across all expenses. */
    public ExpenseSummary summary(Category category) {
        BigDecimal grand = repository.sumAll();
        BigDecimal total = category == null ? grand : repository.sumByCategory(category);
        long count = category == null ? repository.count() : repository.countByCategory(category);
        Map<String, BigDecimal> byCategory = new LinkedHashMap<>();
        for (Category c : Category.values()) {
            byCategory.put(c.name(), BigDecimal.ZERO.setScale(2));
        }
        for (Object[] row : repository.totalsByCategory()) {
            byCategory.put(((Category) row[0]).name(), (BigDecimal) row[1]);
        }
        return new ExpenseSummary(total, count, grand, byCategory);
    }

    private Expense apply(Expense e, ExpenseRequest r) {
        e.setTitle(r.title().trim());
        e.setAmount(r.amount());
        e.setCategory(r.category());
        e.setExpenseDate(r.date());
        return e;
    }
}
