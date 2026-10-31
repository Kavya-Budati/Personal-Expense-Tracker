package com.tt.expensetracker.controller;

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

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    /** List expenses (newest first); optional filter ?category=FOOD|TRAVEL|SHOPPING|OTHER */
    @GetMapping
    public List<Expense> list(@RequestParam(required = false) Category category) {
        return service.list(category);
    }

    /** Total spent, number of expenses and per-category totals (optional ?category= filter) */
    @GetMapping("/summary")
    public ExpenseSummary summary(@RequestParam(required = false) Category category) {
        return service.summary(category);
    }

    /** Get one expense by id */
    @GetMapping("/{id}")
    public Expense get(@PathVariable Long id) {
        return service.get(id);
    }

    /** Add a new expense */
    @PostMapping
    public ResponseEntity<Expense> create(@Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    /** Update an existing expense */
    @PutMapping("/{id}")
    public Expense update(@PathVariable Long id, @Valid @RequestBody ExpenseRequest request) {
        return service.update(id, request);
    }

    /** Delete an expense */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
