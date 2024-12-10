class Solution {
  minTransfers(transactions) {
    const balanceMap = new Map();

    // Calculate net balances for each person
    for (const transaction of transactions) {
      let [a, b, amount] = transaction;

      if (!(a in balanceMap)) balanceMap[a] = 0;
      if (!(b in balanceMap)) balanceMap[b] = 0;

      balanceMap[a] += amount;
      balanceMap[b] -= amount;
    }

    // Collect all non-zero balances
    let balanceList = [];

    // Iterate over the properties of balanceMap object
    for (const key in balanceMap) {
      //console.log("key: ", key);
      if (balanceMap.hasOwnProperty(key)) {
        balanceList.push(balanceMap[key]);
      }
    }
    // Helper function to perform DFS and find the minimum transactions
    return this.dfs(balanceList, 0);
  }

  minTransfers1(transactions, result, ans, flag, finalAnswer) {
    const balanceMap = new Map();

    // Calculate net balances for each person
    for (const transaction of transactions) {
      let [a, b, amount] = transaction;

      if (!(a in balanceMap)) balanceMap[a] = 0;
      if (!(b in balanceMap)) balanceMap[b] = 0;

      balanceMap[a] += amount;
      balanceMap[b] -= amount;
    }

    // Collect all non-zero balances
    let balanceList = [];

    // Iterate over the properties of balanceMap object
    for (const key in balanceMap) {
      if (balanceMap.hasOwnProperty(key)) {
        balanceList.push({ value: balanceMap[key], key: parseInt(key) });
      }
    }
    // console.log("balanceList: ", balanceList);
    // Helper function to perform DFS and find the minimum transactions
    return this.dfs1(balanceList, 0, result, ans, flag, finalAnswer);
  }

  dfs(balanceList, cur) {
    const n = balanceList.length;
    // //console.log("n: ", n);
    // Skip all the settled balances
    while (cur < n && balanceList[cur] === 0) {
      cur++;
    }
    // //console.log("cur: ", cur);

    // If all balances are settled, no more transactions needed
    if (cur === n) {
      return 0;
    }

    let cost = Infinity;

    // Try to settle the current balance with every other non-zero balance
    for (let nxt = cur + 1; nxt < n; ++nxt) {
      if (balanceList[nxt] * balanceList[cur] < 0) {
        // Perform the transaction
        balanceList[nxt] += balanceList[cur];

        // Recursively find the minimum transactions needed
        const subcost = this.dfs(balanceList, cur + 1);

        cost = Math.min(cost, 1 + subcost);

        // Undo the transaction for the next iteration
        balanceList[nxt] -= balanceList[cur];
      }
    }
    //console.log("cost: ", cost);
    return cost;
  }

  dfs1(balanceList, cur, result, ans, flag, finalAnswer) {
    // //console.log("fuck Chado");
    const n = balanceList.length;
    let answerFound = 0;
    // Skip all the settled balances
    while (cur < n && balanceList[cur].value === 0) {
      cur++;
    }
    //console.log("cur1: ", cur);
    console.log("balanceList: ", balanceList);

    // If all balances are settled and the correct number of transactions are found
    if (cur === n && flag.value) {
      if (result.value.length === ans) {
        answerFound = 1;
        flag.value = false;
        for (const it of result.value) {
          if (it[2] < 0) {
            it[2] = -it[2];
            [it[0], it[1]] = [it[1], it[0]];
          }
          finalAnswer.value.push([it[0], it[1], it[2]]);
        }
      }
      return 0;
    }

    let cost = Infinity;

    // Try to settle the current balance with every other non-zero balance
    for (let nxt = cur + 1; nxt < n; ++nxt) {
      if (
        balanceList[nxt].value * balanceList[cur].value < 0 &&
        answerFound !== 1
      ) {
        // Perform the transaction
        balanceList[nxt].value += balanceList[cur].value;

        // Store the transaction
        const transaction = [
          balanceList[cur].key,
          balanceList[nxt].key,
          -balanceList[cur].value,
        ];
        result.value.push(transaction);

        // Recursively find the minimum transactions needed
        const subcost = this.dfs1(
          balanceList,
          cur + 1,
          result,
          ans,
          flag,
          finalAnswer
        );

        // Remove the transaction
        result.value.pop();

        cost = Math.min(cost, 1 + subcost);

        // Undo the transaction for the next iteration
        balanceList[nxt].value -= balanceList[cur].value;
      }
    }
    return cost;
  }
}

// Main function
function finalAlgo(transactions) {
  //   const transactions = [
  //     [2, 2, 34],
  //     [12, 12, 20],
  //     [12, 11, 30],
  //     [2, 11, 254],
  //     [2, 12, 108],
  //   ];
  const n = transactions.length;
  const solution = new Solution();
  const result = { value: [] };
  const finalAnswer = { value: [] };
  let flag = { value: true };
  const ans = solution.minTransfers(transactions);
  console.log("ans: ", ans);
  solution.minTransfers1(transactions, result, ans, flag, finalAnswer);
  console.log("finalAnswer: ", finalAnswer.value);
  return finalAnswer.value;
}

module.exports = finalAlgo;
// finalAlgo();
