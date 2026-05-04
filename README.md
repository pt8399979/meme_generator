# Dynamic Programming (DP)

Dynamic Programming is an optimization technique used to solve complex problems by breaking them down into smaller subproblems and storing the results to avoid repeated computations.

## 🚀 Key Concepts

* **Overlapping Subproblems**: Same subproblems are solved multiple times.
* **Optimal Substructure**: Final solution is built from optimal solutions of smaller subproblems.
* **Memoization (Top-Down)**: Uses recursion + caching.
* **Tabulation (Bottom-Up)**: Uses iteration and builds solution step-by-step.

## 📌 Why Use DP?

* Improves time complexity
* Avoids redundant calculations
* Efficient for optimization problems

## 🧠 Common Problem Types

* Fibonacci Sequence
* Knapsack Problem
* Longest Common Subsequence (LCS)
* Coin Change Problem
* Minimum Path Sum

## ⚙️ Approach

1. Identify if the problem has overlapping subproblems
2. Define the state (dp array)
3. Write recurrence relation
4. Implement using memoization or tabulation

## 💻 Example (Fibonacci - Tabulation)

```java
int fib(int n) {
    int[] dp = new int[n+1];
    dp[0] = 0; dp[1] = 1;

    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];

    return dp[n];
}
```

## 📈 Complexity

* Time: O(n)
* Space: O(n)

## 📚 Conclusion

Dynamic Programming is a powerful technique widely used in coding interviews and real-world problem solving to optimize recursive solutions and improve performance.
