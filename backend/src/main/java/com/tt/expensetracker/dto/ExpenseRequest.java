package com.tt.expensetracker.dto;

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

public record ExpenseRequest(
        @NotBlank(message = "Title is required") @Size(max = 120, message = "Title must be at most 120 characters") String title,
        @NotNull(message = "Amount is required") @DecimalMin(value = "0.01", message = "Amount must be greater than zero") @Digits(integer = 10, fraction = 2, message = "Amount allows at most 2 decimal places") BigDecimal amount,
        @NotNull(message = "Category is required") Category category,
        @NotNull(message = "Date is required") LocalDate date) {
}
