export const STRATEGY_TIMEFRAMES = [
  // --- SCALPING / INTRADAY (High Frequency) ---
  { value: "M1/M15", label: "M1/M15 (Hyper-Scalp Execution)" },
  { value: "M5/M30", label: "M5/M30 (Intraday Momentum)" },
  { value: "M15/H1", label: "M15/H1 (Daily Trend Riding)" },

  // --- SWING TRADING (The Bread & Butter) ---
  { value: "H1/H4", label: "H1/H4 (Standard Swing)" },
  { value: "H4/D1", label: "H4/D1 (Structural Swing - Recommended)" },
  { value: "D1/W1", label: "D1/W1 (Positional / Macro Swing)" },

  // --- INSTITUTIONAL / SMC SPOT ---
  { value: "M1/H1/H4", label: "M1/H1/H4 (Institutional Entry)" },
  { value: "M5/H4/D1", label: "M5/H4/D1 (High Conviction SMC)" },

  // --- LONG-TERM ACCUMULATION ---
  { value: "D1/MN", label: "D1/MN (Investor Portfolio)" },
  { value: "W1/MN", label: "W1/MN (Macro Cycle)" },
  { value: "MTF", label: "Custom Multi-Timeframe" },
];

export const STRATEGY_SETUP_TYPES = [
  // --- MOMENTUM & CONTINUATION (Buy High, Sell Higher) ---
  { value: "breakout_retest", label: "Breakout & Retest (Level Confirmation)" },
  { value: "base_breakout", label: "Base Breakout (Consolidation Exit)" },
  { value: "bull_flag_pennant", label: "Trend Continuation (Flag/Pennant)" },
  { value: "ema_pullback", label: "Dynamic Support (EMA 20/50/200 Bounce)" },

  // --- MEAN REVERSION & VALUE (Buy Low, Sell High) ---
  { value: "major_support_bounce", label: "Horizontal Support Bounce" },
  { value: "fvg_fill_entry", label: "FVG Fill (Fair Value Gap / Imbalance)" },
  { value: "deep_pullback_fib", label: "Fibonacci Retracement (61.8% - 78.6%)" },
  { value: "oversold_divergence", label: "Bullish Divergence (RSI/MACD)" },

  // --- INSTITUTIONAL LOGIC (SMC/Wyckoff) ---
  { value: "liquidity_sweep", label: "Liquidity Sweep (Stop Hunt Before Pump)" },
  { value: "order_block_entry", label: "Order Block (Institutional Demand)" },
  { value: "wyckoff_spring", label: "Wyckoff Spring (Accumulation Final Test)" },
  { value: "market_structure_shift", label: "MS Shift (CHoCH Bullish Confirmation)" },

  // --- FUNDAMENTAL & YIELD ---
  { value: "dividend_momentum", label: "Dividend Capture / Yield Play" },
  { value: "news_catalyst", label: "Fundamental Catalyst (Earnings/Product)" },
  { value: "ipo_listing", label: "New Listing / IPO Momentum" },
];

export const STRATEGY_RISK_MODELS = [
  // --- QUANTITATIVE RISK ---
  { value: "fixed_risk_pct", label: "Fixed Risk % (Equity-based Stop Loss)" },
  { value: "fixed_cash_sl", label: "Fixed Cash SL (Amount-based Stop Loss)" },
  { value: "atr_volatility", label: "ATR Based (Volatility Adjusted Size)" },

  // --- PORTFOLIO ALLOCATION (Spot Specialist) ---
  { value: "equal_weight", label: "Equal Weight (Standard Allocation)" },
  { value: "tiered_conviction", label: "Tiered (High/Med/Low Conviction Size)" },
  { value: "max_portfolio_pct", label: "Max Portfolio % (Hard Cap per Asset)" },

  // --- ENTRY STRATEGY ---
  { value: "lumpsum_entry", label: "Lumpsum (One-shot Execution)" },
  { value: "dca_pyramiding", label: "Pyramiding (Adding on Winning Position)" },
  { value: "dca_averaging", label: "DCA (Fixed Interval Averaging)" },
  { value: "manual_discretionary", label: "Manual / Discretionary" },
];