const API_URL = import.meta.env.VITE_FASTAPI_URL;

export const sendCommand = async (command) => {
  const token = localStorage.getItem("token");

  const request = {
    token,
    command,
  };

  const response = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
