const URL = "http://localhost:3000/api/entrevista";

// STEP 1
export const guardarStep1 = async (data) => {
  const res = await fetch(`${URL}/step1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
};

// STEP 2
export const guardarStep2 = async (id, data) => {
  const res = await fetch(`${URL}/step2/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
};

// STEP 3
export const guardarStep3 = async (id, data) => {
  const res = await fetch(`${URL}/step3/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
};

// STEP 4
export const guardarStep4 = async (id, data) => {
  const res = await fetch(`${URL}/step4/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await res.json();
};