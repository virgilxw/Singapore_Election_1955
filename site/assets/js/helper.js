function getColor(i) {
    return i == "PP" ? "#DA70D6" : i == "DP" ? "#AFEEEE" : i == "SLF" ? "#8B4513" : i == "Ind." ? "#708090" : i == "SA" ? "#191970" : i == "PAP" ? "#F5F5F5" : i == "LP" ? "#8B0000" : i == "British Appointee" ? "#00000" : "#00FF00"
}

function getFullPartyName(i) {
    return i == "PP" ? "Progressive Party" : i == "DP" ? "Democratic Party" : i == "SLF" ? "Labour Front" : i == "SA" ? "Singapore Alliance" : i == "PAP" ? "People's Action Party" : i == "LP" ? "Labour Party" : i == "Ind." ? "Independent" : i;
}
