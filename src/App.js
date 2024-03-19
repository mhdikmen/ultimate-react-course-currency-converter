// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function App() {
  const [amount, setAmount] = useState(1);
  const [sourceCurrency, setSourceCurrency] = useState("EUR");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      const controller = new AbortController();
      async function convert() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${sourceCurrency}&to=${targetCurrency}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error("Something went wrong");
          const data = await res.json();
          setOutput(data.rates[targetCurrency]);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
      if (sourceCurrency === targetCurrency) setOutput(amount);
      else convert();
      return function () {
        controller.abort();
      };
    },
    [amount, sourceCurrency, targetCurrency]
  );

  function handleAmountChange(e) {
    const value = Number(e.target.value);
    if (!value) return;
    setAmount(value);
  }

  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={handleAmountChange}
        disabled={isLoading}
      />
      <select
        value={sourceCurrency}
        onChange={(e) => setSourceCurrency(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={targetCurrency}
        onChange={(e) => setTargetCurrency(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>{isLoading ? "Loading..." : `${output} ${targetCurrency}`}</p>
    </div>
  );
}
