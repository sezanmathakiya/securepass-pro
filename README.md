# SecurePass Lab — Password Mathematics

**Assignment:** Password Strength & Combination Calculator  
**Subject:** Foundation of Mathematics | **Unit:** Combinatorics  
**Programme:** MCA, Semester 1 | **Student:** Sezan Mathakiya  
**University:** Silver Oak University

## Run the project
1. Extract `SecurePass_Pro_Project.zip`.
2. Open the `SecurePass_Pro` folder.
3. Double-click `index.html` to open it in Chrome, Edge, or Firefox.
4. Explore Password lab, PIN combinations, and Math in computing.
5. No Node.js, build tools, or Live Server are required. Google Fonts are optional; system fonts work offline.

## Features
- Responsive polished interface and light/dark theme toggle.
- Live password category, length, search-space, and entropy calculations.
- Explicit **Analyze password** submit button with success feedback.
- Educational strength checklist.
- Hypothetical brute-force estimate with average and worst-case time.
- PIN calculator with repeat and leading-zero rules.
- Permutations, counting principle, entropy, and computing application explanation.
- Password input is processed locally; it is not sent to a server.

## Mathematics
- Multiplication principle: `N = R^L`, where `R` is character choices and `L` is positions.
- Entropy estimate: `H = L × log₂(R)` bits under a uniform-random assumption.
- Repetition + leading zero allowed: `10^L`.
- Repetition allowed + leading zero disallowed: `9 × 10^(L−1)`.
- No repetition + leading zero allowed: `10P L = 10! / (10−L)!`.
- No repetition + leading zero disallowed: `9 × 9P(L−1)`.
- No repetition with length above 10: no valid PIN exists using digits 0–9.
- Worst-case exhaustive search: `T ≈ N/G`; average is approximately `N/(2G)` for a uniform search order.

## Limitations
The strength label is a simple educational heuristic, not a professional password audit. Character-pool detection does not prove the password is random. Brute-force time is an illustrative model, not a prediction for a real system. Use sample passwords, not real personal credentials.
