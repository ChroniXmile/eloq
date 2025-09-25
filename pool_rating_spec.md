
# Pool Elo-like Rating System — Minimal Spec (v1)

This spec defines the data fields and formulas used by the reference script `pool_elo.py` to compute Elo‑style ratings for professional pool players. It uses **rack-share** as the observed score, supports optional **balls‑made** blending, scales updates by **race length** and **event strength**, and allows a small **format offset** for winner‑break.

---

## File Inputs

### 1) Matches CSV (`matches.csv`)
Each row is a single match. Process rows in chronological order.

**Required columns**
- `date` (YYYY-MM-DD) — For ordering only.
- `event_tier` — One of: `local`, `regional`, `national`, `major`.
- `format` — One of: `alternate`, `winner` (break format; affects small offset).
- `discipline` — Free text (e.g., `9-ball`, `10-ball`) for reporting; not used in math.
- `balls_per_rack` — Integer; typical: `9`, `10`, `15`. If blank, balls blending is skipped.
- `race_to` — Integer target for the winner (e.g., `9` in race-to-9).
- `player_i`, `player_j` — Player names/IDs.
- `racks_i`, `racks_j` — Integer racks won by each player.

**Optional columns**
- `balls_i`, `balls_j` — Integers total balls pocketed in the match (if blank ⇒ no ball blending).
- `field_avg` — Event field average rating (float). If blank, the script uses the event tier multiplier only.
- `start_rating_i`, `start_rating_j` — Initial seed ratings (float) for these players (only applied on their first appearance). If blank, new players start at 1500.

> Tip: You can keep columns you don't use empty; the script will infer behavior.

### 2) (Optional) Seed Ratings CSV (`seeds.csv`)
Columns: `player`, `rating`, `matches` (matches can be left blank; defaults to 0). If present, this will be loaded before processing `matches.csv`.

---

## Outputs

- `pool_ratings_report.csv` — Per‑match diagnostics and rating deltas.
- `pool_final_ratings.csv` — Final ratings and match counts.
- Console summary: top 20 players by rating.

---

## Parameters (defaults in the script)

- Elo scale: `SIGMA = 400`
- Baseline race length: `T0 = 9` (used in `G_race = sqrt(T/T0)`)
- K‑factors:
  - Provisional until 30 matches: `K_PROV = 40`
  - Established: `K_EST = 20`
  - Elite (rating >= 2400): `K_ELITE = 10`
- Event strength multipliers by `event_tier`:
  - `local`: 1.00
  - `regional`: 1.05
  - `national`: 1.10
  - `major`: 1.20
- Format offset (added to rating difference inside logistic only):
  - `alternate`: `delta = 0`
  - `winner`: `delta = +15`
- Margin dampening:
  - `M_margin = ln(1 + |r_diff|) / (1 + 10^(|ΔR| / SIGMA))`
- Race scaling:
  - `G_race = sqrt(T / T0)` where `T = racks_i + racks_j`
- Balls‑made blending (optional):
  - `alpha = 0.85` (weight on rack‑share)
  - `gamma = 0.20` (balls → micro‑score slope)
  - If `balls_i` or `balls_j` missing ⇒ `alpha = 1.0`
  - Ball micro‑score:
    - Total balls `B_total = balls_per_rack * T`
    - `Δb = (balls_i - balls_j) / B_total` in [-1, 1]
    - `S_balls = clip(0.5 + gamma * Δb, 0, 1)`
  - Blended observed score: `S_tilde = alpha * S_rack + (1 - alpha) * S_balls`

---

## Core Formulas

Let `R_i`, `R_j` be pre‑match ratings; `ΔR = R_i - R_j`.

1) **Expected score (logistic/Elo):**
\\(
E_i = \\frac{1}{1 + 10^{-(ΔR + \\delta)/SIGMA}}
\\)
with `delta` from the format (see Parameters).

2) **Observed score (rack share):**
\\(
S_i = \\frac{racks_i}{racks_i + racks_j} = \\frac{racks_i}{T}
\\)

3) **Optional balls micro‑score and blend:** as above in Parameters.

4) **Race scaling:**
\\(
G_\\text{race} = \\sqrt{\\frac{T}{T0}}
\\)

5) **Margin dampening:**
\\(
M_\\text{margin} = \\frac{\\ln(1 + |racks_i - racks_j|)}{1 + 10^{|ΔR|/SIGMA}}
\\)

6) **Event strength multiplier:** multiply K by tier multiplier, and if `field_avg` is present, also apply
\\(
K_\\text{field} = \\mathrm{clip}\\left(1 + 0.5\\cdot\\frac{field\\_avg - 1500}{400},\\ 0.9,\\ 1.3\\right)
\\)

7) **K selection per player (uncertainty aware):**
- If matches played < 30: `K_base = 40`
- Else if rating >= 2400: `K_base = 10`
- Else: `K_base = 20`

Final per‑player K:
\\(
K_i = K_\\text{base} \\times K_\\text{tier} \\times K_\\text{field}
\\)

8) **Update:**
\\(
R_i' = R_i + K_i \\cdot G_\\text{race} \\cdot M_\\text{margin} \\cdot (S^* - E_i)
\\)
where \\(S^* = S_i\\) or the blended `S_tilde` if ball data is present.

---

## CSV Schema Example

```
date,event_tier,format,discipline,balls_per_rack,race_to,player_i,player_j,racks_i,racks_j,balls_i,balls_j,field_avg
2025-08-01,major,alternate,9-ball,9,9,Shaw,SVB,9,5,78,48,2050
2025-08-01,major,alternate,9-ball,9,9,Filler,Ouschan,9,7,90,72,2050
2025-08-02,major,winner,10-ball,10,10,SVB,Filler,10,8,95,85,2050
```

---

## Running the script

```bash
python3 pool_elo.py --matches matches.csv --seeds seeds.csv
# or without seeds
python3 pool_elo.py --matches matches.csv
```
