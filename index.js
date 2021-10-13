/**
 * Copyright Rob Smart
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

 const axios = require('axios');
 const cheerio = require('cheerio')
 const MARKETPLACE_URL = 'https://www.digitalmarketplace.service.gov.uk/digital-outcomes-and-specialists'

const getOpportunity = (id) => {
    return new Promise((resolve, reject) => {

        axios.get(MARKETPLACE_URL+'/opportunities/'+id)
        .then(({ data }) => {
            const $ = cheerio.load(data)

            let opp = {};
            opp.id = id;
            opp.specialistRole = getRowContents($, 'Specialist role');
            opp.type = opp.specialistRole ? "Digital specialists":"Digital outcomes"; 
            opp.title = $('h1').text();
            opp.buyer = getBuyer($,'.govuk-caption-l');
            opp.completedApplications = getCompletedApplications($);
            opp.getIncompleteApplications = getIncompleteApplications($);
            opp.published_date = getRowContents($, 'Published');
            opp.question_deadline = getRowContents($, 'Deadline for asking questions');
            opp.budget_range = getRowContents($, 'Budget range');
            opp.location = getRowContents($, 'Location');
            opp.latest_start_date = getRowContents($, 'Latest start date');
            opp.expected_contract_length = getRowContents($, 'Expected contract length');
            opp.problem=   getRowContents($,'Problem to be solved');
            opp.users=   getRowContents($,'Who the users are and what they need to do');
            opp.currentPhase=   getRowContents($,'Current phase');
            opp.clearance= getRowContents($,'Security clearance');
            opp.essential_skills = getTableList($,"Essential skills and experience");
            opp.nice_to_have_skills = getTableList($,"Nice-to-have skills and experience");
            opp.proposalCriteria= getRowContents($,'Proposal criteria');
          
            resolve(opp)
          })
       .catch((err) => reject(err))
    })
}

const getRowContents = function ($, rowTitle) {
    return $(".govuk-summary-list__row:contains('" + rowTitle + "')")
      .find('.govuk-summary-list__value')
      .text()
      .replace(/\n/g, '')
      .replace(/\t/g, ' ')
      .trim();
  };

const getBuyer = function ($, class_name) {
    return $(class_name)
      .first()
      .text()
      .replace(/\n/g, '')
      .trim();
};

const getCompletedApplications = function ($) {
    return $("#completed-applications")
        .find("span")
        .first()
        .text()
        .replace(/\n/g, '')
        .trim();
};

const getIncompleteApplications = function ($) {
    return $("#incomplete-applications")
        .find("span")
        .first()
        .text()
        .replace(/\n/g, '')
        .trim();
};

const getTableList = function($,list){

    let skills = [];

    const $table = $('dl:contains('+list+')');
        const $rows = $table.find('.govuk-summary-list__row');
        // A single item is not output as a list.
        $rows.each(function (index) {
          const $row = $(this);
          const $listItems = $row.find('li');
          if ($listItems.length) {
            $listItems.each(function (index) {
              const $listItem = $(this);
              skills.push($listItem.text());
            });
          } else {
            const $fieldContent = $row.find('.govuk-summary-list__value');
            skills.push($fieldContent.text().trim());
          }
        });

    return skills;
}

module.exports = {
    getOpportunity
}