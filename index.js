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
// 포스 스톤
const inputValue = document.getElementById('inputValue');
const ticketValue = document.getElementById('ticketValue');
const resultList = document.getElementById('resultList');
let tenScore = document.getElementById('tenScore');
let ticketUse = document.getElementById('ticketUse');
let petScore = document.getElementById('petScore');

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
    let value = parseInt(inputValue.value)*10*0.88*Math.floor(ticketCount)*0.1;
    let ticketRemainCount = parseInt(ticketValue.value)%10;
    ticketUse.innerHTML = Math.floor(ticketCount)*10 + '개 / ' + ticketRemainCount + '개';
    tenScore.innerHTML = Math.floor(value)*10 + ' 점';
    petScore.innerHTML = Math.floor(Math.ceil(inputValue.value*7.295)*Math.floor(ticketCount)*0.88*10.4)+ ' EXP';
    
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

// 포스&각성 레벨

const force = [ 1, 100, 250, 625, 1600, 6400, 16000, 38000, 83600, 334400 ];
const inputForce = document.getElementById('inputForce');
inputForce.addEventListener('input', calculateAndDisplay2);

function calculateAndDisplay2(){
  const forceValue = parseInt(inputForce.value, 10);
  let nowForce = document.getElementById('nowForce');
  let needForce = document.getElementById('needForce');
  
  let now = 0;
  let result = 0;

  for(let i of force){
    if(forceValue < i){
      result = i - forceValue;
      break;
    }
    now++;
  }

  nowForce.innerHTML = 'Lv ' + now;
  needForce.innerHTML = result + ' 포스';
}

const awaken = [1, 5000, 20000, 100000, 500000, 2500000, 10000000, 50000000, 300000000, 1000000000];
const inputAwaken = document.getElementById('inputAwaken');
inputAwaken.addEventListener('input', calculateAndDisplay3);

function calculateAndDisplay3(){
  const awakenValue = parseInt(inputAwaken.value, 10);
  let nowAwaken = document.getElementById('nowAwaken');
  let needAwaken = document.getElementById('needAwaken');

  let now = 0;
  let result = 0;

  for(let i of awaken){
    if(awakenValue < i){
      result = i - awakenValue;
      break;
    }
    now++;
  }

  nowAwaken.innerHTML = 'Lv ' + now + ' / ' + (240 - (10 * (now - 1))) + '쿨 / 피해량 ' + ((now - 1) * 10) + ((now >= 5) ? ' + 25% 증가' : '% 증가');
  needAwaken.innerHTML = result + ' 경험치';
}


// 어빌 재설정
const locks = document.querySelectorAll('input[name="lock"]');
const inputSilver = document.getElementById('inputSilver');
const inputPage = document.getElementById('inputPage');
const maxReAbillty = document.getElementById('maxReAbillty');

locks.forEach(lock => {
    lock.addEventListener('change', maxAbilltyCount);
});

inputSilver.addEventListener('input', maxAbilltyCount);
inputPage.addEventListener('input', maxAbilltyCount);

function maxAbilltyCount(){
    let lockValue = document.querySelector('input[name="lock"]:checked').value;
    let inputSilverValue = parseInt(inputSilver.value) || 0;
    let inputPageValue = parseInt(inputPage.value) || 0;
  
    let bs = 2000 * lockValue;
    let bp = 10 * lockValue;

    let silverCount = Math.floor(inputSilverValue / bs);
    let pageCount = Math.floor(inputPageValue / bp);

    let result = Math.min(silverCount, pageCount);

    maxReAbillty.innerHTML = result + ' 번';
}

// 포스스톤 개수확인

const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', searchSheet);

function searchSheet() {
  let keyword = document.getElementById('inputSearch').value;
  const url = 'https://api.sheety.co/9754d57dee1ccb9a6b0ba6d040b3c918/is9/시트1';
  
  fetch(url)
    .then((response) => response.json())
    .then(json => {
      if (json.시트1 && json.시트1.length > 0) {
        // console.log(json.시트1);
        const result = searchKeyword(json.시트1, keyword);
        // console.log(result);
        if (result) {
          displayResult(result);
          console.log(result);
        } else {
          displayError("워크 아이디를 정확하게 입력해주세요");
        }
      } else {
        displayError("데이터가 없거나 형식이 다릅니다.");
      }
    })
    .catch(error => {
      displayError("아이디를 입력해주세요");
    });
}

function displayResult(result) {
  const resultDiv = document.getElementById('searchResult');
  resultDiv.innerHTML = `
    <div class="result-card">
      <h3>검색 결과</h3>
      <table class="result-table">
        <tr>
          <th>마지막 저장 시간</th>
          <td>${result.nextValue2}</td>
        </tr>
        <tr>
          <th>워크 아이디</th>
          <td>${result.value}</td>
        </tr>
        <tr>
          <th>닉네임</th>
          <td>${result.nextValue3}</td>
        </tr>
        <tr>
          <th>레벨</th>
          <td>${result.nextValue4}</td>
        </tr>
        <tr>
          <th>포스스톤</th>
          <td>${result.nextValue5}</td>
        </tr>
        <tr>
          <th>남은티켓수</th>
          <td>${result.nextValue6}</td>
        </tr>
      </table>
    </div>
  `;
}

function displayError(message) {
  const resultDiv = document.getElementById('searchResult');
  resultDiv.innerHTML = `<p class="error-message">${message}</p>`;
}

function searchKeyword(data, keyword) {
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    for (let key in row) {
      if (row[key] === keyword) {
        // 키워드와 정확히 일치하는 셀을 찾았을 때
        const columnIndex = Object.keys(row).indexOf(key);
        return {
          value: row[key],
          nextValue1: row[Object.keys(row)[columnIndex + 1]] || 'N/A',
          nextValue2: row[Object.keys(row)[columnIndex + 2]] || 'N/A',
          nextValue3: row[Object.keys(row)[columnIndex + 3]] || 'N/A',
          nextValue4: row[Object.keys(row)[columnIndex + 4]] || 'N/A',
          nextValue5: convertCharge(row[Object.keys(row)[columnIndex + 5]]) || 'N/A',
          nextValue6: row[Object.keys(row)[columnIndex + 6]] || 'N/A'
        };
      }
    }
  }
  return null; // 키워드를 찾지 못한 경우
}

function convertCharge(value) {
  const chargeMatch = value.match(/id:(\d+),charges:(\d+)/);
  if (chargeMatch) {
    const idValue = parseInt(chargeMatch[1]);
    const chargesValue = parseInt(chargeMatch[2]);

    let tier;
    if (idValue === 559165495) {
      tier = '신화';
    } else if (idValue === 559165494) {
      tier = '고대';
    } else if (idValue === 559165493) {
      tier = '에픽';
    } else {
      tier = '일반'; // 기본값
    }

    return `${tier} ${chargesValue} 중첩`;
  }
  return 'N/A'; // 값이 없을 경우
}