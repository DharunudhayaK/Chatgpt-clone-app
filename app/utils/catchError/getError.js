export function getError(err) {
  let errorMessage = "An error occurred";
  if (err?.response) {
    const responseMsg = err?.response?.data?.message ?? "Unknown Error";

    if (responseMsg === "jwt expired") {
      errorMessage = "Session expired. Please log in again.";
    } else {
      errorMessage = responseMsg || "Unknown error";
    }
  } else {
    errorMessage = err?.message || "An error occurred";
  }
  return errorMessage;
}
