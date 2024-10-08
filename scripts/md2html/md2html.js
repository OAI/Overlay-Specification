/* ReSpec supports markdown formatting, but this shows up on the page before being rendered
Hence we render the markdown to HTML ourselves, this gives us
complete control over formatting and syntax highlighting */

'use strict';

/**
 * @author Mike Ralphson <mike.ralphson@gmail.com>
 **/

const fs = require('fs');
const path = require('path');
const url = require('url');

const hljs = require('highlight.js');
const cheerio = require('cheerio');

let argv = require('yargs')
    .string('maintainers')
    .alias('m','maintainers')
    .describe('maintainers','path to MAINTAINERS.md')
    .demandCommand(1)
    .argv;
const abstract = 'What is the Overlay Specification?';
let maintainers = [];
let emeritus = [];

const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
    return '<pre class="nohighlight" tabindex="0"><code>' +
      hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
      '</code></pre>';
    }

    return '<pre class="highlight '+lang+'" tabindex="0"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

function preface(title,options) {
    const respec = {
        specStatus: "base",
        latestVersion: "https://spec.openapis.org/overlay/latest.html",
        thisVersion: `https://spec.openapis.org/overlay/v${options.subtitle}.html`,
        canonicalURI: `https://spec.openapis.org/overlay/v${options.subtitle}.html`,
        editors: maintainers,
        formerEditors: emeritus,
        publishDate: options.publishDate,
        subtitle: 'Version '+options.subtitle,
        edDraftURI: "https://github.com/OAI/Overlay-Specification/",
        shortName: "OAI Overlay",
        historyURI: null, // prevent ReSpec from fetching a W3C history based on the shortName
        lint: false,
        logos:[{
            src: "https://raw.githubusercontent.com/OAI/OpenAPI-Style-Guide/master/graphics/bitmap/OpenAPI_Logo_Pantone.png",
            alt: "OpenAPI Initiative",
            height: 48,
            url: "https://openapis.org/"}],
        otherLinks: [
            {
                key: "Participate",
                data: [
                    {
                        value: "GitHub OAI/Overlay-Specification",
                        href: "https://github.com/OAI/Overlay-Specification/",
                    },
                    {
                        value: "File a bug",
                        href: "https://github.com/OAI/Overlay-Specification/issues",
                    },
                    {
                        value: "Commit history",
                        href: `https://github.com/OAI/Overlay-Specification/commits/main/versions/${options.subtitle}.md`,
                    },
                    {
                        value: "Pull requests",
                        href: "https://github.com/OAI/Overlay-Specification/pulls",
                    },
                ],
            },
        ],
        // localBiblio: {
        //     // add local bibliography entries here, add them to https://www.specref.org/, and remove them here once published
        // }
    };

    let preface = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${md.utils.escapeHtml(title)}</title>`;

    // ReSpec
    preface += '<script src="../js/respec-w3c.js" class="remove"></script>';
    preface += `<script class="remove">var respecConfig = ${JSON.stringify(respec)};</script>`;
    try {
        preface += fs.readFileSync('./analytics/google.html','utf8');
    }
    catch (ex) {}
    preface += '</head><body>';
    preface += '<style>';
    preface += '#respec-ui { visibility: hidden; }';
    preface += '#title { color: #578000; } #subtitle { color: #578000; }';
    preface += '.dt-published { color: #578000; } .dt-published::before { content: "Published "; }';
    preface += 'h1,h2,h3,h4,h5,h6 { color: #578000; font-weight: normal; font-style: normal; }';
    preface += 'a[href] { color: #45512c; }';
    preface += 'body:not(.toc-inline) #toc h2 { color: #45512c; }';
    preface += 'table { display: block; width: 100%; overflow: auto; }';
    preface += 'table th { font-weight: 600; }';
    preface += 'table th, table td { padding: 6px 13px; border: 1px solid #dfe2e5; }';
    preface += 'table tr { background-color: #fff; border-top: 1px solid #c6cbd1; }';
    preface += 'table tr:nth-child(2n) { background-color: #f6f8fa; }';
    preface += 'pre { background-color: #f6f8fa !important; }';
    preface += 'code { color: #c83500 } th code { color: inherit }';
    preface += 'a.bibref { text-decoration: underline;}';
    preface += fs.readFileSync(path.resolve(__dirname,'gist.css'),'utf8').split(/\r?\n/).join(' ');
    preface += '</style>';
    preface += `<h1 id="title">${title.split('|')[0]}</h1>`;
    preface += `<p class="copyright">Copyright © ${options.publishDate.getFullYear()} the Linux Foundation</p>`;
    preface += `<section class="notoc" id="abstract"><h2>${abstract}</h2>\n`;
    preface += options.abstract.join('\n');
    preface += '</section>';
    preface += '<section class="override" id="sotd" data-max-toc="0">';
    preface += '<h2>Status of This Document</h2>';
    preface += 'The source-of-truth for this specification is the HTML file referenced above as <em>This version</em>.';
    preface += '</section>';

    return preface;
}

function doMaintainers() {
    let m = fs.readFileSync(argv.maintainers,'utf8');
    let h = md.render(m);
    let $ = cheerio.load(h);
    let u = $('ul').first();
    $(u).children('li').each(function(e){
        let t = $(this).text().split('@')[0];
        maintainers.push({name:t});
    });
    if ($("ul").length < 2) return;
    u = $("ul").last();
    $(u).children('li').each(function(e){
        let t = $(this).text().split('@')[0];
        emeritus.push({name:t});
    });
}

function getPublishDate(m) {
    let result = new Date();
    let h = md.render(m);
    let $ = cheerio.load(h);
    $('table').each(function(i,table){
        const h = $(table).find('th');
        const headers = [];
        $(h).each(function(i,header){
            headers.push($(header).text());
        });
        if (headers.length >= 2 && headers[0] === 'Version' && headers[1] === 'Date') {
            let c = $(table).find('tr').find('td');
            let v = $(c[0]).text();
            let d = $(c[1]).text();
            argv.subtitle = v;
            if (d !== 'TBA') result = new Date(d);
        }
    });
    return result;
}

if (argv.maintainers) {
    doMaintainers();
}

let s = fs.readFileSync(argv._[0],'utf8');

argv.publishDate = getPublishDate(s);

let lines = s.split(/\r?\n/);

let prevHeading = 0;
let inTOC = false;
let inDefs = false;
let inCodeBlock = false;
let indents = [0];
let inAbstract = false;
argv.abstract = [];

// process the markdown
for (let l in lines) {
    let line = lines[l];

    // extract Abstract
    if (line.startsWith('## Abstract')) { 
        inAbstract = true;
        line = '';
    }
    else if (line.startsWith('#')) inAbstract = false; 
    else if (inAbstract) { 
        argv.abstract.push(line);
        line = '';
    }

    // remove TOC from older spec versions, respec will generate a new one
    if (line.startsWith('## Table of Contents')) inTOC = true;
    else if (line.startsWith('#')) inTOC = false;
    if (inTOC) line = '';

    // special formatting for Definitions section
    if (line.startsWith('## Definitions')) {
        inDefs = true;
    }
    else if (line.startsWith('## ')) inDefs = false;

    // recognize code blocks
    if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
    }

    // replace <a name="..."></a> with <span id="..."></span> - respec can't deal with it, and mdv needs it for link checks
    line = line.replace(/<a name="([^"]+)"><\/a>/g,'<span id="$1"></span>');

    line = line.split('\\|').join('&#124;'); // was &brvbar

    if (!inCodeBlock) {
        // minor fixups to get RFC links to work properly
        line = line.replace(/\[RFC ?([0-9]{1,5})\]\(/g,'[[RFC$1]](');

        // handle url fragments in RFC links and construct section links as well as RFC links
        line = line.replace(/\]\]\(https:\/\/tools.ietf.org\/html\/rfc([0-9]{1,5})\/?(\#[^)]*)?\)/g, function(match, rfcNumber, fragment) {
            if (fragment) {
                // Extract section title from the fragment
                let sectionTitle = fragment.replace('#', '').replace(/-/g, ' ');
                sectionTitle = sectionTitle.charAt(0).toUpperCase() + sectionTitle.slice(1); // Capitalize the first letter
                //TODO: section links to https://www.rfc-editor.org/rfc/rfc* for newer RFCs (>= 8700)
                return `]] [${sectionTitle}](https://datatracker.ietf.org/doc/html/rfc${rfcNumber}${fragment})`;
            } else {
                return ']]';
            }
        });
    }

    // fix indentation of headings
    // - make sure that each heading is at most one level deeper than the previous heading
    // - reduce heading level by one if we're in respec mode except for h1
    if (!inCodeBlock && line.startsWith('#')) {
        let indent = 0;
        while (line[indent] === '#') indent++;
        let originalIndent = indent;

        let prevIndent = indents[indents.length-1]; // peek
        let delta = indent-prevIndent;

        if (indent > 1) {
            indent--;
        }
        let newIndent = indent;

        let title = line.split('# ')[1];
        if (inDefs) title = '<dfn>'+title+'</dfn>';
        line = ('#'.repeat(newIndent)+' '+title);

        if (delta>0) indents.push(originalIndent);
        if (delta<0) {
            let d = Math.abs(delta);
            while (d>0) {
                indents.pop();
                d--;
            }
        }
    }

    // wrap section text in <section>...</section> tags for respec
    if (!inCodeBlock && line.startsWith('#')) {
        let heading = 0;
        while (line[heading] === '#') heading++;
        let delta = heading-prevHeading;
        if (delta>1) console.warn(delta,line);
        if (delta>0) delta = 1;
        let prefix = '';
        let newSection = '<section>';
        const m = line.match(/# Version ([0-9.]+)$/);
        if (m) {
            // our conformance section is headlined with 'Version x.y.z'
            // and respec needs a conformance section in a "formal" specification
            newSection = '<section class="override" id="conformance">';
            // adjust the heading to be at level 2 because respec insists on h2 here
            // Note: older specs had this at h4, newer specs at h2, and all heading levels have been reduced by 1 in the preceding block
            line = '#' + m[0];
            delta = 1;
            heading = 2;
        }
        if (line.includes('Appendix')) {
            newSection = '<section class="appendix">';
        }

        // heading level delta is either 0 or is +1/-1, or we're in respec mode
        // respec insists on <section>...</section> breaks around headings

        if (delta === 0) {
            prefix = '</section>'+newSection;
        }
        else if (delta > 0) {
            prefix = newSection.repeat(delta);
        }
        else {
            prefix = '</section>'+('</section>').repeat(Math.abs(delta))+newSection;
        }
        prevHeading = heading;
        line = prefix+md.render(line);
    }

    lines[l] = line;
}

s = preface(`Overlay Specification v${argv.subtitle} | Introduction, Definitions, & More`,argv)+'\n\n'+lines.join('\n');
let out = md.render(s);
console.log(out);
