document.addEventListener("DOMContentLoaded", function() {
  // Animation d'apparition douce des éléments
  const fadeInElements = document.querySelectorAll('.gradient-title, .subtitle, .buttons .button, .buttons .button-outline, .form-container, footer');
  fadeInElements.forEach((el, index) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(30px)";
    setTimeout(() => {
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }, 200 * index);
  });

  // Scroll doux pour les liens internes
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Gestion du compteur de visiteurs
  let visiteurs = 10;
  const compteurVisiteurs = document.getElementById("visiteurs");
  compteurVisiteurs.textContent = visiteurs;

  // Gestion des commentaires
  const formCommentaire = document.getElementById("form-commentaire");
  const listeCommentaires = document.getElementById("liste-commentaires");
  const moyenneNotes = document.getElementById("moyenne");
  const starsContainer = document.createElement('div');
  starsContainer.id = 'stars-container';
  moyenneNotes.parentElement.appendChild(starsContainer);

  let commentaires = [];
  let totalNotes = 0;

  // Fonction pour afficher la moyenne et les étoiles
  function afficherMoyenne() {
    const moyenne = commentaires.length ? (totalNotes / commentaires.length) : 0;
    moyenneNotes.textContent = moyenne.toFixed(1);

    let starsHtml = '';
    let fullStars = Math.floor(moyenne);
    let halfStar = (moyenne % 1) >= 0.5;
    let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<span class="star">★</span>';
    }
    if (halfStar) {
      starsHtml += '<span class="star">⯪</span>'; // Alternative pour demi-étoile
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<span class="star empty">★</span>';
    }

    starsContainer.innerHTML = starsHtml;
  }

  // Gestion du clic sur les étoiles pour choisir une note
  let selectedNote = 0;
  document.querySelectorAll('#note img').forEach(star => {
    star.addEventListener('click', function() {
      selectedNote = parseInt(this.dataset.note);
      // Visuellement remplir les étoiles cliquées
      document.querySelectorAll('#note img').forEach(img => {
        if (parseInt(img.dataset.note) <= selectedNote) {
          img.style.opacity = 1;
        } else {
          img.style.opacity = 0.4;
        }
      });
    });
  });

  // Ajout d'un commentaire
  formCommentaire.addEventListener("submit", function(e) {
    e.preventDefault();

    const commentaireTexte = document.getElementById("commentaire").value.trim();

    if (commentaireTexte === "" || selectedNote === 0) {
      alert("Veuillez remplir le commentaire et sélectionner une note.");
      return;
    }

    const commentaire = { texte: commentaireTexte, note: selectedNote };
    commentaires.push(commentaire);
    totalNotes += selectedNote;

    const divCommentaire = document.createElement("div");
    divCommentaire.classList.add("commentaire");
    divCommentaire.innerHTML = `
      <p>${commentaireTexte}</p>
      <div class="etoiles">★ ${"★".repeat(selectedNote)}${"☆".repeat(5 - selectedNote)}</div>
      <button class="supprimer">Supprimer</button>
    `;

    // Bouton pour supprimer le commentaire
    divCommentaire.querySelector(".supprimer").addEventListener("click", function() {
      commentaires = commentaires.filter(c => c !== commentaire);
      totalNotes -= commentaire.note;
      divCommentaire.remove();
      afficherMoyenne();
    });

    listeCommentaires.appendChild(divCommentaire);

    afficherMoyenne();

    // Reset du formulaire
    document.getElementById("commentaire").value = "";
    selectedNote = 0;
    document.querySelectorAll('#note img').forEach(img => img.style.opacity = 0.4);
  });

  // Initialiser l'affichage de la moyenne
  afficherMoyenne();
});


// Fonction pour changer le thème
document.addEventListener('mousemove', function(e) {
  const light = document.getElementById('mouse-light');
  light.style.left = (e.clientX - 150) + 'px';
  light.style.top = (e.clientY - 150) + 'px';

  // Optionnel : changer la couleur selon la position horizontale
  const colors = [
      'rgba(0, 255, 153, 0.4)', // vert fluo
      'rgba(0, 204, 255, 0.4)', // turquoise
      'rgba(255, 215, 0, 0.4)', // or
      'rgba(173, 216, 230, 0.4)' // bleu clair
  ];
  const index = Math.floor((e.clientX / window.innerWidth) * colors.length);
  light.style.background = `radial-gradient(circle, ${colors[index]}, transparent 70%)`;
});


// Permet de réinitialiser les données si tu mets ?reset=brunswann135 dans l'URL
(function resetAccessForAdmin() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("reset") === "brunswann135") {
    localStorage.removeItem('access_until');
    localStorage.removeItem('essai_used');
    alert("Accès réinitialisé.");
  }
})();
