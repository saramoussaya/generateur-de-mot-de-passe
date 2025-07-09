// Récupération des éléments DOM
const passwordField = document.getElementById("password");
const copyBtn = document.getElementById("copy-btn");
const generateBtn = document.getElementById("generate-btn");
const saveBtn = document.getElementById("save-btn");
const darkModeToggle = document.getElementById("dark-mode-toggle");

const lengthInput = document.getElementById("length");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");

const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");
const savedList = document.getElementById("saved-list");

// Jeu de caractères possibles
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+[]{}|;:,.<>?";

// Fonction pour générer un mot de passe
function generatePassword() {
  const length = parseInt(lengthInput.value);
  let characters = "";

  if (uppercaseCheckbox.checked) characters += UPPERCASE;
  if (lowercaseCheckbox.checked) characters += LOWERCASE;
  if (numbersCheckbox.checked) characters += NUMBERS;
  if (symbolsCheckbox.checked) characters += SYMBOLS;

  if (characters === "") {
    showNotification("Veuillez sélectionner au moins une option !", "error");

    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  passwordField.value = password;
  evaluateStrength(password);
}

// Fonction pour évaluer la force du mot de passe
function evaluateStrength(password) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const strengthPercent = (strength / 5) * 100;
  strengthBar.style.setProperty("width", `${strengthPercent}%`);

  if (strength <= 2) {
    strengthBar.style.background = "red";
    strengthText.textContent = "Force : Faible";
  } else if (strength === 3) {
    strengthBar.style.background = "orange";
    strengthText.textContent = "Force : Moyenne";
  } else {
    strengthBar.style.background = "green";
    strengthText.textContent = "Force : Forte";
  }
}

// Fonction pour copier le mot de passe dans le presse-papiers
copyBtn.addEventListener("click", () => {
  if (!passwordField.value) {
    showNotification("Aucun mot de passe à copier !");
    return;
  }
  passwordField.select();
  passwordField.setSelectionRange(0, 99999); // Pour mobile
  document.execCommand("copy");
  showNotification("Mot de passe copié !");
});

// Fonction pour sauvegarder le mot de passe dans localStorage
function savePassword(password) {
  if (!password) {
    showNotification("Aucun mot de passe à sauvegarder !");
    return;
  }

  let savedPasswords = JSON.parse(localStorage.getItem("passwords")) || [];
  savedPasswords.push(password);
  localStorage.setItem("passwords", JSON.stringify(savedPasswords));
  displaySavedPasswords();
}

// Afficher les mots de passe sauvegardés
function displaySavedPasswords() {
  const savedPasswords = JSON.parse(localStorage.getItem("passwords")) || [];
  savedList.innerHTML = "";

  savedPasswords.forEach((password, index) => {
    const li = document.createElement("li");
    li.textContent = password;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.addEventListener("click", () => {
      savedPasswords.splice(index, 1);
      localStorage.setItem("passwords", JSON.stringify(savedPasswords));
      displaySavedPasswords();
    });

    li.appendChild(deleteBtn);
    savedList.appendChild(li);
  });
}

// Gestion du mode sombre
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
});

// Charger le mode sombre au chargement de la page
window.addEventListener("load", () => {
  const isDarkMode = JSON.parse(localStorage.getItem("darkMode"));
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }
  displaySavedPasswords();
});

function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = "notification show"; // Reset classes
  if (type === "error") {
    notification.classList.add("error");
  }

  // Faire disparaître la notification après 3 secondes
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}


// Événements boutons
generateBtn.addEventListener("click", generatePassword);
saveBtn.addEventListener("click", () => savePassword(passwordField.value));
