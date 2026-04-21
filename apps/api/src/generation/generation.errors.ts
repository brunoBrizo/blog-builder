export class KillSwitchError extends Error {
  readonly code = 'KILL_SWITCH' as const;
  constructor(
    message = 'Article generation is disabled (GENERATION_KILL_SWITCH)',
  ) {
    super(message);
    this.name = 'KillSwitchError';
  }
}

export class BudgetExceededError extends Error {
  readonly code = 'BUDGET_EXCEEDED' as const;
  constructor(message: string) {
    super(message);
    this.name = 'BudgetExceededError';
  }
}

export class PerplexityValidationError extends Error {
  readonly code = 'PERPLEXITY_VALIDATION' as const;
  constructor(message: string, cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = 'PerplexityValidationError';
  }
}
