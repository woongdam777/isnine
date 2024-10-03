// 섹션 전환
const navItems = document.querySelectorAll('nav ul li');
const sections = document.querySelectorAll('main section');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const targetSection = item.getAttribute('data-section');
    sections.forEach(section => {
      if (section.classList.contains(targetSection)) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  });
});

// 계산 기능

const inputValue = document.getElementById('inputValue');
const ticketValue = document.getElementById('ticketValue');
const resultList = document.getElementById('resultList');
let tenScore = document.getElementById('tenScore');
let ticketUse = document.getElementById('ticketUse');
let ticketRemain = document.getElementById('ticketRemain');

const denominations = [
    { value: 1500000, name: "신화" },
    { value: 300000, name: "고대" },
    { value: 100000, name: "에픽" },
    { value: 25000, name: "레전더리" },
    { value: 5000, name: "유니크" },
    { value: 1000, name: "레어" },
    { value: 100, name: "매직" },
    { value: 1, name: "노말" }
];

inputValue.addEventListener('input', calculateAndDisplay);
ticketValue.addEventListener('input', calculateAndDisplay);

function calculateAndDisplay() {
    let ticketCount = parseInt(ticketValue.value)/10;
    let value = parseInt(inputValue.value)*10/10*0.88*Math.floor(ticketCount);
    let ticketRemainCount = parseInt(ticketValue.value)%10;
    ticketUse.innerHTML = ticketCount*10 + '개';
    ticketRemain.innerHTML = ticketRemainCount + '개';
    tenScore.innerHTML = value*10;
    
    if (isNaN(value) || value < 0) {
        resultList.innerHTML = '<li>수련장 점수를 입력하세요.</li>';
        return;
    }

    let results = [];
    for (let denomination of denominations) {
        let quotient = Math.floor(value / denomination.value);
        if (quotient > 0) {
            results.push({ ...denomination, count: quotient });
        }
        value %= denomination.value;
    }

    displayResults(results);
    
}

function displayResults(results) {
    resultList.innerHTML = '';
    if (results.length === 0) {
        resultList.innerHTML = '<li>토벌 가능한 최소 티켓수 10개이상 입력하세요.</li>';
        return;
    }
    results.forEach((result) => {
        const li = document.createElement('li');
        li.textContent = `${result.name} (${result.value.toLocaleString()}): ${result.count}개`;
        resultList.appendChild(li);
    });
}