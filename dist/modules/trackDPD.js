"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require('puppeteer');
const trackDPD = async (packageNum, lang) => {
    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    var trackURL = `https://tracktrace.dpd.com.pl/EN/parcelDetails?typ=1&p1=${packageNum}`;
    if (lang == 'PL')
        trackURL = `https://tracktrace.dpd.com.pl/parcelDetails?typ=1&p1=${packageNum}`;
    await page.goto(trackURL, {
        waitUntil: 'networkidle2',
    });
    await page.addScriptTag({
        url: 'https://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js',
    });
    let packages = await page.evaluate(() => {
        var pcgs = [];
        var tempPcgs = [];
        var correctNumber = $('p').text();
        if (correctNumber.startsWith('Wprowadzono błędny numer przesyłki') == false) {
            correctNumber = '';
        }
        $('td').each(function () {
            tempPcgs.push($(this).text());
        });
        if (tempPcgs != []) {
            for (var i = 0; i < tempPcgs.length; i++) {
                var val = tempPcgs[i];
                if (val.startsWith('Przekazano za granicę') == true) {
                    val = 'Przekazano za granicę';
                }
                if (val.startsWith('Przesyłka doręczona') == true) {
                    val = 'Przesyłka doręczona';
                }
                if (val == '') {
                    val = 'No data';
                }
                pcgs.push(val);
            }
        }
        return [pcgs, correctNumber];
    });
    await browser.close();
    return packages;
};
module.exports = trackDPD;
//# sourceMappingURL=trackDPD.js.map