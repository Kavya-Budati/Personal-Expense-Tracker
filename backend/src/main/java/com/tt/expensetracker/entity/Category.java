package com.tt.expensetracker.entity;

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

public enum Category {
    FOOD, TRAVEL, SHOPPING, OTHER
}
