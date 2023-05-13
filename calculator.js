// Get the form elements
let tradeInput = document.getElementById('tradeInput');
let populationInput = document.getElementById('populationInput');
let techInput = document.getElementById('techInput');
let checkboxes = document.querySelectorAll('input[type="checkbox"]');
let radioButtons = document.querySelectorAll('input[type="radio"]');

// Add event listeners
tradeInput.addEventListener('input', calculateAndUpdate);
populationInput.addEventListener('input', calculateAndUpdate);
techInput.addEventListener('input', calculateAndUpdate);
currentInvestmentTrade.addEventListener('input', calculateAndUpdate);
currentInvestmentPopulation.addEventListener('input', calculateAndUpdate);
currentInvestmentTech.addEventListener('input', calculateAndUpdate);

radioButtons.forEach((radioButton) => {
    radioButton.addEventListener('change', calculateAndUpdate);
});

// Listener for paste event
document.addEventListener('paste', function (event) {
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;

    for (var index in items) {
        var item = items[index];
        if (item.kind === 'file') {
            var blob = item.getAsFile();
            var reader = new FileReader();
            reader.onload = function(event){
                console.log('File read: ', event.target.result);
                processImage(event.target.result);
            };
            reader.readAsDataURL(blob);
        }
    }
});

function recognizeTextFromImage(image, x, y, width, height) {
    Tesseract.recognize(
        image,
        'eng',
        { 
            rectangle: { top: y, left: x, width: width, height: height }
        }
    ).then(({ data: { text } }) => {
        console.log(text);
    });
}


// Function to process the image
function processImage(imageDataUrl) {
    Tesseract.recognize(
        imageDataUrl,
        'eng'
    ).then(({ data: { text } }) => {
        console.log(`Recognized text: ${text}`); // Log recognized text

        // Extract and set values using regular expressions
        const tradeMatch = text.match(/Trade:\s(\d+)/);
        const popMatch = text.match(/Pop:\s(\d+)/);
        const techMatch = text.match(/Tech:\s(\d+)/);
        const fundPoolMatches = text.match(/Fund Pool:(\d+)\/(\d+)/g);

        if (tradeMatch) {
            document.getElementById('tradeInput').value = tradeMatch[1];
        }

        if (popMatch) {
            document.getElementById('populationInput').value = popMatch[1];
        }

        if (techMatch) {
            document.getElementById('techInput').value = techMatch[1];
        }

        if (fundPoolMatches) {
            const [tradeInvestment, popInvestment, techInvestment] = fundPoolMatches.map(match => {
                const [_, current, total] = match.match(/(\d+)\/(\d+)/);
                if (total === "50000") {
                    document.getElementById('guildEstablished').checked = true;
                } else if (total === "150000") {
                    document.getElementById('basicGuildInvestment').checked = true;
                } else if (total === "500000") {
                    document.getElementById('advancedGuildInvestment').checked = true;
                }
                return current;
            });

            document.getElementById('currentInvestmentTrade').value = tradeInvestment;
            document.getElementById('currentInvestmentPopulation').value = popInvestment;
            document.getElementById('currentInvestmentTech').value = techInvestment;
        }

        // After populating, call the function
        calculateAndUpdate();

    }).catch((err) => {
        console.error(`Error recognizing text: ${err}`); // Log error if Tesseract fails
    });
}

document.querySelectorAll('input[name="language"]').forEach((elem) => {
  elem.addEventListener('change', function() {
    if (this.value === 'English') {
      switchLanguage('en');
    } else if (this.value === 'Chinese') {
      switchLanguage('zh');
    }
  });
});

function switchLanguage(lang) {
  // Switching labels
  for (let key in translations[lang]) {
    let elem = document.querySelector(`label[data-lang="${key}"]`);
    if (elem) {
      elem.textContent = translations[lang][key];
    }
  }

  // Switching benchmarks
  benchmarks.forEach(benchmark => {
    let elem = document.querySelector(`label[for="${benchmark.id}"]`);
    if (elem) {
      elem.textContent = benchmark[`${lang}-name`];
    }
  });
}

// Add event listener for each radio button
radioButtons.forEach((radioButton) => {
    radioButton.addEventListener('change', calculateAndUpdate);
});

// Add event listener for each checkbox
checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', calculateAndUpdate);
});

