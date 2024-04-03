const loadingIndicator = document.querySelector(".loader")

export function showLoadingIndicator() {
  loadingIndicator.style.display = "block";
}

export function hideLoadingIndicator() {
  loadingIndicator.style.display = "none";
}