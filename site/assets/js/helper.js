function getColor(i) {
    return i == "PP" ? "#DA70D6" : i == "DP" ? "#5F9EA0" : i == "SLF" ? "#8B4513" : i == "Ind." ? "#2F4F4F" : i == "SA" ? "#191970" : i == "PAP" ? "#FFFAFA" : i == "LP" ? "#DC143C" : i == "British Appointee" ? "#00000" : "#00FF00"
}

function getFullPartyName(i) {
    return i == "PP" ? "Progressive Party" : i == "DP" ? "Democratic Party" : i == "SLF" ? "Labour Front" : i == "SA" ? "Singapore Alliance" : i == "PAP" ? "People's Action Party" : i == "LP" ? "Labour Party" : i == "Ind." ? "Independent" : i;
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
