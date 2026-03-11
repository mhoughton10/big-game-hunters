/**
 * Big Game Hunters Classic - Matthew Houghton Edition
 * Simple static browser game: click targets, read popups, win.
 */

(function () {
  "use strict";

  // ----- Data for the 4 targets and their popups -----
  // Target logos: snowflake.png, fabric.png, vertex.png, sagemaker.png (order: Snowflake, Microsoft Fabric, Vertex AI, SageMaker)
  // Modal: single image (image/imageAlt) or gallery (images array)
  const TARGETS = [
    { label: "Snowflake", logo: "assets/snowflake.png", title: "Where I Grew Up", text: "From: Detroit, Michigan. College: Michigan State University.", image: "assets/rochester.jpeg", imageAlt: "Rochester, Michigan" },
    { label: "Microsoft Fabric", logo: "assets/fabric.png", title: "Personal Life", text: "Personal life: family and fiance.", images: [
      { src: "assets/megan.jpeg", alt: "Megan" },
      { src: "assets/mom-dad.png", alt: "Family" },
      { src: "assets/nick-melissa.png", alt: "Nick and Melissa" }
    ] },
    { label: "Vertex AI", logo: "assets/vertex.png", title: "Hobbies & Interests", text: "Hobbies and interests go here.", image: "", imageAlt: "" },
    { label: "SageMaker", logo: "assets/sagemaker.png", title: "Why Databricks", text: "Why Databricks goes here.", image: "assets/dbx.png", imageAlt: "Databricks" }
  ];

  // ----- DOM elements -----
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const finalScreen = document.getElementById("final-screen");
  const startBtn = document.getElementById("start-btn");
  const targetEl = document.getElementById("target");
  const targetLogoEl = document.getElementById("target-logo");
  const targetContainer = document.getElementById("target-container");
  const hitEffect = document.getElementById("hit-effect");
  const modal = document.getElementById("modal");
  const modalImageWrap = document.getElementById("modal-image-wrap");
  const modalImage = document.getElementById("modal-image");
  const modalGallery = document.getElementById("modal-gallery");
  const modalTitle = document.getElementById("modal-title");
  const modalText = document.getElementById("modal-text");
  const continueBtn = document.getElementById("continue-btn");

  // ----- Gunshot sound (preload for smooth playback) -----
  const gunshotSound = new Audio("sounds/gunshot.mp3");
  gunshotSound.preload = "auto";
  gunshotSound.load();

  // ----- State -----
  let currentTargetIndex = 0;
  let animationId = null;
  let isPaused = false;
  let direction = 1;   // 1 = left-to-right, -1 = right-to-left
  let position = 0;    // horizontal position in px

  // ----- Show only one screen -----
  function showScreen(screenEl) {
    [startScreen, gameScreen, finalScreen].forEach(function (el) {
      el.classList.toggle("active", el === screenEl);
    });
  }

  // ----- Start the hunt -----
  function startHunt() {
    currentTargetIndex = 0;
    isPaused = false;
    showScreen(gameScreen);
    spawnTarget();
    startMovement();
  }

  // ----- Spawn current target (logo + position) -----
  function spawnTarget() {
    if (currentTargetIndex >= TARGETS.length) return;
    var data = TARGETS[currentTargetIndex];
    targetLogoEl.src = data.logo;
    targetLogoEl.alt = data.label;
    targetEl.setAttribute("data-index", currentTargetIndex);
    // Start from left or right at random
    direction = Math.random() < 0.5 ? 1 : -1;
    position = direction === 1 ? -targetEl.offsetWidth : document.documentElement.clientWidth;
    targetEl.style.left = position + "px";
    targetEl.style.visibility = "visible";
  }

  // ----- Animate target across the screen -----
  function startMovement() {
    if (isPaused || currentTargetIndex >= TARGETS.length) return;
    var speed = 1.2;
    var maxWidth = document.documentElement.clientWidth;

    function move() {
      if (isPaused) return;
      position += direction * speed;
      // Wrap: if gone off one side, respawn from the other (keeps target always available)
      if (direction === 1 && position > maxWidth) {
        position = -targetEl.offsetWidth;
      } else if (direction === -1 && position < -targetEl.offsetWidth) {
        position = maxWidth;
      }
      targetEl.style.left = position + "px";
      animationId = requestAnimationFrame(move);
    }
    move();
  }

  function stopMovement() {
    if (animationId != null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // ----- Hit effect at click position -----
  function showHitEffect(clientX, clientY) {
    hitEffect.style.setProperty("--hit-x", clientX + "px");
    hitEffect.style.setProperty("--hit-y", clientY + "px");
    hitEffect.classList.add("show");
    setTimeout(function () {
      hitEffect.classList.remove("show");
    }, 250);
  }

  // ----- Show modal for current target -----
  function showModal() {
    var data = TARGETS[currentTargetIndex];
    if (data.images && data.images.length > 0) {
      modalImage.src = "";
      modalImage.style.display = "none";
      modalGallery.innerHTML = "";
      data.images.forEach(function (item) {
        var img = document.createElement("img");
        img.src = item.src;
        img.alt = item.alt;
        modalGallery.appendChild(img);
      });
      modalGallery.setAttribute("aria-hidden", "false");
      modalImageWrap.style.display = "";
      modalImageWrap.style.height = "auto";
    } else if (data.image) {
      modalImage.src = data.image;
      modalImage.alt = data.imageAlt;
      modalImage.style.display = "block";
      modalImageWrap.style.height = "260px";
      modalGallery.setAttribute("aria-hidden", "true");
      modalGallery.innerHTML = "";
      modalImageWrap.style.display = "";
    } else {
      modalImage.src = "";
      modalImageWrap.style.display = "none";
    }
    modalTitle.textContent = data.title;
    modalText.textContent = data.text;
    modal.setAttribute("aria-hidden", "false");
  }

  function hideModal() {
    modal.setAttribute("aria-hidden", "true");
  }

  // ----- When target is clicked -----
  function onTargetClick(e) {
    if (isPaused || currentTargetIndex >= TARGETS.length) return;
    e.stopPropagation();
    isPaused = true;
    stopMovement();
    gunshotSound.currentTime = 0;
    gunshotSound.play().catch(function () {});
    showHitEffect(e.clientX, e.clientY);
    targetEl.style.visibility = "hidden";
    setTimeout(function () {
      showModal();
    }, 300);
  }

  // ----- Continue after reading popup -----
  function onContinue() {
    hideModal();
    currentTargetIndex += 1;
    if (currentTargetIndex >= TARGETS.length) {
      showScreen(finalScreen);
      return;
    }
    isPaused = false;
    spawnTarget();
    startMovement();
  }

  // ----- Wire up events -----
  startBtn.addEventListener("click", startHunt);
  targetEl.addEventListener("click", onTargetClick);
  continueBtn.addEventListener("click", onContinue);

  // Optional: close modal with Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      onContinue();
    }
  });
})();