const benchmarks = [
  { id: 'hobbyGoods', 'en-name': 'Hobby Goods Output +50%', 'zh-name': '业余商品产出+50%', trade: 200, population: 0, tech: 0 },
  { id: 'foodOutput', 'en-name': 'Food Output +50%', 'zh-name': '食物产出+50%', trade: 0, population: 10000, tech: 0 },
  { id: 'industrialGoods', 'en-name': 'Industrial Goods Output +50%', 'zh-name': '工业商品产出+50%', trade: 0, population: 0, tech: 200 },
  { id: 'goodsStorage', 'en-name': 'Goods Storage Limit +10%', 'zh-name': '商品存储限额+10%', trade: 300, population: 15000, tech: 0 },
  { id: 'tradeFleet1', 'en-name': '+1 Trade Fleet', 'zh-name': '贸易舰队+1', trade: 0, population: 15000, tech: 300 },
  { id: 'spiceOutput', 'en-name': 'Spice Output +50%', 'zh-name': '香料产出+50%', trade: 400, population: 0, tech: 0 },
  { id: 'beverageOutput', 'en-name': 'Beverage Output +50%', 'zh-name': '饮料产出+50%', trade: 0, population: 20000, tech: 0 },
  { id: 'textileOutput', 'en-name': 'Textile Output +50%', 'zh-name': '纺织品产出+50%', trade: 0, population: 0, tech: 400 },
  { id: 'prosperityChance', 'en-name': 'Increased Prosperity Chance', 'zh-name': '增加繁荣机会', trade: 500, population: 25000, tech: 0 },
  { id: 'tradeFleet2', 'en-name': '+2 Trade Fleet', 'zh-name': '贸易舰队+2', trade: 0, population: 25000, tech: 500 },
  { id: 'gemstoneOutput', 'en-name': 'Gemstone Output +50%', 'zh-name': '宝石产出+50%', trade: 600, population: 0, tech: 0 },
  { id: 'medicineOutput', 'en-name': 'Medicine Output +50%', 'zh-name': '医药产出+50%', trade: 0, population: 30000, tech: 0 },
  { id: 'artwareOutput', 'en-name': 'Artware Output +50%', 'zh-name': '艺术品产出+50%', trade: 0, population: 0, tech: 600 },
  { id: 'premiumGoods', 'en-name': 'Sells Premium Goods', 'zh-name': '销售高级商品', trade: 800, population: 15000, tech: 0 },
  { id: 'moreItemTypes', 'en-name': 'Unlocks More Item Types', 'zh-name': '解锁更多物品类型', trade: 0, population: 40000, tech: 300 },
  { id: 'tradeFleetRange', 'en-name': 'Increased Range of Trade Fleets', 'zh-name': '贸易舰队范围增加', trade: 300, population: 0, tech: 800 },
  { id: 'maxTrade', 'en-name': 'Max Trade', 'zh-name': '最大贸易', trade: 1000, population: 0, tech: 0 },
  { id: 'maxPopulation', 'en-name': 'Max Population', 'zh-name': '最大人口', trade: 0, population: 50000, tech: 0 },
  { id: 'maxTech', 'en-name': 'Max Technology', 'zh-name': '最大技术', trade: 0, population: 0, tech: 1000 }
];
 
const translations = {
  en: {
    investmentRequiredTradeLabel: "Investment Required for Trade: ",
    investmentRequiredPopulationLabel: "Investment Required for Population: ",
    investmentRequiredTechLabel: "Investment Required for Technology: ",
    tradeLabel: "Current Trade Level:",
    populationLabel: "Current Population:",
    techLabel: "Current Technology Level:",
    currentInvestmentTradeLabel: "Current Investment in Trade:",
    currentInvestmentPopulationLabel: "Current Investment in Population:",
    currentInvestmentTechLabel: "Current Investment in Technology:",
    permitsLabel: "Permits:",
    guildEstablishedLabel: "Guild Established",
    basicGuildInvestmentLabel: "Basic Guild Investment",
    advancedGuildInvestmentLabel: "Advanced Guild Investment"
  },
  zh: {
    investmentRequiredTradeLabel: "贸易所需投资: ",
    investmentRequiredPopulationLabel: "人口所需投资: ",
    investmentRequiredTechLabel: "技术所需投资: ",
    tradeLabel: "当前贸易等级：",
    populationLabel: "当前人口：",
    techLabel: "当前技术等级：",
    currentInvestmentTradeLabel: "当前贸易投资：",
    currentInvestmentPopulationLabel: "当前人口投资：",
    currentInvestmentTechLabel: "当前技术投资：",
    permitsLabel: "许可证：",
    guildEstablishedLabel: "公会已成立",
    basicGuildInvestmentLabel: "基础公会投资",
    advancedGuildInvestmentLabel: "高级公会投资"
  }
}

