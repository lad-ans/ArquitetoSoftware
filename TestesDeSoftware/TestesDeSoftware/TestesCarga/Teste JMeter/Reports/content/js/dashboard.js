/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.38709677419355, "KoPercent": 1.6129032258064515};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6713709677419355, 800, 1800, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7, 800, 1800, "Home Page-11"], "isController": false}, {"data": [0.2, 800, 1800, "Home Page-10"], "isController": false}, {"data": [0.3, 800, 1800, "Home Page-13"], "isController": false}, {"data": [0.5, 800, 1800, "Home Page-12"], "isController": false}, {"data": [0.0, 800, 1800, "Home Page"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-48"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-47"], "isController": false}, {"data": [0.8, 800, 1800, "Home Page-3"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-22"], "isController": false}, {"data": [0.7, 800, 1800, "Home Page-4"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-21"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-1"], "isController": false}, {"data": [0.4, 800, 1800, "Home Page-24"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-2"], "isController": false}, {"data": [0.7, 800, 1800, "Home Page-23"], "isController": false}, {"data": [0.4, 800, 1800, "Home Page-0"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-20"], "isController": false}, {"data": [0.1, 800, 1800, "Home Page-9"], "isController": false}, {"data": [0.2, 800, 1800, "Home Page-7"], "isController": false}, {"data": [0.4, 800, 1800, "Home Page-8"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-5"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-6"], "isController": false}, {"data": [0.6, 800, 1800, "Home Page-19"], "isController": false}, {"data": [0.3, 800, 1800, "Home Page-18"], "isController": false}, {"data": [0.3, 800, 1800, "Home Page-15"], "isController": false}, {"data": [0.3, 800, 1800, "Home Page-14"], "isController": false}, {"data": [0.5, 800, 1800, "Home Page-17"], "isController": false}, {"data": [0.5, 800, 1800, "Home Page-16"], "isController": false}, {"data": [0.8, 800, 1800, "Home Page-33"], "isController": false}, {"data": [0.6, 800, 1800, "Home Page-32"], "isController": false}, {"data": [0.9, 800, 1800, "Home Page-35"], "isController": false}, {"data": [0.9, 800, 1800, "Home Page-34"], "isController": false}, {"data": [0.3, 800, 1800, "Home Page-31"], "isController": false}, {"data": [0.5, 800, 1800, "Home Page-30"], "isController": false}, {"data": [0.4, 800, 1800, "Home Page-29"], "isController": false}, {"data": [0.4, 800, 1800, "Home Page-26"], "isController": false}, {"data": [0.3, 800, 1800, "Home Page-25"], "isController": false}, {"data": [0.4, 800, 1800, "Home Page-28"], "isController": false}, {"data": [0.5, 800, 1800, "Home Page-27"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-44"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-43"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-46"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-45"], "isController": false}, {"data": [0.9, 800, 1800, "Home Page-40"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-42"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-41"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-37"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-36"], "isController": false}, {"data": [0.9, 800, 1800, "Home Page-39"], "isController": false}, {"data": [1.0, 800, 1800, "Home Page-38"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 248, 4, 1.6129032258064515, 1243.0241935483862, 40, 11677, 585.0, 3646.0, 4442.8499999999985, 11460.02, 16.051779935275082, 1157.4438713592233, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Home Page-11", 5, 0, 0.0, 823.0, 157, 1308, 1147.0, 1308.0, 1308.0, 1308.0, 1.0460251046025104, 4.193089696652719, 0.0], "isController": false}, {"data": ["Home Page-10", 5, 0, 0.0, 1971.0, 1200, 3287, 1949.0, 3287.0, 3287.0, 3287.0, 1.0144045445323595, 31.63218483718807, 0.0], "isController": false}, {"data": ["Home Page-13", 5, 0, 0.0, 2404.2, 128, 4090, 2993.0, 4090.0, 4090.0, 4090.0, 0.646579593948015, 77.10688970968576, 0.0], "isController": false}, {"data": ["Home Page-12", 5, 0, 0.0, 1826.0, 77, 4085, 1670.0, 4085.0, 4085.0, 4085.0, 0.628693574751666, 42.35061651263674, 0.0], "isController": false}, {"data": ["Home Page", 5, 4, 80.0, 10928.6, 10017, 11677, 11459.0, 11677.0, 11677.0, 11677.0, 0.32362459546925565, 578.7219356796116, 0.0], "isController": false}, {"data": ["Home Page-48", 3, 0, 0.0, 72.33333333333333, 51, 84, 82.0, 84.0, 84.0, 84.0, 1.095690284879474, 2.0308790631848064, 0.0], "isController": false}, {"data": ["Home Page-47", 5, 0, 0.0, 108.4, 51, 245, 88.0, 245.0, 245.0, 245.0, 1.088613106901807, 4.309164421402134, 0.0], "isController": false}, {"data": ["Home Page-3", 5, 0, 0.0, 759.4, 254, 1480, 567.0, 1480.0, 1480.0, 1480.0, 1.1734334663224595, 59.93471859598686, 0.0], "isController": false}, {"data": ["Home Page-22", 5, 0, 0.0, 82.6, 44, 106, 89.0, 106.0, 106.0, 106.0, 0.8788890841975743, 2.276357059676569, 0.0], "isController": false}, {"data": ["Home Page-4", 5, 0, 0.0, 812.8, 218, 1350, 990.0, 1350.0, 1350.0, 1350.0, 1.0195758564437194, 36.29212122756933, 0.0], "isController": false}, {"data": ["Home Page-21", 5, 0, 0.0, 72.6, 40, 97, 74.0, 97.0, 97.0, 97.0, 0.8931761343336906, 1.2821962084673098, 0.0], "isController": false}, {"data": ["Home Page-1", 5, 0, 0.0, 347.8, 236, 550, 314.0, 550.0, 550.0, 550.0, 1.2588116817724069, 15.671221991440081, 0.0], "isController": false}, {"data": ["Home Page-24", 5, 0, 0.0, 1983.4, 1377, 3682, 1680.0, 3682.0, 3682.0, 3682.0, 0.6793478260869565, 34.83608079993206, 0.0], "isController": false}, {"data": ["Home Page-2", 5, 0, 0.0, 135.6, 50, 266, 129.0, 266.0, 266.0, 266.0, 1.294665976178146, 1.33588288127913, 0.0], "isController": false}, {"data": ["Home Page-23", 5, 0, 0.0, 1021.8, 59, 3684, 147.0, 3684.0, 3684.0, 3684.0, 0.802181934862827, 18.571295172870208, 0.0], "isController": false}, {"data": ["Home Page-0", 5, 0, 0.0, 1415.8, 1148, 2012, 1308.0, 2012.0, 2012.0, 2012.0, 0.9712509712509713, 8.889033058954935, 0.0], "isController": false}, {"data": ["Home Page-20", 5, 0, 0.0, 75.2, 46, 92, 83.0, 92.0, 92.0, 92.0, 0.9018759018759018, 1.5178641887626263, 0.0], "isController": false}, {"data": ["Home Page-9", 5, 0, 0.0, 3282.2, 1685, 4482, 3770.0, 4482.0, 4482.0, 4482.0, 0.7275902211874273, 38.012183725625725, 0.0], "isController": false}, {"data": ["Home Page-7", 5, 0, 0.0, 4930.4, 1265, 9546, 6056.0, 9546.0, 9546.0, 9546.0, 0.4082965866405357, 60.502935269679895, 0.0], "isController": false}, {"data": ["Home Page-8", 5, 0, 0.0, 1629.0, 1110, 2911, 1210.0, 2911.0, 2911.0, 2911.0, 0.757346258709482, 16.987039912147832, 0.0], "isController": false}, {"data": ["Home Page-5", 5, 0, 0.0, 232.6, 177, 345, 231.0, 345.0, 345.0, 345.0, 1.2919896640826873, 8.790576550387597, 0.0], "isController": false}, {"data": ["Home Page-6", 5, 0, 0.0, 291.2, 225, 371, 285.0, 371.0, 371.0, 371.0, 1.2569130216189042, 16.326121794871796, 0.0], "isController": false}, {"data": ["Home Page-19", 5, 0, 0.0, 1567.0, 46, 4395, 1630.0, 4395.0, 4395.0, 4395.0, 0.5379814934366257, 27.835183485313102, 0.0], "isController": false}, {"data": ["Home Page-18", 5, 0, 0.0, 1451.2, 1112, 1983, 1239.0, 1983.0, 1983.0, 1983.0, 0.7783312577833126, 56.627247431506845, 0.0], "isController": false}, {"data": ["Home Page-15", 5, 0, 0.0, 2680.8, 130, 4578, 3599.0, 4578.0, 4578.0, 4578.0, 0.6861534239055853, 98.07383868533005, 0.0], "isController": false}, {"data": ["Home Page-14", 5, 0, 0.0, 2019.6, 546, 3695, 1891.0, 3695.0, 3695.0, 3695.0, 0.6148548942449582, 69.1860666195278, 0.0], "isController": false}, {"data": ["Home Page-17", 5, 0, 0.0, 1466.2, 203, 4075, 942.0, 4075.0, 4075.0, 4075.0, 0.6606765327695561, 33.75115102239694, 0.0], "isController": false}, {"data": ["Home Page-16", 5, 0, 0.0, 1692.4, 569, 3517, 1388.0, 3517.0, 3517.0, 3517.0, 0.6097560975609756, 34.39238757621951, 0.0], "isController": false}, {"data": ["Home Page-33", 5, 0, 0.0, 788.4, 552, 1145, 679.0, 1145.0, 1145.0, 1145.0, 0.9084302325581395, 48.83433497229288, 0.0], "isController": false}, {"data": ["Home Page-32", 5, 0, 0.0, 1116.0, 683, 1651, 1140.0, 1651.0, 1651.0, 1651.0, 0.9674922600619195, 51.057892318111456, 0.0], "isController": false}, {"data": ["Home Page-35", 5, 0, 0.0, 293.0, 48, 871, 94.0, 871.0, 871.0, 871.0, 0.9551098376313276, 13.403809992836676, 0.0], "isController": false}, {"data": ["Home Page-34", 5, 0, 0.0, 334.8, 51, 935, 311.0, 935.0, 935.0, 935.0, 0.9527439024390244, 32.025220917492376, 0.0], "isController": false}, {"data": ["Home Page-31", 5, 0, 0.0, 2126.0, 1006, 4715, 1298.0, 4715.0, 4715.0, 4715.0, 0.569216757741348, 30.055423034779142, 0.0], "isController": false}, {"data": ["Home Page-30", 5, 0, 0.0, 1052.2, 899, 1271, 965.0, 1271.0, 1271.0, 1271.0, 0.8577800651912849, 45.94936819137074, 0.0], "isController": false}, {"data": ["Home Page-29", 5, 0, 0.0, 1711.4, 944, 3642, 1180.0, 3642.0, 3642.0, 3642.0, 0.5576622797233995, 30.755619318815526, 0.0], "isController": false}, {"data": ["Home Page-26", 5, 0, 0.0, 1261.0, 889, 2249, 954.0, 2249.0, 2249.0, 2249.0, 0.6771397616468039, 36.911126464314734, 0.0], "isController": false}, {"data": ["Home Page-25", 5, 0, 0.0, 2331.6, 885, 4345, 1632.0, 4345.0, 4345.0, 4345.0, 0.4947066389630949, 25.997123744681904, 0.0], "isController": false}, {"data": ["Home Page-28", 5, 0, 0.0, 1681.8, 846, 4744, 920.0, 4744.0, 4744.0, 4744.0, 0.7944073721004131, 42.27426418017159, 0.0], "isController": false}, {"data": ["Home Page-27", 5, 0, 0.0, 1052.4, 803, 1551, 975.0, 1551.0, 1551.0, 1551.0, 0.776156473144986, 42.13438179136914, 0.0], "isController": false}, {"data": ["Home Page-44", 5, 0, 0.0, 118.0, 77, 250, 90.0, 250.0, 250.0, 250.0, 1.0564124234100993, 8.732321598351998, 0.0], "isController": false}, {"data": ["Home Page-43", 5, 0, 0.0, 119.2, 56, 298, 88.0, 298.0, 298.0, 298.0, 1.0490977759127151, 6.747624777066723, 0.0], "isController": false}, {"data": ["Home Page-46", 5, 0, 0.0, 121.4, 80, 167, 118.0, 167.0, 167.0, 167.0, 1.0602205258693809, 4.1899418203986425, 0.0], "isController": false}, {"data": ["Home Page-45", 5, 0, 0.0, 81.0, 51, 145, 55.0, 145.0, 145.0, 145.0, 1.0645092612305727, 2.312396875665318, 0.0], "isController": false}, {"data": ["Home Page-40", 5, 0, 0.0, 305.6, 55, 1033, 189.0, 1033.0, 1033.0, 1033.0, 1.026694045174538, 23.73267453798768, 0.0], "isController": false}, {"data": ["Home Page-42", 5, 0, 0.0, 72.8, 47, 108, 55.0, 108.0, 108.0, 108.0, 1.0539629005059021, 1.8370243992411468, 0.0], "isController": false}, {"data": ["Home Page-41", 5, 0, 0.0, 62.0, 45, 74, 68.0, 74.0, 74.0, 74.0, 1.0550749103186325, 1.394471077759021, 0.0], "isController": false}, {"data": ["Home Page-37", 5, 0, 0.0, 164.8, 86, 270, 158.0, 270.0, 270.0, 270.0, 1.0123506782749545, 11.279010174124316, 0.0], "isController": false}, {"data": ["Home Page-36", 5, 0, 0.0, 290.2, 125, 453, 311.0, 453.0, 453.0, 453.0, 0.9259259259259259, 21.845703125, 0.0], "isController": false}, {"data": ["Home Page-39", 5, 0, 0.0, 375.0, 45, 1134, 102.0, 1134.0, 1134.0, 1134.0, 1.0606703436571914, 20.236844373143825, 0.0], "isController": false}, {"data": ["Home Page-38", 5, 0, 0.0, 141.2, 92, 261, 120.0, 261.0, 261.0, 261.0, 1.0414496979795875, 11.207788741928765, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /&lt;h1 class=&quot;texto-azul-banner-console modern-font&quot;&gt;N&Oacute;S SOMOS A DESENVOLVEDOR.IO&lt;/h1&gt;/", 4, 100.0, 1.6129032258064515], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 248, 4, "Test failed: text expected to contain /&lt;h1 class=&quot;texto-azul-banner-console modern-font&quot;&gt;N&Oacute;S SOMOS A DESENVOLVEDOR.IO&lt;/h1&gt;/", 4, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Home Page", 5, 4, "Test failed: text expected to contain /&lt;h1 class=&quot;texto-azul-banner-console modern-font&quot;&gt;N&Oacute;S SOMOS A DESENVOLVEDOR.IO&lt;/h1&gt;/", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
