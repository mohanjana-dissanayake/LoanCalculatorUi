import { useState, useEffect } from "react";
const LoanCalculator = () => {
  const [calculationTypes, setCalculationTypes] = useState([]);
  const [calculationTypeId, setCalculationTypeId] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0.0);
  const [rate, setRate] = useState(0.0);
  const [noOfPayments, setNoOfPayments] = useState(0);
  const [installment, setInstallment] = useState(0.0);

  useEffect(() => {
    const getCalculationTypes = async () => {
      const dataFromServer = await fetchCalculationTypes();
      setCalculationTypes(dataFromServer);
      setCalculationTypeId(dataFromServer[0].id);
    };

    getCalculationTypes();
  }, []);

  const fetchCalculationTypes = async () => {
    const res = await fetch("https://localhost:7292/api/calculation-type");
    const data = await res.json();
    return data;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    getInstallment();
  };

  const getInstallment = async () => {
    const url = `https://localhost:7292/api/calculation?typeId=${calculationTypeId}&principalAmount=${loanAmount}&rate=${rate}&noOfPayments=${noOfPayments}`;
    const res = await fetch(url, {
      method: "get",
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await res.json();
    setInstallment(data.toFixed(2));
  };

  return (
    <>
      <h2>Loan Calculator</h2>
      <form onSubmit={onSubmit}>
        <div className="form-control flex">
          <label>Calculation Type</label>
          <select onChange={(e) => setCalculationTypeId(e.target.value)}>
            {calculationTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control flex">
          <label>Loan Amount (Principal)</label>
          <input
            type="text"
            placeholder="3500"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
        </div>
        <div className="form-control flex">
          <label>Interest Rate</label>
          <input
            type="text"
            placeholder="0.015"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="form-control flex">
          <label>Number of payments</label>
          <input
            type="text"
            placeholder="24"
            value={noOfPayments}
            onChange={(e) => setNoOfPayments(e.target.value)}
          />
        </div>
        <div className="form-control flex right">
          <input
            type="submit"
            value="Calculate"
            className="btn btn-block btn-primary"
          />
          <input
            type="button"
            value="Clear"
            className="btn btn-block btn-default"
          />
        </div>
        <hr />
        <div className="form-control result-box left flex">
          <label>Month Payment = $</label>
          <label>{installment}</label>
        </div>
      </form>
    </>
  );
};

export default LoanCalculator;