document.querySelectorAll('input[name="language"]').forEach((elem) => {
  elem.addEventListener('change', function() {
    if (this.value === 'English') {
      // Switch to English
      Object.keys(translations.en).forEach((key) => {
        let element = document.getElementById(key);
        if (element) {
          element.innerText = translations.en[key];
        }
      });

      benchmarks.forEach((benchmark) => {
        let element = document.getElementById(benchmark.id);
        if (element) {
          element.innerText = benchmark['en-name'];
        }
      });

    } else if (this.value === 'Chinese') {
      // Switch to Chinese
      console.log(`switching to Chinese`)
      Object.keys(translations.zh).forEach((key) => {
        console.log(`setting element ${key}`)
        let element = document.getElementById(key);
        if (element) {
          element.innerText = translations.zh[key];
        }
      });

      benchmarks.forEach((benchmark) => {
        console.log(`setting element ${benchmark.id}`)
        let element = document.getElementById(benchmark.id);
        if (element) {
          element.innerText = benchmark['zh-name'];
        }
      });
      console.log(`Done localizing.`)
    }
  });
});

function verbose() { return true; }

function hasBasicGuildInvestment() {
    let permit = document.querySelector('input[name="permits"]:checked').value;
    return permit === 'basicGuildInvestment' || permit === 'advancedGuildInvestment';
}

function hasAdvancedGuildInvestment() {
    let permit = document.querySelector('input[name="permits"]:checked').value;
    return permit === 'advancedGuildInvestment';
}

function calculateOverallTargets(benchmarks) {
    let overallTargetTrade = 0;
    let overallTargetPopulation = 0;
    let overallTargetTech = 0;

    for (let benchmark of benchmarks) {
        if (document.getElementById(benchmark.id).checked) {
            overallTargetTrade = Math.max(overallTargetTrade, benchmark.trade);
            overallTargetPopulation = Math.max(overallTargetPopulation, benchmark.population);
            overallTargetTech = Math.max(overallTargetTech, benchmark.tech);
        }
    }

    //if (verbose()) {
    //    console.log(`calculateOverallTargets(benchmarks) result: trade=${overallTargetTrade}, population=${overallTargetPopulation}, tech=${overallTargetTech}`);
    //}

    return { overallTargetTrade, overallTargetPopulation, overallTargetTech };
}

function calculateGoldInvestmentNeededAndConsumptionTime(category, currentPoints, targetPoints, overallGoldInvestment) {
    let naturalGrowth = category === 'population' ? 50 : 2;
    let pointGain = category === 'population' ? 500 : 10;
    let naturalGrowthCap = category === 'population' ? 30000 : 600;
    let goldInvestmentNeeded = -5000;
    let rate;
    let tempCurrentPoints = parseInt(currentPoints);
    let tempOverallGoldInvestment = parseInt(overallGoldInvestment);
    let basicGuildInvestment = hasBasicGuildInvestment();
    let advancedGuildInvestment = hasAdvancedGuildInvestment();

    let time = 0;
    while (tempCurrentPoints < targetPoints) {
        // Increment goldInvestmentNeeded by minimum increment (5000)
        goldInvestmentNeeded += 5000;
        tempCurrentPoints = parseInt(currentPoints)

        // Calculate how many months this specific gold investment will last
        let tempGoldToInvest = goldInvestmentNeeded;
        if(tempOverallGoldInvestment < goldInvestmentNeeded) { tempOverallGoldInvestment = goldInvestmentNeeded }
        time = 0;

        console.log(`Scenario: ${goldInvestmentNeeded} gold invested (${tempOverallGoldInvestment} overall), currently ${tempCurrentPoints}, target ${targetPoints}`)
        while(tempGoldToInvest > 9999 && tempCurrentPoints < targetPoints) {
            if(tempOverallGoldInvestment > 150000 && advancedGuildInvestment) {
                rate = 20000;
                pointGain = category === 'population' ? 2500 : 50;
            } else if(tempOverallGoldInvestment > 50000 && tempOverallGoldInvestment <= 150000 && basicGuildInvestment) {
                rate = 15000;
                pointGain = category === 'population' ? 1000 : 20;
            } else {
                rate = 10000;
                pointGain = category === 'population' ? 500 : 10;
            }

            tempGoldToInvest -= rate;
            tempOverallGoldInvestment -= rate;
            time++;
            tempCurrentPoints += pointGain;

            // Update points: add natural growth if under cap
            if (tempCurrentPoints < naturalGrowthCap) {
                tempCurrentPoints += naturalGrowth;
            }
            console.log(`    month ${time}, spent ${rate}g, points ${tempCurrentPoints}, gold ${tempGoldToInvest}`)
        }
    }

    if(verbose()) { console.log(`calculateGoldAndConsumptionTime(category=${category},currentPoints=${currentPoints},targetPoints=${targetPoints},overallGoldInvestment=${overallGoldInvestment}): goldInvestmentNeeded=${goldInvestmentNeeded}, time=${time}`)}
    return { goldInvestmentNeeded: goldInvestmentNeeded, consumptionTime: time };
}

