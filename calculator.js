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
    document.getElementById('processing-message').style.display = 'block';
    Tesseract.recognize(
        imageDataUrl,
        'eng+chi_sim+chi_tra'
    ).then(({ data: { text } }) => {
        console.log(`Recognized text: ${text}`); // Log recognized text

        // Extract and set values using regular expressions
        const firstRowMatches = text.match(/[﹕:]\s*?(\d+)/g);

        if (firstRowMatches && firstRowMatches.length >= 3) {
          console.log("match: ",firstRowMatches);
          const trade = firstRowMatches[0].match(/\d+/)[0];
          const pop = firstRowMatches[1].match(/\d+/)[0];
          const tech = firstRowMatches[2].match(/\d+/)[0];

          console.log("port trade:", trade);
          document.getElementById('tradeInput').value = trade;
          console.log("port pop:", pop);
          document.getElementById('populationInput').value = pop;
          console.log("port tech:", tech);
          document.getElementById('techInput').value = tech;
        }
        const fundPoolMatches = text.match(/:\s?(\d+)\/(?:500000|150000|50000)/g);
        if (fundPoolMatches) {
            console.log("match: ",fundPoolMatches);
            const [tradeInvestment, popInvestment, techInvestment] = fundPoolMatches.map(match => {
                const [_, current, total] = match.match(/(\d+)\/(\d+)/);
                if (total === "50000") {
                    console.log("permit level: guild established");
                    document.getElementById('guildEstablished').checked = true;
                } else if (total === "150000") {
                    console.log("permit level: basic guild investment");
                    document.getElementById('basicGuildInvestment').checked = true;
                } else if (total === "500000") {
                    console.log("permit level: advanced guild investment");
                    document.getElementById('advancedGuildInvestment').checked = true;
                }
                return current;
            });

            console.log("current trade investment::", tradeInvestment);
            document.getElementById('currentInvestmentTrade').value = tradeInvestment;
            console.log("current pop investment::", popInvestment);
            document.getElementById('currentInvestmentPopulation').value = popInvestment;
            console.log("current tech investment::", techInvestment);
            document.getElementById('currentInvestmentTech').value = techInvestment;
        }

        // After populating, call the function
        document.getElementById('screenshot-area').style.backgroundImage = "url('screenshot_default.png')";
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
{ id: 'hobbyGoods', 'en-name': 'Hobby Goods Output +50%', 'zh-name': '嗜好品产量+50%', trade: 200, population: 0, tech: 0 },
{ id: 'foodOutput', 'en-name': 'Food Output +50%', 'zh-name': '食品产量+50%', trade: 0, population: 10000, tech: 0 },
{ id: 'industrialGoods', 'en-name': 'Industrial Goods Output +50%', 'zh-name': '工业产品产量+50%', trade: 0, population: 0, tech: 200 },
{ id: 'goodsStorage', 'en-name': 'Goods Storage Limit +100%', 'zh-name': '交易品库存上限+100%', trade: 300, population: 15000, tech: 0 },
{ id: 'tradeFleet1', 'en-name': '+1 Trade Fleet', 'zh-name': '贸易舰队+1', trade: 0, population: 15000, tech: 300 },
{ id: 'spiceOutput', 'en-name': 'Spice Output +50%', 'zh-name': '香料产出+50%', trade: 400, population: 0, tech: 0 },
{ id: 'beverageOutput', 'en-name': 'Beverage Output +50%', 'zh-name': '饮品产出+50%', trade: 0, population: 20000, tech: 0 },
{ id: 'textileOutput', 'en-name': 'Textile Output +50%', 'zh-name': '纺织品产出+50%', trade: 0, population: 0, tech: 400 },
{ id: 'prosperityChance', 'en-name': 'Increased Prosperity Chance', 'zh-name': '提升港口繁荣机率', trade: 500, population: 25000, tech: 0 },
{ id: 'tradeFleet2', 'en-name': '+2 Trade Fleet', 'zh-name': '贸易舰队+2', trade: 0, population: 25000, tech: 500 },
{ id: 'gemstoneOutput', 'en-name': 'Gemstone Output +50%', 'zh-name': '宝石产量+50%', trade: 600, population: 0, tech: 0 },
{ id: 'medicineOutput', 'en-name': 'Medicine Output +50%', 'zh-name': '药品产量+50%', trade: 0, population: 30000, tech: 0 },
{ id: 'artwareOutput', 'en-name': 'Artware Output +50%', 'zh-name': '工艺品产量+50%', trade: 0, population: 0, tech: 600 },
{ id: 'premiumGoods', 'en-name': 'Sells Premium Goods', 'zh-name': '出售特级交易品', trade: 800, population: 15000, tech: 0 },
{ id: 'moreItemTypes', 'en-name': 'Unlocks More Item Types', 'zh-name': '解锁更多道具种类', trade: 0, population: 40000, tech: 300 },
{ id: 'tradeFleetRange', 'en-name': 'Increased Range of Trade Fleets', 'zh-name': '扩大贸易舰队范围', trade: 300, population: 0, tech: 800 },
{ id: 'maxTrade', 'en-name': 'Max Trade', 'zh-name': '最大贸易', trade: 1000, population: 0, tech: 0 },
{ id: 'maxPopulation', 'en-name': 'Max Population', 'zh-name': '最大人口', trade: 0, population: 50000, tech: 0 },
{ id: 'maxTech', 'en-name': 'Max Technology', 'zh-name': '最大技术', trade: 0, population: 0, tech: 1000 }
];

const translations = {
  english: {
    processingMessage: `Paste a screenshot of your trade screen here (any language).
Pulling the values from it may take up to 10 seconds, after
which the values of your permit level, current investments,
and current port levels will populate in the fields below.`,
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
    advancedGuildInvestmentLabel: "Advanced Guild Investment",
    fionaPerkLabel: "Have Fiona's perk 'Smart Merchant'"
  },
  chinese: {
    processingMessage: `请在此处粘贴您的交易屏幕截图（任何语言）。
提取数值可能需要最多10秒的时间，
之后您的许可等级、当前投资和当前港口等级的数值
将填充在下方的字段中。`,
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
    advancedGuildInvestmentLabel: "高级公会投资",
    fionaPerkLabel: "拥有菲奥娜的特权 ‘多财善贾’",
  }
}

document.querySelectorAll('input[name="language"]').forEach((elem) => {
  elem.addEventListener('change', function() {
    if (this.value === 'English') {
      // Switch to English
      Object.keys(translations.english).forEach((key) => {
        let element = document.querySelector(`[data-lang="${key}"]`);
        if (element) {
          element.innerText = translations.english[key];
        }
      });

      benchmarks.forEach((benchmark) => {
        let element = document.querySelector(`label[for="${benchmark.id}"]`);
        if (element) {
          element.innerText = benchmark['en-name'];
        }
      });

    } else if (this.value === 'Chinese') {
      // Switch to Chinese
      Object.keys(translations.chinese).forEach((key) => {
        let element = document.querySelector(`[data-lang="${key}"]`);
        if (element) {
          element.innerText = translations.chinese[key];
        }
      });

      benchmarks.forEach((benchmark) => {
        let element = document.querySelector(`label[for="${benchmark.id}"]`);
        if (element) {
          element.innerText = benchmark['zh-name'];
        }
      });
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

function calculateGoldInvestmentNeededAndConsumptionTime(category, currentPoints, targetPoints, overallGoldInvestment, has_fiona_perk) {
    let multiplier = has_fiona_perk ? 1.5 : 1;
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
        goldInvestmentNeeded += 2500;
        tempCurrentPoints = parseInt(currentPoints)

        // Calculate how many months this specific gold investment will last
        let tempGoldToInvest = goldInvestmentNeeded;
        if(tempOverallGoldInvestment < goldInvestmentNeeded) { tempOverallGoldInvestment = goldInvestmentNeeded }
        time = 0;

        if(verbose()) { console.log(`Scenario: ${goldInvestmentNeeded} gold invested (${tempOverallGoldInvestment} overall), currently ${tempCurrentPoints}, target ${targetPoints}`) }
        while(tempGoldToInvest > 9999 && tempCurrentPoints < targetPoints) {
            if(tempOverallGoldInvestment > 150000 && advancedGuildInvestment) {
                rate = 20000 * multiplier;
                pointGain = (category === 'population' ? 2500 : 50) * multiplier;
            } else if(tempOverallGoldInvestment > 50000 && tempOverallGoldInvestment <= 150000 && basicGuildInvestment) {
                rate = 15000 * multiplier;
                pointGain = (category === 'population' ? 1000 : 20) * multiplier;
            } else {
                rate = 10000 * multiplier;
                pointGain = (category === 'population' ? 500 : 10);
            }

            tempGoldToInvest -= rate;
            tempOverallGoldInvestment -= rate;
            time++;
            tempCurrentPoints += pointGain;

            // Update points: add natural growth if under cap
            if (tempCurrentPoints < naturalGrowthCap) {
                tempCurrentPoints += naturalGrowth;
            }
            if(verbose()) { console.log(`    month ${time}, spent ${rate}g, points ${tempCurrentPoints}, gold ${tempGoldToInvest}`) }
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

  // Retrieve the status of the Fiona perk from a checkbox
  let has_fiona_perk = document.getElementById('fionaPerkCheckbox').checked;

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
      let { goldInvestmentNeeded, consumptionTime } = calculateGoldInvestmentNeededAndConsumptionTime(category, portValues[category], benchmark[category], overallGoldInvestment[category], has_fiona_perk);
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
  investments = getCurrentInvestments();
  tradeGoldInvestment = Math.max(0, tradeGoldInvestment - investments.currentInvestmentTrade);
  populationGoldInvestment = Math.max(0, populationGoldInvestment - investments.currentInvestmentPopulation);
  techGoldInvestment = Math.max(0, techGoldInvestment - investments.currentInvestmentTech);

  let formattedInvestments = [];

  let language = document.querySelector('input[name="language"]:checked').value;

  if (tradeGoldInvestment === 0 && populationGoldInvestment === 0 && techGoldInvestment === 0) {
    return "";
  }

  if (tradeGoldInvestment > 0) {
    if (language === "English") {
      formattedInvestments.push(`${tradeGoldInvestment}g in trade`);
    } else {
      formattedInvestments.push(`贸易还需要投资${tradeGoldInvestment}金`);
    }
  }

  if (populationGoldInvestment > 0) {
    if (language === "English") {
      formattedInvestments.push(`${populationGoldInvestment}g in population`);
    } else {
      formattedInvestments.push(`人口还需要投资${populationGoldInvestment}金`);
    }
  }

  if (techGoldInvestment > 0) {
    if (language === "English") {
      formattedInvestments.push(`${techGoldInvestment}g in tech`);
    } else {
      formattedInvestments.push(`技术还需要投资${techGoldInvestment}金`);
    }
  }

  let result = formattedInvestments.join(', ');

  if (timeToComplete > 0) {
    if (language === "English") {
      result += ` (${timeToComplete} months)`;
    } else {
      result += ` (${timeToComplete} 月)`;
    }
  }

  return result;
}


function getCurrentInvestments() {
  let currentInvestmentTrade = parseInt(document.getElementById('currentInvestmentTrade').value) || 0;
  let currentInvestmentPopulation = parseInt(document.getElementById('currentInvestmentPopulation').value) || 0;
  let currentInvestmentTech = parseInt(document.getElementById('currentInvestmentTech').value) || 0;

  return { currentInvestmentTrade, currentInvestmentPopulation, currentInvestmentTech };
}