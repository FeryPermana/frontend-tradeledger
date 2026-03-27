import api from "@/api/axios";

export function fetchTrades(params = {}) {
  return api.get("/trades", { params });
}

export function fetchTrade(id) {
  return api.get(`/trades/${id}`);
}

export function createTrade(payload) {
  return api.post("/trades", payload);
}

export function updateTrade(id, payload) {
  return api.put(`/trades/${id}`, payload);
}

export function deleteTrade(id) {
  return api.delete(`/trades/${id}`);
}

export function deleteInvestmentGroup(id) {
  return api.delete(`/trades/${id}?type=investment`);
}

export function exportTradesCsv(params = {}) {
  return api.get("/trades/export/csv", {
    params,
    responseType: "blob",
  });
}

export function uploadTradeImage(tradeId, formData) {
  return api.post(`/trades/${tradeId}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function deleteTradeImage(imageId) {
  return api.delete(`/trade-images/${imageId}`);
}
