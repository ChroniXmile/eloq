
#!/usr/bin/env python3
import argparse
import math
import os
import sys
import pandas as pd

SIGMA = 400.0
T0 = 9.0

# K-factor thresholds
K_PROV = 40.0
K_EST = 20.0
K_ELITE = 10.0
PROVISIONAL_MATCHES = 30

# Event tier multipliers
TIER_MULT = {
    "local": 1.00,
    "regional": 1.05,
    "national": 1.10,
    "major": 1.20,
}

# Format offset in Elo space
FORMAT_DELTA = {
    "alternate": 0.0,
    "winner": 15.0,
}

# Balls blending
ALPHA_DEFAULT = 0.85
GAMMA = 0.20

def expected_score(delta_R, delta=0.0):
    """E_i = 1 / (1 + 10^(-(ΔR + delta)/SIGMA))"""
    return 1.0 / (1.0 + 10.0 ** (-(delta_R + delta) / SIGMA))

def race_factor(T):
    return math.sqrt(max(T, 1.0) / T0)

def margin_factor(r_diff_abs, deltaR_abs):
    return math.log(1.0 + r_diff_abs) / (1.0 + 10.0 ** (deltaR_abs / SIGMA))

def field_strength_multiplier(field_avg):
    # 1 + 0.5*((field_avg - 1500)/400), clipped to [0.9, 1.3]
    if pd.isna(field_avg):
        return 1.0
    val = 1.0 + 0.5 * ((float(field_avg) - 1500.0) / 400.0)
    return max(0.9, min(1.3, val))

def select_k_base(rating, matches_played):
    if matches_played < PROVISIONAL_MATCHES:
        return K_PROV
    if rating >= 2400:
        return K_ELITE
    return K_EST

def compute_observed_scores(r_i, r_j, balls_i, balls_j, balls_per_rack, alpha=ALPHA_DEFAULT):
    T = r_i + r_j
    if T <= 0:
        return 0.5, 0.5, 0.0  # degenerate

    S_i = r_i / T
    S_j = r_j / T

    # If balls columns missing or balls_per_rack missing -> no blending
    if pd.isna(balls_i) or pd.isna(balls_j) or pd.isna(balls_per_rack) or balls_per_rack <= 0:
        return S_i, S_j, S_i  # no blending; S* = S_i

    B_total = balls_per_rack * T
    if B_total <= 0:
        return S_i, S_j, S_i

    delta_b = (balls_i - balls_j) / B_total  # in [-1,1]
    S_balls = max(0.0, min(1.0, 0.5 + GAMMA * delta_b))

    alpha_use = alpha
    # If user sets alpha outside [0,1], clamp
    alpha_use = max(0.0, min(1.0, alpha_use))

    S_star = alpha_use * S_i + (1.0 - alpha_use) * S_balls
    return S_i, S_j, S_star

def load_seeds(path):
    seeds = {}
    matches = {}
    if not path or not os.path.exists(path):
        return seeds, matches
    df = pd.read_csv(path)
    for _, row in df.iterrows():
        name = str(row["player"])
        rating_val = row["rating"]
        # Handle both scalar values and pandas Series from DataFrame iteration
        try:
            # Try to convert directly first (handles most scalar cases)
            rating_scalar = float(rating_val)  # type: ignore
        except (TypeError, ValueError):
            # If direct conversion fails, it might be a pandas Series
            try:
                # Extract scalar from Series using iloc[0]
                if hasattr(rating_val, 'iloc'):
                    rating_scalar = float(rating_val.iloc[0])
                else:
                    # Fallback for other types
                    rating_scalar = 1500.0
            except (AttributeError, IndexError, TypeError, ValueError):
                # Final fallback for any conversion issues
                rating_scalar = 1500.0
        seeds[name] = rating_scalar if not pd.isna(rating_scalar) else 1500.0
        m = row.get("matches", 0)
        # Handle both scalar values and pandas Series from DataFrame iteration
        try:
            # Try to convert directly first (handles most scalar cases)
            m_scalar = int(m)
        except (TypeError, ValueError):
            # If direct conversion fails, it might be a pandas Series
            try:
                # Extract scalar from Series using iloc[0]
                if hasattr(m, 'iloc'):
                    m_scalar = int(m.iloc[0])
                else:
                    # Fallback for other types
                    m_scalar = 0
            except (AttributeError, IndexError, TypeError, ValueError):
                # Final fallback for any conversion issues
                m_scalar = 0
        m = m_scalar
        matches[name] = m
    return seeds, matches

