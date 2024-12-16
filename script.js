const fruits = document.querySelectorAll('.fruit');
const dropZones = document.querySelectorAll('.drop-zone');
const resultText = document.getElementById('result');
const resetButton = document.getElementById('reset-button');
const fruitContainer = document.querySelector('.fruit-container');

let draggedFruit = null;
let touchOffset = { x: 0, y: 0 };

// Armazenar frutas originais
const originalFruits = Array.from(fruits);

// Função para embaralhar as frutas
function shuffleFruits() {
  const shuffledFruits = originalFruits.sort(() => Math.random() - 0.5);

  // Limpar o container inicial e adicionar as frutas embaralhadas
  fruitContainer.innerHTML = '';
  shuffledFruits.forEach((fruit) => {
    fruitContainer.appendChild(fruit);
  });
}

// Embaralhar ao carregar o jogo
shuffleFruits();

// Adicionar eventos de arrastar e soltar (desktop)
originalFruits.forEach((fruit) => {
  fruit.addEventListener('dragstart', (e) => {
    draggedFruit = e.target;
    e.target.classList.add('dragging');
  });

  fruit.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
    draggedFruit = null;
  });

  // Suporte a toque para dispositivos móveis
  fruit.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    draggedFruit = e.target;
    touchOffset.x = touch.clientX - fruit.getBoundingClientRect().left;
    touchOffset.y = touch.clientY - fruit.getBoundingClientRect().top;
    fruit.classList.add('dragging');
  });

  fruit.addEventListener('touchmove', (e) => {
    if (!draggedFruit) return;

    const touch = e.touches[0];
    const x = touch.clientX - touchOffset.x;
    const y = touch.clientY - touchOffset.y;

    draggedFruit.style.position = 'absolute';
    draggedFruit.style.left = `${x}px`;
    draggedFruit.style.top = `${y}px`;
  });

  fruit.addEventListener('touchend', (e) => {
    if (draggedFruit) {
      fruit.classList.remove('dragging');
      checkDrop(e.changedTouches[0]);
      draggedFruit.style.position = '';
      draggedFruit.style.left = '';
      draggedFruit.style.top = '';
      draggedFruit = null;
    }
  });
});

// Adicionar eventos para soltar (drop zones)
dropZones.forEach((zone) => {
  // Desktop: drag-and-drop
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('hover');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('hover');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('hover');
    if (draggedFruit) {
      handleDrop(zone);
    }
  });
});

// Função para processar o drop
function handleDrop(zone) {
  const concept = zone.getAttribute('data-concept');
  const fruitConcept = draggedFruit.getAttribute('data-concept');

  if (concept === fruitConcept) {
    zone.classList.add('correct');
    zone.textContent = draggedFruit.textContent;
    draggedFruit.remove();
    checkWin();
  } else {
    zone.classList.add('wrong');
    setTimeout(() => {
      zone.classList.remove('wrong');
    }, 1000);
  }
}

// Função para verificar o drop em dispositivos móveis
function checkDrop(touch) {
  dropZones.forEach((zone) => {
    const dropZoneRect = zone.getBoundingClientRect();

    if (
      touch.clientX > dropZoneRect.left &&
      touch.clientX < dropZoneRect.right &&
      touch.clientY > dropZoneRect.top &&
      touch.clientY < dropZoneRect.bottom
    ) {
      handleDrop(zone);
    }
  });
}

// Checar vitória
function checkWin() {
  const remainingFruits = document.querySelectorAll('.fruit').length;
  if (remainingFruits === 0) {
    resultText.textContent = 'Parabéns! Você completou o jogo!';
    resultText.style.color = 'green';
  }
}

// Botão de Refazer
resetButton.addEventListener('click', () => {
  // Restaurar as zonas de drop
  dropZones.forEach((zone) => {
    zone.textContent = zone.getAttribute('data-concept');
    zone.classList.remove('correct', 'wrong');
  });

  // Retornar todas as frutas ao container inicial
  fruitContainer.innerHTML = '';
  originalFruits.forEach((fruit) => {
    fruitContainer.appendChild(fruit);
  });

  // Embaralhar as frutas no container inicial
  shuffleFruits();

  // Limpar mensagem de resultado
  resultText.textContent = '';
});

function createStars() {
  const starContainer = document.getElementById('star-container');

  for (let i = 0; i < 200; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    const size = Math.random() * 10 + 5; // Tamanho aleatório
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    const duration = Math.random() * 10 + 0.5; // Duração aleatória
    star.style.animationDuration = `${duration}s`;

    starContainer.appendChild(star);

    // Remover estrela após a animação
    star.addEventListener('animationend', () => {
      star.remove();
    });
  }
}

// Modifique a função checkWin para chamar createStars
function checkWin() {
  const remainingFruits = document.querySelectorAll('.fruit').length;
  if (remainingFruits === 0) {
    resultText.textContent = 'Parabéns! Você completou o jogo!';
    resultText.style.color = 'green';
    resultText.style.fontSize = '20px'; // Aumente o tamanho da fonte
    createStars(); // Adicione estrelinhas
  }
}

