function getColor(i) {
    return i == "PP" ? "#DA70D6" : i == "DP" ? "#5F9EA0" : i == "SLF" ? "#8B4513" : i == "Ind." ? "#2F4F4F" : i == "SA" ? "#191970" : i == "PAP" ? "#FFFAFA" : i == "LP" ? "#DC143C" : i == "British Appointee" ? "#00000" : i == "Urban" ? "#E41A1C" : i == "Mixed" ? "#377EB8": i == "Rural" ? "#4DAF4A": "#00FF00"
}

function getFullPartyName(i) {
    return i == "PP" ? "Progressive Party" : i == "DP" ? "Democratic Party" : i == "SLF" ? "Labour Front" : i == "SA" ? "Singapore Alliance" : i == "PAP" ? "People's Action Party" : i == "LP" ? "Labour Party" : i == "Ind." ? "Independent" : i;
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// create popup and table for results
function resultsPopup(element) {
    data = jQuery.getJSON("data/constituencies1955.json", function (data) {
        var popup = L.popup();
        var wardName = element.target.feature.properties.name;

        var htmlString = ("<h1>").concat(wardName, "</h1><table class='result-table'><tr><th>Party</th><th>Candidate</th><th colspan='2'>Votes</th></tr>");

        for (i = 0; i < data[wardName].length; i++) {
            htmlString = htmlString.concat("<tr>");
            htmlString = htmlString.concat("<td>", data[wardName][i]['party'], "</td>");
            htmlString = htmlString.concat("<td>", data[wardName][i]['candidates'], "</td>");
            htmlString = htmlString.concat("<td class='percent'>", data[wardName][i]['vote_percentage'], "%</td>");
            htmlString = htmlString.concat("<td class='count'>", data[wardName][i]['vote_count'], "</td>");
            htmlString = htmlString.concat("</tr>");
        }
        htmlString = htmlString.concat("</table>");
        popup.setLatLng(element.target.getBounds().getCenter()).setContent(htmlString).openOn(map);
    })
}