def main():
    parser = argparse.ArgumentParser(description="Pool Elo-like ratings from CSV matches.")
    parser.add_argument("--matches", required=True, help="Path to matches.csv")
    parser.add_argument("--seeds", required=False, help="Optional seed ratings CSV (player,rating,matches)")
    parser.add_argument("--alpha", type=float, default=ALPHA_DEFAULT, help="Weight on rack-share when balls are present [0..1]")
    args = parser.parse_args()

    seeds, matches_played = load_seeds(args.seeds)

    # Ratings state
    ratings = seeds.copy()

    matches_df = pd.read_csv(args.matches)

    # Ensure chronological processing
    if "date" in matches_df.columns:
        try:
            matches_df["date"] = pd.to_datetime(matches_df["date"], errors="coerce")
            matches_df = matches_df.sort_values(["date"]).reset_index(drop=True)
        except Exception:
            pass

    out_rows = []

    for idx, row in matches_df.iterrows():
        p_i = str(row["player_i"])
        p_j = str(row["player_j"])

        # Seed handling: use explicit start_rating_* only on first appearance
        if p_i not in ratings:
            r0 = row.get("start_rating_i", float("nan"))
            ratings[p_i] = float(r0) if not pd.isna(r0) else 1500.0
            matches_played[p_i] = matches_played.get(p_i, 0)
        if p_j not in ratings:
            r0 = row.get("start_rating_j", float("nan"))
            ratings[p_j] = float(r0) if not pd.isna(r0) else 1500.0
            matches_played[p_j] = matches_played.get(p_j, 0)

        R_i = float(ratings[p_i])
        R_j = float(ratings[p_j])
        deltaR = R_i - R_j

        # Extract scalar values to avoid pandas Series issues
        r_i_val = row["racks_i"]
        r_j_val = row["racks_j"]

        # Handle r_i_val conversion
        try:
            r_i_scalar = int(r_i_val)  # type: ignore
        except (TypeError, ValueError):
            try:
                if hasattr(r_i_val, 'iloc'):
                    r_i_scalar = int(r_i_val.iloc[0])
                else:
                    r_i_scalar = 0
            except (AttributeError, IndexError, TypeError, ValueError):
                r_i_scalar = 0

        # Handle r_j_val conversion
        try:
            r_j_scalar = int(r_j_val)  # type: ignore
        except (TypeError, ValueError):
            try:
                if hasattr(r_j_val, 'iloc'):
                    r_j_scalar = int(r_j_val.iloc[0])
                else:
                    r_j_scalar = 0
            except (AttributeError, IndexError, TypeError, ValueError):
                r_j_scalar = 0

        r_i = r_i_scalar
        r_j = r_j_scalar
        T = r_i + r_j

        balls_per_rack = row.get("balls_per_rack", float("nan"))
        try:
            balls_per_rack = int(balls_per_rack)
        except Exception:
            balls_per_rack = float("nan")

        balls_i = row.get("balls_i", float("nan"))
        balls_j = row.get("balls_j", float("nan"))
        try:
            balls_i = float(balls_i)
            balls_j = float(balls_j)
        except Exception:
            balls_i, balls_j = float("nan"), float("nan")

        event_tier = str(row.get("event_tier", "local")).lower()
        tier_mult = TIER_MULT.get(event_tier, 1.0)

        field_avg = row.get("field_avg", float("nan"))
        try:
            field_avg = float(field_avg)
        except Exception:
            field_avg = float("nan")

        format_s = str(row.get("format", "alternate")).lower()
        delta = FORMAT_DELTA.get(format_s, 0.0)

        # Scores
        S_i, S_j, S_star = compute_observed_scores(r_i, r_j, balls_i, balls_j, balls_per_rack, alpha=args.alpha)
        E_i = expected_score(deltaR, delta)
        E_j = 1.0 - E_i

        # Modulators
        G = race_factor(T)
        M = margin_factor(abs(r_i - r_j), abs(deltaR))

        # K-factors per player
        kbase_i = select_k_base(R_i, matches_played.get(p_i, 0))
        kbase_j = select_k_base(R_j, matches_played.get(p_j, 0))

        k_i = kbase_i * tier_mult * field_strength_multiplier(field_avg)
        k_j = kbase_j * tier_mult * field_strength_multiplier(field_avg)

        # Updates
        dR_i = k_i * G * M * (S_star - E_i)
        dR_j = k_j * G * M * ((1.0 - S_star) - E_j)  # anti-symmetric if k_i == k_j

        R_i_new = R_i + dR_i
        R_j_new = R_j + dR_j

        # Commit
        ratings[p_i] = R_i_new
        ratings[p_j] = R_j_new
        matches_played[p_i] = matches_played.get(p_i, 0) + 1
        matches_played[p_j] = matches_played.get(p_j, 0) + 1

        out_rows.append({
            "date": row.get("date", ""),
            "event_tier": event_tier,
            "format": format_s,
            "discipline": row.get("discipline", ""),
            "balls_per_rack": balls_per_rack if not pd.isna(balls_per_rack) else "",
            "race_to": row.get("race_to", ""),
            "player_i": p_i,
            "player_j": p_j,
            "R_i_pre": round(R_i, 2),
            "R_j_pre": round(R_j, 2),
            "E_i": round(E_i, 4),
            "E_j": round(E_j, 4),
            "S_i_rackshare": round(S_i, 4),
            "S_star_used": round(S_star, 4),
            "G_race": round(G, 4),
            "M_margin": round(M, 4),
            "K_i": round(k_i, 3),
            "K_j": round(k_j, 3),
            "dR_i": round(dR_i, 3),
            "dR_j": round(dR_j, 3),
            "R_i_post": round(R_i_new, 2),
            "R_j_post": round(R_j_new, 2),
            "racks_i": r_i,
            "racks_j": r_j,
            "balls_i": "" if pd.isna(balls_i) else int(balls_i),
            "balls_j": "" if pd.isna(balls_j) else int(balls_j),
            "field_avg": "" if pd.isna(field_avg) else round(field_avg, 1),
        })

    report_df = pd.DataFrame(out_rows)
    out_report = os.path.join(os.path.dirname(args.matches) or ".", "pool_ratings_report.csv")
    report_df.to_csv(out_report, index=False)

    # Final ratings table
    final_rows = []
    for p, r in ratings.items():
        final_rows.append({
            "player": p,
            "rating": round(float(r), 2),
            "matches": matches_played.get(p, 0),
        })
    final_df = pd.DataFrame(final_rows).sort_values(["rating", "matches"], ascending=[False, False])
    out_final = os.path.join(os.path.dirname(args.matches) or ".", "pool_final_ratings.csv")
    final_df.to_csv(out_final, index=False)

    print("Top 20 (rating, matches):")
    print(final_df.head(20).to_string(index=False))

if __name__ == "__main__":
    main()
