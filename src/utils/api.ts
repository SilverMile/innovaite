const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function fetchHazards(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/hazards`);
  if (!response.ok) {
    throw new Error("Failed to fetch hazards");
  }
  return response.json();
}

export async function createHazard(
  lat: number,
  lng: number,
  description: string,
  userId?: number
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/hazards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lat, lng, description, userId }),
  });
  if (!response.ok) {
    throw new Error("Failed to create hazard");
  }
  return response.json();
}

export async function claimHazard(hazardId: number, userId: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/hazards/${hazardId}/claim`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to claim hazard");
  }
  return response.json();
}

export async function completeHazard(hazardId: number, userId: number): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/hazards/${hazardId}/complete`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to complete hazard");
  }
  return response.json();
}

export async function deleteHazard(hazardId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/hazards/${hazardId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete hazard");
  }
}

export async function createUser(username: string, email: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create user");
  }
  return response.json();
}

