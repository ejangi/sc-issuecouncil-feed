const fs = require('fs');
const axios = require('axios');
const dateformat = require('dateformat');
const hbs = require("handlebars");

hbs.registerHelper('uri', function (aString) {
    return aString.replace(/[^a-z0-9]+/gi, '-');
});

hbs.registerHelper('stat', function (s) {
    switch(s) {
        case 'F':
            return 'Fixed';
            break;
        case 'C':
            return 'Confirmed';
            break;
        case 'A':
            return 'Acknowledged';
            break;
        case 'I':
            return 'Invalid';
            break;
        case '_expired':
            return 'Expired';
            break;
        default:
            return 'Triage';
    }
});

hbs.registerHelper('pubDate', function(aDate) {
    let tDate = aDate.replace(' ', 'T');
    let d = Date.parse(tDate);
    return dateformat(d, "ddd, dd mmm yyyy HH:mm:ss o");
});

hbs.registerHelper('upDate', function(aDate) {
    let tDate = aDate.replace(' ', 'T');
    let d = Date.parse(tDate);
    return dateformat(d, "yyyy-mm-dd'T'HH:mm:ss'Z'");
});

/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.scIssueCouncilFeed = async (req, res) => {
    axios.post(
            "https://robertsspaceindustries.com/community/issue-council/api/issue/list",
            {
                "expired":false,
                "module_url":"star-citizen-alpha-3",
                "page":1,
                "pagesize":25,
                "sort":"newest",
                "status":"F",
                "time":"this_month"
            }
        )
        .then(response => {
            console.log("Success! " + response.data.data.rowcount + " rows.");
            res.set('Content-Type', 'text/xml');
            res.status(200).send(resultsToFeed(response.data.data));
            // res.status(200).send(response.data.data.resultset);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({"error": err});
        });
};



function resultsToFeed(results) {
    var source = fs.readFileSync('./feed.xml', 'utf8');
    var template = hbs.compile(source);
    results.icurl = "https://robertsspaceindustries.com/community/issue-council/star-citizen-alpha-3";
    results.url = process.env.url;
    results.buildDate = dateformat(Date.now(), "ddd, dd mmm yyyy HH:mm:ss o")
    return template(results);
}