function calculateAndUpdate() {
  console.log("---------- STARTING UPDATE -----------");

  // Get port values
  let portValues = {}
  portValues['trade'] = document.getElementById('tradeInput').value;
  portValues['population'] = document.getElementById('populationInput').value;
  portValues['tech'] = document.getElementById('techInput').value;
  // Initialize overall gold investments to zero and create results data structure
  let overallGoldInvestment = {}
  overallGoldInvestment['trade'] = 0;
  overallGoldInvestment['population'] = 0;
  overallGoldInvestment['tech'] = 0;
  let results = {};

  // Iterate over benchmarks for each category separately
  ['trade', 'population', 'tech'].forEach(category => {
    // Sort benchmarks in descending order based on category value
    benchmarks.sort((a, b) => b[category] - a[category]);

    for (let benchmark of benchmarks) {
      if (document.getElementById(benchmark.id).checked == false)
      {
        results[benchmark.id] = { goldInvestment: {}, timeEstimate: 0 };
        continue
      };

      console.log(`Updating '${benchmark.id}' for ${category}...`);

      // Calculate gold investment and time estimate for category
      let { goldInvestmentNeeded, consumptionTime } = calculateGoldInvestmentNeededAndConsumptionTime(category, portValues[category], benchmark[category], overallGoldInvestment[category]);
      results[benchmark.id] = results[benchmark.id] || { goldInvestment: {}, timeEstimate: 0 };
      results[benchmark.id].goldInvestment[category] = goldInvestmentNeeded;
      results[benchmark.id].timeEstimate = Math.max(results[benchmark.id].timeEstimate, consumptionTime);

      // Update overall gold investments
      overallGoldInvestment[category] = Math.max(overallGoldInvestment[category], goldInvestmentNeeded);
    }
  });

  // Update HTML for each benchmark and overall results
  for (let id in results) {
    let { goldInvestment, timeEstimate } = results[id];
    document.getElementById(id + '-results').textContent = formatInvestments(goldInvestment.trade,goldInvestment.population,goldInvestment.tech,timeEstimate);
  }

  document.getElementById('investmentRequiredTrade').textContent = Math.max(0, overallGoldInvestment['trade'] - investments.currentInvestmentTrade);
  document.getElementById('investmentRequiredPopulation').textContent = Math.max(0, overallGoldInvestment['population'] - investments.currentInvestmentPopulation);
  document.getElementById('investmentRequiredTech').textContent = Math.max(0, overallGoldInvestment['tech'] - investments.currentInvestmentTech);
}

function formatInvestments(tradeGoldInvestment, populationGoldInvestment, techGoldInvestment, timeToComplete) {
  investments = getCurrentInvestments()
  tradeGoldInvestment = Math.max(0, tradeGoldInvestment - investments.currentInvestmentTrade);
  populationGoldInvestment = Math.max(0, populationGoldInvestment - investments.currentInvestmentPopulation);
  techGoldInvestment = Math.max(0, techGoldInvestment - investments.currentInvestmentTech);

  if (tradeGoldInvestment === 0 && populationGoldInvestment === 0 && techGoldInvestment === 0) {
    return "";
  }

  let formattedInvestments = [];

  if (tradeGoldInvestment > 0) {
    formattedInvestments.push(`${tradeGoldInvestment}g in trade`);
  }

  if (populationGoldInvestment > 0) {
    formattedInvestments.push(`${populationGoldInvestment}g in population`);
  }

  if (techGoldInvestment > 0) {
    formattedInvestments.push(`${techGoldInvestment}g in tech`);
  }

  let result = formattedInvestments.join(', ');

  if (timeToComplete > 0) {
    result += ` (${timeToComplete} months)`;
  }

  return result;
}

function getCurrentInvestments() {
  let currentInvestmentTrade = parseInt(document.getElementById('currentInvestmentTrade').value) || 0;
  let currentInvestmentPopulation = parseInt(document.getElementById('currentInvestmentPopulation').value) || 0;
  let currentInvestmentTech = parseInt(document.getElementById('currentInvestmentTech').value) || 0;

  return { currentInvestmentTrade, currentInvestmentPopulation, currentInvestmentTech };
}